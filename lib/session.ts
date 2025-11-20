// Session Management & User Recognition System
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface UserAccount {
  id: string;
  email?: string;
  role: 'creator' | 'admin' | 'user';
  displayName?: string;
  avatarUrl?: string;
  isCreator: boolean;
  deviceFingerprints: string[];
  knownIps: string[];
  lastLogin?: string;
  lastSeen?: string;
  loginCount: number;
  preferences: Record<string, any>;
  uiState: Record<string, any>;
  viewedArticles: string[];
  favoriteProducts: string[];
  bookmarkedVerses: string[];
  radioPreferences: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  deviceFingerprint?: string;
  deviceType?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  isActive: boolean;
  lastActivity: string;
  expiresAt: string;
  pageViews: number;
  sessionDuration: number;
  createdAt: string;
  updatedAt: string;
}

// Generate secure session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate session ID
export function generateSessionId(): string {
  return `session_${crypto.randomUUID()}`;
}

// Generate user ID
export function generateUserId(): string {
  return `user_${crypto.randomUUID()}`;
}

/**
 * Create or get user by device fingerprint
 * This enables automatic recognition across sessions
 */
export async function getOrCreateUser(params: {
  fingerprint: string;
  ip: string;
  email?: string;
  userAgent?: string;
  deviceInfo?: {
    browser?: string;
    browserVersion?: string;
    os?: string;
    osVersion?: string;
    deviceType?: string;
  };
}): Promise<UserAccount | null> {
  try {
    const { fingerprint, ip, email } = params;

    // Use Supabase function to get or create user
    const { data, error } = await supabase.rpc('get_or_create_user_by_fingerprint', {
      p_fingerprint: fingerprint,
      p_ip: ip,
      p_email: email || null
    });

    if (error) {
      console.error('Error in get_or_create_user_by_fingerprint:', error);
      return null;
    }

    const userId = data as string;

    // Fetch full user account
    const { data: user, error: userError } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('Error fetching user account:', userError);
      return null;
    }

    return mapSupabaseUser(user);
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

/**
 * Get user by email (for login)
 */
export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return mapSupabaseUser(data);
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<UserAccount | null> {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return mapSupabaseUser(data);
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
}

/**
 * Create new session
 */
export async function createSession(params: {
  userId: string;
  fingerprint?: string;
  ip?: string;
  userAgent?: string;
  deviceInfo?: {
    browser?: string;
    browserVersion?: string;
    os?: string;
    osVersion?: string;
    deviceType?: string;
  };
  location?: {
    country?: string;
    city?: string;
  };
  expiresInDays?: number;
}): Promise<UserSession | null> {
  try {
    const sessionId = generateSessionId();
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays || 30)); // Default 30 days

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        id: sessionId,
        user_id: params.userId,
        session_token: sessionToken,
        device_fingerprint: params.fingerprint,
        device_type: params.deviceInfo?.deviceType,
        browser: params.deviceInfo?.browser,
        browser_version: params.deviceInfo?.browserVersion,
        os: params.deviceInfo?.os,
        os_version: params.deviceInfo?.osVersion,
        user_agent: params.userAgent,
        ip_address: params.ip,
        country: params.location?.country,
        city: params.location?.city,
        is_active: true,
        last_activity: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        page_views: 0,
        session_duration: 0
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating session:', error);
      return null;
    }

    // Update user last_login
    await supabase
      .from('user_accounts')
      .update({
        last_login: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        login_count: supabase.rpc('increment', { user_id: params.userId })
      })
      .eq('id', params.userId);

    return mapSupabaseSession(data);
  } catch (error) {
    console.error('Error in createSession:', error);
    return null;
  }
}

/**
 * Get session by token
 */
export async function getSessionByToken(token: string): Promise<UserSession | null> {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', token)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      await invalidateSession(data.id);
      return null;
    }

    // Update last activity
    await supabase
      .from('user_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', data.id);

    return mapSupabaseSession(data);
  } catch (error) {
    console.error('Error in getSessionByToken:', error);
    return null;
  }
}

/**
 * Invalidate session (logout)
 */
export async function invalidateSession(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    return !error;
  } catch (error) {
    console.error('Error in invalidateSession:', error);
    return false;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_accounts')
      .update({ preferences })
      .eq('id', userId);

    return !error;
  } catch (error) {
    console.error('Error updating preferences:', error);
    return false;
  }
}

/**
 * Update UI state (remember scroll position, last app, etc.)
 */
export async function updateUIState(
  userId: string,
  uiState: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_accounts')
      .update({ ui_state: uiState })
      .eq('id', userId);

    return !error;
  } catch (error) {
    console.error('Error updating UI state:', error);
    return false;
  }
}

/**
 * Track user activity
 */
export async function trackActivity(params: {
  userId: string;
  sessionId: string;
  activityType: string;
  activityData?: Record<string, any>;
  appName?: string;
  urlPath?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_activity_log')
      .insert({
        id: `activity_${crypto.randomUUID()}`,
        user_id: params.userId,
        session_id: params.sessionId,
        activity_type: params.activityType,
        activity_data: params.activityData || {},
        app_name: params.appName,
        url_path: params.urlPath
      });

    return !error;
  } catch (error) {
    console.error('Error tracking activity:', error);
    return false;
  }
}

/**
 * Add viewed article to user history
 */
export async function addViewedArticle(userId: string, articleSlug: string): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    if (!user) return false;

    const viewedArticles = user.viewedArticles || [];
    if (!viewedArticles.includes(articleSlug)) {
      viewedArticles.unshift(articleSlug); // Add to beginning
      // Keep only last 50 articles
      const updated = viewedArticles.slice(0, 50);

      const { error } = await supabase
        .from('user_accounts')
        .update({ viewed_articles: updated })
        .eq('id', userId);

      return !error;
    }
    return true;
  } catch (error) {
    console.error('Error adding viewed article:', error);
    return false;
  }
}

/**
 * Get creator insights
 */
export async function getCreatorInsights(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('creator_insights')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error('Error fetching creator insights:', error);
    return null;
  }
}

// Mappers
function mapSupabaseUser(data: any): UserAccount {
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    isCreator: data.is_creator || false,
    deviceFingerprints: data.device_fingerprints || [],
    knownIps: data.known_ips || [],
    lastLogin: data.last_login,
    lastSeen: data.last_seen,
    loginCount: data.login_count || 0,
    preferences: data.preferences || {},
    uiState: data.ui_state || {},
    viewedArticles: data.viewed_articles || [],
    favoriteProducts: data.favorite_products || [],
    bookmarkedVerses: data.bookmarked_verses || [],
    radioPreferences: data.radio_preferences || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function mapSupabaseSession(data: any): UserSession {
  return {
    id: data.id,
    userId: data.user_id,
    sessionToken: data.session_token,
    deviceFingerprint: data.device_fingerprint,
    deviceType: data.device_type,
    browser: data.browser,
    browserVersion: data.browser_version,
    os: data.os,
    osVersion: data.os_version,
    userAgent: data.user_agent,
    ipAddress: data.ip_address,
    country: data.country,
    city: data.city,
    isActive: data.is_active,
    lastActivity: data.last_activity,
    expiresAt: data.expires_at,
    pageViews: data.page_views || 0,
    sessionDuration: data.session_duration || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
