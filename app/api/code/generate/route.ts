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
    const { prompt, currentCode, language, task } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemInstruction = `You are CodeCraft, an expert AI software engineer and code writer. 
Your task is to ${task || 'generate or refactor clean, production-grade code'} in ${language || 'TypeScript'}.
Return ONLY valid, well-commented code or markdown explanation as requested, without unnecessary filler text.`;

    const userPrompt = currentCode
      ? `Existing code:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n\nTask/Instruction: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    return NextResponse.json({
      success: true,
      code: response.text || '// No code generated'
    });
  } catch (error: any) {
    console.error('Code generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate code' }, { status: 500 });
  }
}
