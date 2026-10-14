'use client';

import React, { useState, useEffect } from 'react';
import { Folder, Plus, ArrowRight } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

interface ProjectManagerProps {
  currentProjectId: string;
  onSelectProject: (projectId: string, projectName: string) => void;
}

export default function ProjectManager({ currentProjectId, onSelectProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Array<{ id: string; name: string; description: string }>>([
    { id: 'default-1', name: 'Autonomous Research Pipeline', description: 'Multi-agent market research and competitive analysis.' },
    { id: 'default-2', name: 'Next.js 15 Full-Stack App', description: 'Real-time WebSocket synchronization assistant.' }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid));
        const snap = await getDocs(q);
        const cloudProjects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        if (cloudProjects.length > 0) {
          setProjects(cloudProjects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);

    try {
      const newProj = {
        name: newTitle,
        description: newDesc,
        userId: auth.currentUser ? auth.currentUser.uid : 'guest',
        createdAt: new Date().toISOString()
      };

      if (auth.currentUser) {
        const docRef = await addDoc(collection(db, 'projects'), newProj);
        setProjects((prev) => [...prev, { id: docRef.id, ...newProj }]);
        onSelectProject(docRef.id, newTitle);
      } else {
        const localId = 'local-' + Date.now();
        setProjects((prev) => [...prev, { id: localId, ...newProj }]);
        onSelectProject(localId, newTitle);
      }

      setNewTitle('');
      setNewDesc('');
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Project Manager</h2>
          <p className="text-xs text-slate-400">Manage developer workspaces and synced Firestore projects.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateProject} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Create New Workspace Project</h3>
          <div className="space-y-3">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project Name (e.g. AI Workflow Engine)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief description of the project workspace..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
            >
              Create Project
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const isSelected = currentProjectId === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id, proj.name)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                    <Folder className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Active Workspace
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.description}</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Firestore synced</span>
                <span className="text-indigo-400 font-medium flex items-center gap-1 group-hover:underline">
                  Open Project <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
