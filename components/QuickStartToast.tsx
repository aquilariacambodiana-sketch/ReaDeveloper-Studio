'use client';

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface QuickStartToastProps {
  onDismiss: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function QuickStartToast({ onDismiss, onNavigateTab }: QuickStartToastProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Rea Agents Studio',
      desc: 'Your full-stack developer workspace for autonomous multi-agent orchestration, code generation, and cloud sync.',
      tab: 'dashboard'
    },
    {
      title: 'Run Multi-Agent Workflows',
      desc: 'Build pipelines combining researchers, analysts, and coders to execute tasks in real-time.',
      tab: 'workflows'
    },
    {
      title: 'Code Editor & AI Writer',
      desc: 'Leverage Gemini AI to write, refactor, and edit your project files seamlessly.',
      tab: 'editor'
    },
    {
      title: 'Export & Publish',
      desc: 'Deploy to GitHub and preview live sandboxed applications instantly.',
      tab: 'preview'
    }
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      onNavigateTab(steps[step + 1].tab);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> Quick Start Tutorial ({step + 1} of {steps.length})
        </div>
        <button onClick={onDismiss} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">{current.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{current.desc}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-indigo-500 w-4' : 'bg-slate-700'}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
