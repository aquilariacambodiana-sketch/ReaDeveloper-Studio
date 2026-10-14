'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Shield, Check, Plus, Edit3, Trash2, Cpu } from 'lucide-react';
import { DEFAULT_AGENTS, Agent } from '@/lib/agents-data';

export default function AgentLibrary() {
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setAgents(agents.map((a) => (a.id === editingAgent.id ? editingAgent : a)));
    setEditingAgent(null);
    setSuccessMsg('Agent updated successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Agent Library</h1>
          <p className="text-slate-400 text-sm mt-1">Manage autonomous agent personas, system prompts, and domain capabilities.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-900 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 space-y-6 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                    {agent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{agent.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingAgent(agent)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Configure Agent"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {agent.description}
              </p>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System Instructions</div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono line-clamp-3">
                  {agent.systemPrompt}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Capabilities</div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map((cap, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Gemini 3.8 Flash
              </span>
              <span className="text-emerald-400 font-medium">Ready</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Configure Agent: {editingAgent.name}</h3>
              <button
                onClick={() => setEditingAgent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAgent} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Agent Name</label>
                <input
                  type="text"
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Role / Title</label>
                <input
                  type="text"
                  value={editingAgent.role}
                  onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={editingAgent.description}
                  onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">System Instructions / Prompt</label>
                <textarea
                  rows={4}
                  value={editingAgent.systemPrompt}
                  onChange={(e) => setEditingAgent({ ...editingAgent, systemPrompt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
