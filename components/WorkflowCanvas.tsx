'use client';

import React, { useState } from 'react';
import { Bot, CheckCircle2, Clock, Sparkles, Activity, Shield } from 'lucide-react';
import { Agent } from '@/lib/agents-data';

interface WorkflowCanvasProps {
  agents: Agent[];
  activeStep?: number; // 1-indexed step currently running, or null
  executionLogs?: any[];
}

export default function WorkflowCanvas({ agents, activeStep = 0, executionLogs = [] }: WorkflowCanvasProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Compute node coordinates in a horizontal pipeline flow
  const nodeWidth = 220;
  const nodeHeight = 110;
  const spacingX = 80;
  const startX = 60;
  const startY = 120;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Multi-Agent Directed Graph Canvas
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Visualizing agent dependencies, data flow, and step telemetry.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {agents.length} Nodes in Pipeline
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative z-10 w-full overflow-x-auto pb-4">
        <svg
          className="w-full min-w-[700px] h-[320px]"
          viewBox={`0 0 ${Math.max(800, startX * 2 + agents.length * (nodeWidth + spacingX))} 320`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Render connecting directed edges (bezier curves) */}
          {agents.map((_, index) => {
            if (index >= agents.length - 1) return null;
            const x1 = startX + index * (nodeWidth + spacingX) + nodeWidth;
            const y1 = startY + nodeHeight / 2;
            const x2 = startX + (index + 1) * (nodeWidth + spacingX);
            const y2 = startY + nodeHeight / 2;
            const controlPointOffset = (x2 - x1) / 2;

            const isExecuted = activeStep > index + 1;
            const isRunning = activeStep === index + 2;

            return (
              <g key={`edge-${index}`}>
                <path
                  d={`M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${x2 - controlPointOffset} ${y2}, ${x2} ${y2}`}
                  stroke={isExecuted ? '#6366f1' : isRunning ? '#818cf8' : '#334155'}
                  strokeWidth="2.5"
                  strokeDasharray={isRunning ? '6 6' : 'none'}
                  className={isRunning ? 'animate-pulse' : ''}
                />
                {/* Arrow head */}
                <polygon
                  points={`${x2 - 8},${y2 - 5} ${x2},${y2} ${x2 - 8},${y2 + 5}`}
                  fill={isExecuted ? '#6366f1' : isRunning ? '#818cf8' : '#475569'}
                />
              </g>
            );
          })}

          {/* Render Agent Nodes */}
          {agents.map((agent, index) => {
            const x = startX + index * (nodeWidth + spacingX);
            const y = startY;
            const stepNum = index + 1;
            const isCurrentActive = activeStep === stepNum;
            const isCompleted = activeStep > stepNum;
            const logItem = executionLogs.find((l) => l.step === stepNum);

            return (
              <g
                key={agent.id}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedAgent(agent)}
              >
                {/* Node Card Background */}
                <rect
                  x={x}
                  y={y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="16"
                  fill="#090d16"
                  stroke={isCurrentActive ? '#818cf8' : isCompleted ? '#6366f1' : '#1e293b'}
                  strokeWidth={isCurrentActive || isCompleted ? '2' : '1'}
                  className="shadow-xl"
                />

                {/* Step badge */}
                <circle cx={x + 24} cy={y + 24} r="12" fill={isCompleted ? '#4f46e5' : isCurrentActive ? '#6366f1' : '#1e293b'} />
                <text x={x + 24} y={y + 28} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {stepNum}
                </text>

                {/* Agent Name */}
                <text x={x + 48} y={y + 28} fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  {agent.name.length > 18 ? agent.name.slice(0, 16) + '...' : agent.name}
                </text>

                {/* Agent Role */}
                <text x={x + 24} y={y + 56} fill="#818cf8" fontSize="11" fontFamily="sans-serif">
                  {agent.role.length > 26 ? agent.role.slice(0, 24) + '...' : agent.role}
                </text>

                {/* Capabilities pills representation */}
                <rect x={x + 24} y={y + 72} width="72" height="20" rx="6" fill="#1e293b" />
                <text x={x + 60} y={y + 86} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
                  {agent.capabilities[0] || 'AI Agent'}
                </text>

                {/* Status indicator */}
                <circle cx={x + nodeWidth - 24} cy={y + 24} r="5" fill={isCompleted ? '#10b981' : isCurrentActive ? '#f59e0b' : '#64748b'} className={isCurrentActive ? 'animate-ping' : ''} />

                {logItem && (
                  <text x={x + nodeWidth - 24} y={y + 90} fill="#10b981" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {(logItem.durationMs / 1000).toFixed(1)}s
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Agent Inspection Modal / Drawer */}
      {selectedAgent && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${selectedAgent.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                {selectedAgent.name[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedAgent.name}</h4>
                <p className="text-xs text-indigo-400">{selectedAgent.role}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-900 rounded"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedAgent.description}</p>
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">System Prompt Instructions:</div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              {selectedAgent.systemPrompt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
