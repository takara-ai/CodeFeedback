import { Mistral } from "@mistralai/mistralai";
import { NextRequest, NextResponse } from "next/server";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json(
        { error: "Mistral API key not configured" },
        { status: 500 }
      );
    }

    // Use the JSON-enforced completion without streaming
    const response = await client.agents.complete({
      agentId: "ag:e30aa3a7:20250524:code-feedback:78ecd4aa",
      messages: messages,
      responseFormat: { type: "json_object" },
    });

    // Extract the content from the response
    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content in response" },
        { status: 500 }
      );
    }

    // Return the JSON content directly
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error calling Mistral JSON API:", error);
    return NextResponse.json(
      { error: "Failed to get AI JSON response" },
      { status: 500 }
    );
  }
}