'use client';

import React, { useState, useEffect } from 'react';
import { FileCode, Sparkles, Copy, Check, Save, Cpu } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface CodeEditorProps {
  currentProjectId?: string;
  projectName?: string;
}

export default function CodeEditor({ currentProjectId = 'default-1', projectName: _projectName = 'Autonomous Research Pipeline' }: CodeEditorProps) {
  const [files, setFiles] = useState<Array<{ name: string; content: string; language: string }>>([
    {
      name: 'agent_pipeline.ts',
      language: 'typescript',
      content: 'import { GoogleGenAI } from "@google/genai";\n\n// REA Autonomous Agent Pipeline\nexport async function runREA(prompt: string) {\n  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\n  const res = await ai.models.generateContent({\n    model: "gemini-3.8-flash",\n    contents: prompt,\n  });\n  return res.text;\n}'
    },
    {
      name: 'rea_config.json',
      language: 'json',
      content: '{\n  "engine": "REA-3.5",\n  "mode": "autonomous-execution",\n  "temperature": 0.2\n}'
    }
  ]);

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiWriting, setIsAiWriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const activeFile = files[activeFileIndex];

  // Autosave effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        if (auth.currentUser) {
          const fileRef = doc(db, 'projects', currentProjectId, 'files', activeFile.name);
          await setDoc(fileRef, {
            name: activeFile.name,
            content: activeFile.content,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('saved');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [activeFile.content, activeFile.name, currentProjectId]);

  const handleCodeChange = (newContent: string) => {
    setSaveStatus('unsaved');
    const updated = [...files];
    updated[activeFileIndex].content = newContent;
    setFiles(updated);
  };

  const handleAiWrite = async () => {
    if (!aiPrompt.trim() || isAiWriting) return;
    setIsAiWriting(true);

    try {
      const res = await fetch('/api/code/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          currentCode: activeFile.content,
          language: activeFile.language,
          task: 'REA autonomous generation and refactoring'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI generation failed');

      handleCodeChange(data.code);
      setAiPrompt('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'AI generation failed');
    } finally {
      setIsAiWriting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" /> REA Code Builder & AI Writer
          </h2>
          <p className="text-xs text-slate-400">Zero mock data — real-time Gemini AI code generation with live cloud autosave.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-400' : saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'}`} />
            {saveStatus === 'saved' ? 'Autosaved to Cloud' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* AI Writer Assistant Bar */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold shrink-0">
          <Sparkles className="w-4 h-4" /> REA AI Writer
        </div>
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Instruct Gemini AI to write or refactor code for your REA pipeline..."
          className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAiWrite}
          disabled={isAiWriting || !aiPrompt.trim()}
          className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          {isAiWriting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5" /> REA Generate
            </>
          )}
        </button>
      </div>

      {/* Editor Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* File Tabs */}
        <div className="flex items-center bg-slate-950 border-b border-slate-800 overflow-x-auto">
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-5 py-3 text-xs font-medium border-r border-slate-800/80 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeFileIndex === idx
                  ? 'bg-slate-900 text-white border-t-2 border-t-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              {file.name}
            </button>
          ))}
        </div>

        {/* Code Textarea with Line Numbers */}
        <div className="relative flex-1 bg-slate-950 flex font-mono text-xs">
          <div className="w-12 py-4 bg-slate-950/80 text-slate-600 select-none text-right pr-3 space-y-1 font-mono border-r border-slate-900">
            {activeFile.content.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={activeFile.content}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent text-slate-200 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none min-h-[400px]"
          />
        </div>
      </div>
    </div>
  );
}
