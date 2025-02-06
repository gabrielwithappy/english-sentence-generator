import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { word, difficulty, partOfSpeech } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an English teacher, create content for English learning based on the following parameters:
    Word: "${word}"
    Part of Speech: ${partOfSpeech}
    Difficulty Level: ${difficulty}

    Please provide:
    1. An English sentence using the word
    2. Korean translation of the sentence
    3. Two similar example sentences
    4. Brief explanation of the word usage
    5. if ${word} is english and ${word} does not match the linguistic ${partOfSpeech}, please format your response exactly like this example:
    {
      "sentence": "The cat plays with the yarn.",
      "translation": "고양이가 실과 놀고 있다.",
      "examples": [
        "Children play in the park.",
        "She plays the piano beautifully."
      ],
      "wordExplanation": "Play : to engage in activity for enjoyment"
    }
    `;


    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('품사가 맞지 않거나 영어입력이 아닙니다.');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '품사가 맞지 않거나 영어입력이 아닙니다.' },
      { status: 500 }
    );
  }
}
