'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Copy, Check, RefreshCcw, Layers, AlertCircle } from 'lucide-react';
import { WORKFLOW_TEMPLATES, DEFAULT_AGENTS, Agent } from '@/lib/agents-data';
import WorkflowCanvas from '@/components/WorkflowCanvas';

interface WorkflowStudioProps {
  selectedTemplateId?: string;
}

export default function WorkflowStudio({ selectedTemplateId }: WorkflowStudioProps) {
  const initialTpl = WORKFLOW_TEMPLATES.find((t) => t.id === selectedTemplateId) || WORKFLOW_TEMPLATES[0];

  const [prompt, setPrompt] = useState(initialTpl.defaultPrompt);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(initialTpl.agentIds);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (tpl: any) => {
    setPrompt(tpl.defaultPrompt);
    setSelectedAgentIds(tpl.agentIds);
    setExecutionResult(null);
    setError(null);
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      if (selectedAgentIds.length <= 1) return; // Keep at least 1 agent
      setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agentId));
    } else {
      setSelectedAgentIds([...selectedAgentIds, agentId]);
    }
  };

  const handleRunWorkflow = async () => {
    if (!prompt.trim()) return;
    setIsRunning(true);
    setExecutionResult(null);
    setError(null);

    try {
      const activeAgents = selectedAgentIds
        .map((id) => DEFAULT_AGENTS.find((a) => a.id === id))
        .filter(Boolean);

      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          agents: activeAgents,
          mode: 'workflow'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute workflow');
      }

      setExecutionResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during workflow execution.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePipelineAgents = selectedAgentIds
    .map((id) => DEFAULT_AGENTS.find((a) => a.id === id))
    .filter(Boolean) as Agent[];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Workflow Studio</h1>
        <p className="text-slate-400 text-sm mt-1">Configure multi-agent pipeline sequences and execute research and code generation tasks.</p>
      </div>

      {/* Templates Selector */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Templates</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WORKFLOW_TEMPLATES.map((tpl) => {
            const isSelected = selectedAgentIds.length === tpl.agentIds.length && tpl.agentIds.every((id, idx) => id === selectedAgentIds[idx]);
            return (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                      {tpl.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{tpl.estimatedTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{tpl.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{tpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workflow Canvas Directed Graph Visualization */}
      <WorkflowCanvas
        agents={activePipelineAgents}
        activeStep={isRunning ? 1 : executionResult ? 99 : 0}
        executionLogs={executionResult?.logs || []}
      />

      {/* Configuration & Pipeline Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Prompt & Chain Config */}
        <div className="lg:col-span-2 space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Workflow Input Prompt / Task Brief</span>
              <span className="text-xs text-indigo-400 font-normal">Powered by Gemini 3.8 Flash</span>
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter objective, research topic, or coding task..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-white">Agent Pipeline Chain (Ordered Execution)</label>
            <p className="text-xs text-slate-400">Select and reorder agents to build your collaborative execution pipeline.</p>
            
            <div className="flex flex-wrap gap-3">
              {DEFAULT_AGENTS.map((agent) => {
                const isSelected = selectedAgentIds.includes(agent.id);
                const orderIndex = selectedAgentIds.indexOf(agent.id);
                return (
                  <button
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`px-4 py-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                      {agent.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {agent.name}
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-mono">
                            {orderIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{agent.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Chain length: <span className="text-white font-semibold">{selectedAgentIds.length} agents</span>
            </div>
            <button
              onClick={handleRunWorkflow}
              disabled={isRunning || !prompt.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  Executing Pipeline...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Workflow Pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Active Chain Details */}
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Pipeline Sequence
          </h3>

          <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-800">
            {selectedAgentIds.map((id, index) => {
              const agent = DEFAULT_AGENTS.find((a) => a.id === id);
              if (!agent) return null;
              return (
                <div key={id} className="relative flex items-center gap-4 pl-2">
                  <div className={`w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-mono flex items-center justify-center z-10 shadow`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3">
                    <div className="text-xs font-bold text-white">{agent.name}</div>
                    <div className="text-[11px] text-indigo-400">{agent.role}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-2 text-xs text-indigo-300">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Collaborative Execution
            </div>
            <p className="leading-relaxed text-slate-300">
              Each agent processes the output of the preceding agent sequentially, refining insights until final output generation.
            </p>
          </div>
        </div>
      </div>

      {/* Execution Results & Logs */}
      {(isRunning || executionResult || error) && (
        <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : error ? 'bg-rose-500' : 'bg-emerald-400'}`} />
              <h3 className="text-lg font-bold text-white">
                {isRunning ? 'Executing Multi-Agent Pipeline...' : error ? 'Execution Error' : 'Pipeline Execution Completed'}
              </h3>
            </div>
            {executionResult && (
              <button
                onClick={() => handleCopy(executionResult.finalOutput)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Final Output'}
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-900 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRunning && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <RefreshCcw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm font-medium text-slate-300">Agents are collaborating in real-time...</p>
              <p className="text-xs text-slate-500">Synthesizing research, modeling data, and writing output.</p>
            </div>
          )}

          {executionResult && (
            <div className="space-y-8">
              {/* Final Output Hero Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Final Synthesized Output</h4>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {executionResult.finalOutput}
                </div>
              </div>

              {/* Step Logs */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step-by-Step Agent Telemetry Logs</h4>
                <div className="space-y-4">
                  {executionResult.logs.map((log: any) => (
                    <div key={log.step} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 font-mono font-semibold">
                            Step {log.step}
                          </span>
                          <span className="font-bold text-white">{log.agentName}</span>
                          <span className="text-slate-400">({log.role})</span>
                        </div>
                        <span className="text-slate-400 font-mono flex items-center gap-1">
                          <RefreshCcw className="w-3.5 h-3.5" /> {(log.durationMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono">
                        <span className="text-indigo-400 font-semibold">Input:</span> {log.input}
                      </div>
                      <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed pt-2">
                        {log.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
