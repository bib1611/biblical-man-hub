// Clear session cookies and redirect to home
// Preserves localStorage fingerprint for auto-recognition

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();

  // Delete session cookie
  cookieStore.delete('session_token');

  // Return HTML that clears sessionStorage and redirects
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Refreshing Session...</title>
    <meta charset="UTF-8">
    <style>
        body {
            background: #000;
            color: #fff;
            font-family: system-ui;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
        }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { color: #999; }
        .spinner {
            width: 40px;
            height: 40px;
            margin: 20px auto;
            border: 4px solid #333;
            border-top: 4px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .info {
            background: #1a1a1a;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            color: #999;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Refreshing Session</h1>
        <div class="spinner"></div>
        <p id="status">Clearing session...</p>
        <div class="info">
            <strong>Note:</strong> Your device fingerprint is preserved.<br>
            You will be automatically recognized as the creator.
        </div>
    </div>
    <script>
        // Clear sessionStorage only (NOT localStorage - keeps fingerprint!)
        sessionStorage.clear();

        // Update status
        document.getElementById('status').textContent = 'Redirecting to homepage...';

        console.log('🔄 Session cleared, fingerprint preserved');
        console.log('📱 Stored fingerprint:', localStorage.getItem('device_fingerprint')?.substring(0, 20) + '...');

        // Wait 1 second, then redirect to homepage
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
