import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, agents, mode = 'workflow', systemInstruction } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const activeModel = 'gemini-3.8-flash';

    if (mode === 'workflow' && agents && Array.isArray(agents)) {
      // Simulate multi-agent collaborative pipeline execution
      const executionLogs = [];
      let currentContext = prompt;

      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const stepPrompt = `You are ${agent.name}, an autonomous AI agent with the role: ${agent.role}. 
Your system instructions and expertise: ${agent.systemPrompt || agent.description}.
Given the current context/input from previous steps or user query:
"""
${currentContext}
"""
Perform your assigned task, analyze thoroughly, and provide output for the next agent or final result. Be precise, professional, and detailed.`;

        const startTime = Date.now();
        const response = await ai.models.generateContent({
          model: activeModel,
          contents: stepPrompt,
          config: {
            systemInstruction: `You are ${agent.name} (${agent.role}). Provide high-quality domain execution.`,
            temperature: 0.7
          }
        });
        const duration = Date.now() - startTime;
        const resultText = response.text || 'No output generated.';

        executionLogs.push({
          step: i + 1,
          agentId: agent.id,
          agentName: agent.name,
          role: agent.role,
          input: currentContext.slice(0, 300) + (currentContext.length > 300 ? '...' : ''),
          output: resultText,
          durationMs: duration,
          timestamp: new Date().toISOString()
        });

        currentContext = resultText;
      }

      return NextResponse.json({
        success: true,
        mode: 'workflow',
        finalOutput: currentContext,
        logs: executionLogs
      });
    } else {
      // Single agent direct run
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are Rea Agent, an advanced autonomous AI assistant built for deep analysis, coding, research, and problem solving.',
          temperature: 0.7
        }
      });

      return NextResponse.json({
        success: true,
        mode: 'single',
        output: response.text || 'No response generated.'
      });
    }
  } catch (error: any) {
    console.error('Gemini Agent API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during agent execution' },
      { status: 500 }
    );
  }
}
