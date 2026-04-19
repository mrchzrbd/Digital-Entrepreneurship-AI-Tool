import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    if (!data || data.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide more data for analysis.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an AI Copilot for entrepreneurs. Your role is to act as a relevance and prioritization layer — transforming raw, fragmented business data into clear, structured insights and concrete next actions. You think like a sharp business analyst combined with a startup advisor. You identify patterns, surface what matters most, and cut through noise. Always be specific, practical, and direct. Avoid generic advice. Every insight and action must be grounded in the actual data provided. You ALWAYS respond with valid JSON only — no explanation, no markdown, no backticks, no extra text before or after the JSON.`;

    const userPrompt = `An entrepreneur has provided the following raw data from their business. It may include customer messages, feedback, operational notes, booking logs, WhatsApp conversations, or any other business information.

Analyze it and respond ONLY with a valid JSON object. No markdown, no backticks, no explanation — just the raw JSON.

The JSON must match this exact structure:
{
  "summary": "2-3 sentence executive summary of what this data reveals",
  "topSignal": "The single most important insight from this data in one punchy sentence",
  "insights": [
    {
      "title": "Short insight title",
      "detail": "What this means for the business",
      "frequency": "How often this appears e.g. mentioned 3 times"
    }
  ],
  "priorities": [
    {
      "rank": 1,
      "item": "What to focus on",
      "urgency": "high",
      "impact": "Why this matters for the business"
    }
  ],
  "actions": [
    {
      "action": "Specific concrete thing to do",
      "why": "Why this action addresses the data",
      "timeframe": "When to do it e.g. Today, This week, This month"
    }
  ]
}

Rules:
- Provide exactly 3 to 5 insights
- Provide exactly 3 to 5 priorities ranked 1 to 5
- Provide exactly 3 actions
- urgency must be exactly "high", "medium", or "low"
- Be specific to the data — no generic startup advice

Here is the entrepreneur's data:
---
${data}
---`;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const text = response.choices[0]?.message?.content || '';

    // Clean up any accidental markdown wrapping
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed. Raw response:', text);
      return NextResponse.json(
        { error: 'AI response could not be parsed. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
