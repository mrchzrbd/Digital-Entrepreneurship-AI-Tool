import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const system = `You are an AI business advisor embedded in an entrepreneur's decision-support tool. You have already analyzed their business data and produced a structured report. Here is the full analysis context:

${context}

Answer the entrepreneur's follow-up questions in a direct, specific, and practical way. Reference the actual data when relevant. Be concise (3-5 sentences max unless a longer answer is clearly needed). Never give generic business advice — always ground your answer in the specific data provided. Speak as a trusted advisor, not a chatbot.`;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
    });

    const reply = response.choices[0]?.message?.content || 'I could not generate a response.';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ reply: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
