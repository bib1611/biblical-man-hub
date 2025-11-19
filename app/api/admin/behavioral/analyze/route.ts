import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/behavioral/analyze
 *
 * Uses Claude AI to analyze behavioral data and provide actionable insights:
 * - JavaScript error analysis with fix recommendations
 * - UX issue diagnosis (rage clicks, dead clicks, form abandonment)
 * - Conversion optimization suggestions
 * - Performance recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const behavioralData = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Build comprehensive analysis prompt
    const analysisPrompt = buildAnalysisPrompt(behavioralData);

    console.log('🤖 Requesting Claude AI analysis of behavioral data...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: `You are an expert UX analyst and web developer who analyzes user behavioral data to identify problems and provide actionable solutions. Be direct, specific, and focus on high-impact fixes.`,
        messages: [
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.content[0].text;

    console.log('✅ Claude AI analysis complete');

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI analysis' },
      { status: 500 }
    );
  }
}

function buildAnalysisPrompt(data: any): string {
  const { summary, rageClicks, deadClicks, scrollDepth, formAbandonment, errors } = data;

  let prompt = `Analyze this behavioral analytics data from a website and provide specific, actionable recommendations:

## SUMMARY STATS
- Total Behavioral Events: ${summary.totalBehavioralEvents}
- Rage Clicks: ${summary.totalRageClicks}
- Dead Clicks: ${summary.totalDeadClicks}
- Form Abandonments: ${summary.totalFormAbandonment}
- JavaScript Errors: ${summary.totalErrors}
- Tab Switch Rate: ${summary.tabSwitchRate}
- Idle Rate: ${summary.idleRate}

`;

  // JavaScript Errors Analysis
  if (errors.recentErrors && errors.recentErrors.length > 0) {
    prompt += `## JAVASCRIPT ERRORS (${errors.recentErrors.length} recent)\n`;
    errors.recentErrors.slice(0, 10).forEach((error: any, index: number) => {
      prompt += `${index + 1}. [${error.type}] ${error.message}\n   Page: ${error.page}\n`;
    });
    prompt += '\n';
  }

  // Rage Clicks Analysis
  if (Object.keys(rageClicks.byPage).length > 0) {
    prompt += `## RAGE CLICKS BY PAGE (Frustrated Users)\n`;
    Object.entries(rageClicks.byPage)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .forEach(([page, count]) => {
        prompt += `- ${page}: ${count} rage clicks\n`;
      });
    prompt += '\n';
  }

  // Dead Clicks Analysis
  if (Object.keys(deadClicks.byPage).length > 0) {
    prompt += `## DEAD CLICKS BY PAGE (Non-interactive Elements)\n`;
    Object.entries(deadClicks.byPage)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .forEach(([page, count]) => {
        prompt += `- ${page}: ${count} dead clicks\n`;
      });
    prompt += '\n';
  }

  // Scroll Depth Analysis
  if (Object.keys(scrollDepth).length > 0) {
    prompt += `## SCROLL DEPTH BY PAGE\n`;
    Object.entries(scrollDepth)
      .sort(([, a], [, b]) => (b as any).avg - (a as any).avg)
      .slice(0, 5)
      .forEach(([page, stats]: [string, any]) => {
        prompt += `- ${page}: ${stats.avg}% average scroll depth\n`;
      });
    prompt += '\n';
  }

  // Form Abandonment Analysis
  if (Object.keys(formAbandonment).length > 0) {
    prompt += `## FORM ABANDONMENT BY FIELD\n`;
    Object.entries(formAbandonment)
      .sort(([, a], [, b]) => (b as any).abandonmentRate - (a as any).abandonmentRate)
      .slice(0, 5)
      .forEach(([field, stats]: [string, any]) => {
        prompt += `- ${field}: ${stats.abandonmentRate}% abandonment (${stats.abandoned}/${stats.focused})\n`;
      });
    prompt += '\n';
  }

  prompt += `## YOUR TASK
Provide a comprehensive analysis with:

1. **CRITICAL ISSUES** - List the top 3-5 most urgent problems that need immediate attention
2. **ERROR ANALYSIS** - For each JavaScript error, explain what's likely causing it and how to fix it
3. **UX ISSUES** - Analyze rage clicks, dead clicks, and form abandonment patterns
4. **SCROLL DEPTH INSIGHTS** - What the scroll depth data reveals about content engagement
5. **ACTIONABLE RECOMMENDATIONS** - Specific code fixes, UX improvements, and priority order

Be direct and technical. Focus on high-impact fixes that will improve user experience and conversion rates.`;

  return prompt;
}
