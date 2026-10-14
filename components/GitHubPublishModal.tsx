'use client';

import React, { useState } from 'react';
import { GitBranch, Github, Check, X, ExternalLink, Sparkles, RefreshCcw } from 'lucide-react';

interface GitHubPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export default function GitHubPublishModal({ isOpen, onClose, projectName }: GitHubPublishModalProps) {
  const [repoName, setRepoName] = useState(projectName.toLowerCase().replace(/\s+/g, '-'));
  const [isPrivate, setIsPrivate] = useState(false);
  const [commitMsg, setCommitMsg] = useState('Initial commit via Rea Agents Studio');
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublishedUrl(`https://github.com/developer/${repoName}`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-white shadow-lg">
            <Github className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Publish to GitHub</h2>
          <p className="text-sm text-slate-400">Export workspace files and create a new repository instantly.</p>
        </div>

        {publishedUrl ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Successfully Published!</h3>
            <p className="text-xs text-slate-400">Your repository has been created on GitHub.</p>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
            >
              View Repository <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Repository Name</label>
              <input
                type="text"
                required
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Commit Message</label>
              <input
                type="text"
                required
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="privateRepo"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="privateRepo" className="text-xs text-slate-300">Make repository private</label>
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm flex items-center justify-center gap-2"
            >
              {publishing ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" /> Publishing to GitHub...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" /> Export & Publish
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
