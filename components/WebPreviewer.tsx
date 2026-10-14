'use client';

import React, { useState } from 'react';
import { Monitor, RefreshCcw, Smartphone, Tablet, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

export default function WebPreviewer() {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white p-8 font-sans">
  <div class="max-w-xl mx-auto space-y-6 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">
      Live Sandbox Preview
    </div>
    <h1 class="text-3xl font-extrabold tracking-tight">Rea Agents Workspace Preview</h1>
    <p class="text-slate-400 text-sm">Your multi-agent application preview is running live in the sandboxed previewer container.</p>
    <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3">
      <h3 class="text-sm font-bold text-indigo-400">Status: Operational</h3>
      <p class="text-xs text-slate-300">Gemini 3.8 Flash pipeline synced and ready for deployment.</p>
    </div>
  </div>
</body>
</html>`;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400" /> Web Previewer & Live Sandbox
          </h2>
          <p className="text-xs text-slate-400">Test and inspect responsive web application outputs instantly.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" /> Tablet
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh Preview"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container Frame */}
      <div className="flex justify-center bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div
          className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
            deviceMode === 'desktop'
              ? 'w-full h-[600px]'
              : deviceMode === 'tablet'
              ? 'w-[768px] h-[600px]'
              : 'w-[375px] h-[667px]'
          }`}
        >
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-300">https://workspace.rea-agents.io/preview</span>
            </div>
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <iframe
            key={refreshKey}
            srcDoc={sampleHtml}
            className="w-full h-[calc(100%-37px)] bg-slate-950"
            title="Web Previewer Sandbox"
          />
        </div>
      </div>
    </div>
  );
}
