import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "create a list of 10 open ended messages and engaging queation as single string. each question seperated by '|| ' for a user"

    const result = streamText({
      model: openai('gpt-4o'),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in suggest-messages:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}