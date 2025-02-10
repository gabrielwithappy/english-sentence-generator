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
    5. if ${word} is english and ${word} match the linguistic ${partOfSpeech}, please format your response exactly like this example:
    {
      "sentence": "The cat plays with the yarn.",
      "translation": "고양이가 실과 놀고 있다.",
      "examples": [
        "Children play in the park.",
        "She plays the piano beautifully."
      ],
      "wordExplanation": "Play : to engage in activity for enjoyment"
    }
    6. if ${word} is NOT english or ${word} does NOT match the linguistic ${partOfSpeech}, please response below:
    {
      "sentence": "입력이 영어가 아니거나 품사가 맞지 않습니다.",
      "translation": "입력이 영어가 아니거나 품사가 맞지 않습니다.",
      "examples": [
        "입력이 영어가 아니거나 품사가 맞지 않습니다."
      ],
      "wordExplanation": "입력이 영어가 아니거나 품사가 맞지 않습니다."
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
    
    // Shuffle the sentence
    parsedResponse.shuffledSentence = shuffleSentence(parsedResponse.sentence);
    
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '품사가 맞지 않거나 영어입력이 아닙니다.' },
      { status: 500 }
    );
  }
}

// Function to shuffle words in a sentence
function shuffleSentence(sentence: string): string {
  const words = sentence.split(' ');
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.join(' ');
}
