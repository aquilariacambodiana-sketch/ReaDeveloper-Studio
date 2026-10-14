'use client';

import React from 'react';
import { Bot, Network, Play, Sparkles, CheckCircle2, Clock, ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import { WORKFLOW_TEMPLATES, DEFAULT_AGENTS } from '@/lib/agents-data';

interface DashboardProps {
  onSelectTemplate: (templateId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ onSelectTemplate, setActiveTab }: DashboardProps) {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Gemini 3.8 Flash Powered Multi-Agent Engine
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Orchestrate Autonomous Multi-Agent Workflows
          </h1>
          
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Design collaborative AI pipelines where specialized research, quantitative, engineering, and editorial agents execute complex tasks in synchronous harmony.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('workflows')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Workflow Studio
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700/80 transition-all duration-200 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Open Agent Playground
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-medium">Active Agents</span>
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">5 / 5</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> All systems operational
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-medium">Workflows Executed</span>
            <Network className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">1,428</div>
          <div className="text-xs text-indigo-400 font-medium">
            +18% from last week
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-medium">Success Rate</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">99.4%</div>
          <div className="text-xs text-slate-400 font-medium">
            Zero-failure tolerance
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-sm font-medium">Avg Execution Time</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">14.2s</div>
          <div className="text-xs text-slate-400 font-medium">
            Optimized via Gemini 3.8
          </div>
        </div>
      </div>

      {/* Quick Launch Templates */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Workflow Templates</h2>
            <p className="text-sm text-slate-400">Pre-configured multi-agent pipelines ready for instant execution.</p>
          </div>
          <button
            onClick={() => setActiveTab('workflows')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View all workflows <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WORKFLOW_TEMPLATES.map((tpl) => {
            const templateAgents = tpl.agentIds.map((id) => DEFAULT_AGENTS.find((a) => a.id === id)).filter(Boolean);
            return (
              <div
                key={tpl.id}
                className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                      {tpl.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {tpl.estimatedTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tpl.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-medium text-slate-400 mb-2">Assigned Agent Pipeline:</div>
                    <div className="flex items-center gap-2">
                      {templateAgents.map((ag, idx) => (
                        <div key={ag?.id} className="flex items-center gap-1.5">
                          <span className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 truncate max-w-[120px]">
                            {ag?.name.split(' ')[0]}
                          </span>
                          {idx < templateAgents.length - 1 && (
                            <span className="text-slate-600 text-xs">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{templateAgents.length} Agents in chain</span>
                  <button
                    onClick={() => {
                      onSelectTemplate(tpl.id);
                      setActiveTab('workflows');
                    }}
                    className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border border-indigo-500/30"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Pipeline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Agent Roster Preview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Autonomous Agent Roster</h2>
            <p className="text-sm text-slate-400">Specialized personas trained for enterprise execution.</p>
          </div>
          <button
            onClick={() => setActiveTab('agents')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Manage library <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DEFAULT_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.avatarColor} flex items-center justify-center font-bold text-white shadow-md`}>
                  {agent.name[0]}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate">{agent.name}</h4>
                  <p className="text-xs text-indigo-400 truncate font-medium">{agent.role}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {agent.capabilities.slice(0, 2).map((cap, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
