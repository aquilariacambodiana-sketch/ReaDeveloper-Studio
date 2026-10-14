'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Network, Terminal, BarChart3, FileCode, Monitor, FolderKanban, Github, User, LogOut } from 'lucide-react';
import { auth, onAuthStateChanged, signOut } from '@/lib/firebase';
import AuthModal from '@/components/AuthModal';
import GitHubPublishModal from '@/components/GitHubPublishModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewWorkflow: () => void;
  projectName: string;
}

export default function Navbar({ activeTab, setActiveTab, projectName }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
              REA DEVELOPER STUDIO
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">PRO v3.5</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'workflows' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Workflows
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> Code Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Web Preview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" /> Projects
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'agents' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Agents
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'playground' ? 'bg-indigo-600 text-white shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Playground
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setGithubOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-700 transition-all"
          >
            <Github className="w-4 h-4" /> Publish
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
              <span className="text-xs text-slate-300 hidden md:inline truncate max-w-[120px]">{user.email}</span>
              <button
                onClick={() => signOut(auth)}
                className="text-slate-400 hover:text-white p-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5" /> Sign In
            </button>
          )}
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <GitHubPublishModal isOpen={githubOpen} onClose={() => setGithubOpen(false)} projectName={projectName} />
    </>
  );
}
