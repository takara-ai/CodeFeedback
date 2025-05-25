import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { audio } from "@elevenlabs/elevenlabs-js/api/resources/dubbing";
import { NextRequest, NextResponse } from "next/server";

const api_key = process.env.ELEVEN_LABS_KEY

const client = new ElevenLabsClient({
    apiKey: api_key
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get("file");

        const response = await client.speechToText.convert({
            modelId: "scribe_v1",
            file: audioFile as File
        })
        console.log(response);
        return NextResponse.json({ result: response.text })
    }
    catch (err) {
        console.error("Error on /api/transcribe:", err);
        return NextResponse.json(
            { error: `Failed transcription: ${err}` },
            { status: 500 }
        )
    }
}