export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  avatarColor: string;
  capabilities: string[];
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  agentIds: string[];
  estimatedTime: string;
  defaultPrompt: string;
}

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Dr. Athena',
    role: 'Lead Research Analyst',
    description: 'Expert in multi-source literature search, trend synthesis, and market analysis.',
    systemPrompt: 'You are Dr. Athena, a meticulous lead research analyst. Gather facts, analyze market trends, synthesize information objectively, and provide structured insights with citations and quantitative backing.',
    avatarColor: 'from-blue-600 to-indigo-600',
    capabilities: ['Web Search Synthesis', 'Data Extraction', 'Fact Checking', 'Trend Analysis']
  },
  {
    id: 'agent-2',
    name: 'QuantVance',
    role: 'Data & Metric Analyst',
    description: 'Specializes in statistical modeling, anomaly detection, and quantitative validation.',
    systemPrompt: 'You are QuantVance, a rigorous data analyst. Evaluate datasets, uncover statistical anomalies, calculate key performance indicators, and present rigorous numerical breakdowns.',
    avatarColor: 'from-emerald-600 to-teal-600',
    capabilities: ['Statistical Modeling', 'Metric Evaluation', 'Risk Assessment', 'Tabular Structuring']
  },
  {
    id: 'agent-3',
    name: 'CodeCraft',
    role: 'Senior Software Engineer',
    description: 'Builds robust, production-grade TypeScript, Next.js, and Python architectures.',
    systemPrompt: 'You are CodeCraft, a senior software architect. Design clean, scalable, secure, and performant code solutions following modern engineering best practices and robust type safety.',
    avatarColor: 'from-violet-600 to-purple-600',
    capabilities: ['Full-Stack Dev', 'Code Refactoring', 'API Design', 'Security Auditing']
  },
  {
    id: 'agent-4',
    name: 'ScribeAI',
    role: 'Technical Writer & Editor',
    description: 'Transforms complex technical outputs into crystal-clear editorial documentation.',
    systemPrompt: 'You are ScribeAI, an expert technical writer. Craft engaging, structured, WCAG-accessible, and beautifully formatted documentation, release notes, and executive summaries.',
    avatarColor: 'from-amber-600 to-orange-600',
    capabilities: ['Technical Documentation', 'Editorial Polish', 'Executive Summaries', 'Formatting']
  },
  {
    id: 'agent-5',
    name: 'SentinelQA',
    role: 'Quality Assurance & Security',
    description: 'Rigorous auditor for bug detection, vulnerability analysis, and test coverage.',
    systemPrompt: 'You are SentinelQA, an uncompromising quality assurance and security auditor. Identify edge cases, potential failure modes, security vulnerabilities, and test coverage gaps.',
    avatarColor: 'from-rose-600 to-red-600',
    capabilities: ['Vulnerability Scan', 'Edge Case Analysis', 'Test Planning', 'Compliance Check']
  }
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Market Research & Competitive Intelligence',
    description: 'Synthesizes market dynamics, evaluates quantitative metrics, and generates an executive brief.',
    category: 'Research',
    agentIds: ['agent-1', 'agent-2', 'agent-4'],
    estimatedTime: '~12s',
    defaultPrompt: 'Analyze the current state and emerging trends of AI-driven autonomous coding assistants in enterprise software development for 2026.'
  },
  {
    id: 'tpl-2',
    title: 'Full-Stack Feature Design & Code Generation',
    description: 'Researches architectural patterns, writes production-grade code, and reviews for security.',
    category: 'Engineering',
    agentIds: ['agent-1', 'agent-3', 'agent-5'],
    estimatedTime: '~18s',
    defaultPrompt: 'Design and write a secure, high-performance real-time multiplayer cursor synchronization hook using WebSockets in Next.js 15.'
  },
  {
    id: 'tpl-3',
    title: 'Automated Security Audit & Technical Documentation',
    description: 'Audits software code or system specs for vulnerabilities and writes polished documentation.',
    category: 'DevOps & Security',
    agentIds: ['agent-3', 'agent-5', 'agent-4'],
    estimatedTime: '~15s',
    defaultPrompt: 'Review a hypothetical Next.js API route handling payment webhooks for race conditions, data validation flaws, and prepare release documentation.'
  }
];
