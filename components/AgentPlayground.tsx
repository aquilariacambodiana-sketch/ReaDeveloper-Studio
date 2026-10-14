'use client';

import React, { useState } from 'react';
import { Send, RefreshCcw, User, Cpu } from 'lucide-react';
import { DEFAULT_AGENTS, Agent } from '@/lib/agents-data';

export default function AgentPlayground() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(DEFAULT_AGENTS[0]);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: `Hello! I am ${selectedAgent.name}, your ${selectedAgent.role}. How can I assist you with your task today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          agents: [selectedAgent],
          mode: 'single',
          systemInstruction: selectedAgent.systemPrompt
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate response');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.output }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message || 'Failed to connect to agent.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages([
      { role: 'assistant', content: `Hello! I am ${agent.name}, your ${agent.role}. How can I assist you with your task today?` }
    ]);
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Agent Playground</h1>
        <p className="text-slate-400 text-sm mt-1">Directly chat and test prompts against individual autonomous agent personas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Agent Selector Sidebar */}
        <div className="space-y-3 lg:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Agent</label>
          <div className="space-y-3">
            {DEFAULT_AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                  selectedAgent.id === agent.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                  {agent.name[0]}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{agent.name}</div>
                  <div className="text-[11px] text-indigo-400 truncate font-medium">{agent.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col h-[650px] shadow-2xl">
          {/* Active Agent Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedAgent.avatarColor} flex items-center justify-center text-white font-bold`}>
                {selectedAgent.name[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{selectedAgent.name}</h3>
                <p className="text-xs text-indigo-400 font-medium">{selectedAgent.role}</p>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Gemini 3.8 Flash
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${selectedAgent.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow`}>
                    {selectedAgent.name[0]}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${selectedAgent.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow animate-pulse`}>
                  {selectedAgent.name[0]}
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-400 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 animate-spin text-indigo-400" /> Agent is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${selectedAgent.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
