'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import WorkflowStudio from '@/components/WorkflowStudio';
import AgentLibrary from '@/components/AgentLibrary';
import AgentPlayground from '@/components/AgentPlayground';
import CodeEditor from '@/components/CodeEditor';
import WebPreviewer from '@/components/WebPreviewer';
import ProjectManager from '@/components/ProjectManager';
import QuickStartToast from '@/components/QuickStartToast';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [currentProjectId, setCurrentProjectId] = useState('default-1');
  const [projectName, setProjectName] = useState('Autonomous Research Pipeline');
  const [showTutorial, setShowTutorial] = useState(true);

  const handleNewWorkflow = () => {
    setSelectedTemplateId(undefined);
    setActiveTab('workflows');
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setActiveTab('workflows');
  };

  const handleSelectProject = (projectId: string, name: string) => {
    setCurrentProjectId(projectId);
    setProjectName(name);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewWorkflow={handleNewWorkflow}
        projectName={projectName}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectTemplate={handleSelectTemplate}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'workflows' && (
          <WorkflowStudio
            selectedTemplateId={selectedTemplateId}
          />
        )}
        {activeTab === 'editor' && (
          <CodeEditor projectName={projectName} />
        )}
        {activeTab === 'preview' && (
          <WebPreviewer />
        )}
        {activeTab === 'projects' && (
          <ProjectManager
            currentProjectId={currentProjectId}
            onSelectProject={handleSelectProject}
          />
        )}
        {activeTab === 'agents' && <AgentLibrary />}
        {activeTab === 'playground' && <AgentPlayground />}
      </main>

      {showTutorial && (
        <QuickStartToast
          onDismiss={() => setShowTutorial(false)}
          onNavigateTab={setActiveTab}
        />
      )}
    </div>
  );
}
