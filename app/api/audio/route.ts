import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';

// Initialize ElevenLabs client with API key from environment variables
const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY || '',
});

// Interface for request body
interface AudioRequest {
    action: 'textToSpeech' | 'speechToText' | 'streamTextToSpeech';
    voiceId?: string;
    text?: string;
    modelId?: string;
    outputFormat?: string;
    audioFile?: string; // For speech-to-text
}

// Error handling utility
const handleError = (error: unknown, message: string) => {
    console.error(message, error);
    return NextResponse.json(
        { error: message, details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
    );
};

// POST handler for audio operations
export async function POST(req: NextRequest) {
    try {
        const body: AudioRequest = await req.json();

        // Validate request body
        if (!body.action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        switch (body.action) {
            case 'textToSpeech':
                return await handleTextToSpeech(body);
            case 'speechToText':
                return await handleSpeechToText(body);
            case 'streamTextToSpeech':
                return await handleStreamTextToSpeech(body);
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        return handleError(error, 'Failed to process audio request');
    }
}

// Handle Text-to-Speech conversion
async function handleTextToSpeech(body: AudioRequest) {
    if (!body.voiceId || !body.text || !body.modelId) {
        return NextResponse.json(
            { error: 'voiceId, text, and modelId are required for text-to-speech' },
            { status: 400 }
        );
    }

    try {
        const audio = await elevenlabs.textToSpeech.convert(body.voiceId, {
            text: body.text,
            modelId: body.modelId,
            outputFormat: body.outputFormat || 'mp3_44100_128',
        });

        // Convert stream to buffer for response
        const buffers: Buffer[] = [];
        for await (const chunk of audio) {
            buffers.push(Buffer.from(chunk));
        }
        const audioBuffer = Buffer.concat(buffers);

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="output.mp3"',
            },
        });
    } catch (error) {
        return handleError(error, 'Text-to-speech conversion failed');
    }
}

// Handle Speech-to-Text conversion
async function handleSpeechToText(body: AudioRequest) {
    if (!body.modelId || !body.audioFile) {
        return NextResponse.json(
            { error: 'modelId and audioFile are required for speech-to-text' },
            { status: 400 }
        );
    }

    try {
        // Note: In a real implementation, you'd need to handle file uploads properly
        // This example assumes the audioFile is a base64 string or similar
        const response = await elevenlabs.speechToText.convert({
            modelId: body.modelId,
            // You would need to convert the audioFile to the appropriate format
            // This is a placeholder for actual file handling
        });

        return NextResponse.json({ transcription: response });
    } catch (error) {
        return handleError(error, 'Speech-to-text conversion failed');
    }
}

// Handle Streaming Text-to-Speech
async function handleStreamTextToSpeech(body: AudioRequest) {
    if (!body.voiceId || !body.text || !body.modelId) {
        return NextResponse.json(
            { error: 'voiceId, text, and modelId are required for streaming text-to-speech' },
            { status: 400 }
        );
    }

    try {
        const audioStream = await elevenlabs.textToSpeech.stream(body.voiceId, {
            text: body.text,
            modelId: body.modelId,
            outputFormat: body.outputFormat || 'mp3_44100_128',
        });

        // Create a Readable stream for the response
        const stream = new Readable({
            read() {
                // Stream implementation handled below
            },
        });

        // Pipe audio stream to response stream
        (async () => {
            for await (const chunk of audioStream) {
                stream.push(Buffer.from(chunk));
            }
            stream.push(null); // Signal end of stream
        })();

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Transfer-Encoding': 'chunked',
                'Content-Disposition': 'attachment; filename="stream.mp3"',
            },
        });
    } catch (error) {
        return handleError(error, 'Streaming text-to-speech failed');
    }
}

// GET handler for listing available voices
export async function GET() {
    try {
        const voices = await elevenlabs.voices.search();
        return NextResponse.json({ voices });
    } catch (error) {
        return handleError(error, 'Failed to fetch voices');
    }
}