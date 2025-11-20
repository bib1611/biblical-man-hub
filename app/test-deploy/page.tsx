'use client';

export default function TestDeploy() {
  const deployTime = new Date().toISOString();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">✅ Deployment Test</h1>
            <p className="text-green-400 text-lg">This page was just created</p>
          </div>

          <div className="space-y-4 text-left bg-black/30 rounded-xl p-6 mb-6">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-bold">🟢 LIVE</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400">Domain:</span>
              <span className="text-white font-mono text-sm">www.thebiblicalmantruth.com</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400">Build Time:</span>
              <span className="text-white font-mono text-xs">{deployTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Test Page Version:</span>
              <span className="text-white font-bold">v1.0</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400">
              If you can see this page, your deployment is working correctly!
            </p>

            <div className="flex gap-3 justify-center">
              <a
                href="/"
                className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                Go to Homepage
              </a>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-500 transition-all"
              >
                Refresh Test
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h2 className="text-xl font-bold mb-4">Recent Updates Deployed:</h2>
            <ul className="space-y-2 text-sm text-left">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Premium Radio Player with Apple Music design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Real Substack posts API with 4 recent articles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>All 27 Gumroad product URLs fixed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Full Hub with all components working</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>MiniPlayer restored to desktop and mobile</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
