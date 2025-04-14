import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { word, difficulty, partOfSpeech } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 프롬프트를 수정하여 여러 뜻이 있을 경우 각각의 뜻에 대해 결과를 생성하도록 요청
    const prompt = `As an English teacher, if the word "${word}" has multiple meanings, generate content for EACH meaning as a separate JSON object in a JSON array. For each meaning, provide:
1. The meaning (definition) in English
2. An English sentence using the word with that meaning
3. Korean translation of the sentence
4. Two similar example sentences with Korean translations of each sentence
5. Brief explanation of the word usage

Format your response EXACTLY as follows:
[
  {
    "meaning": "first meaning in English",
    "sentence": "...",
    "translation": "...",
    "examples": [
      "...",
      "..."
    ],
    "wordExplanation": "..."
  },
  {
    "meaning": "second meaning in English",
    "sentence": "...",
    "translation": "...",
    "examples": [
      "...",
      "..."
    ],
    "wordExplanation": "..."
  }
  // ...more if applicable
]

If the word is NOT English or does not match the part of speech, respond with a single array element with all fields set to "입력이 영어가 아니거나 품사가 맞지 않습니다."
Word: "${word}"
Part of Speech: ${partOfSpeech}
Difficulty Level: ${difficulty}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    // JSON 배열 파싱
    const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonArrayMatch) {
      throw new Error('품사가 맞지 않거나 영어입력이 아닙니다.');
    }
    const parsedArray = JSON.parse(jsonArrayMatch[0]);

    // 각 문장에 대해 shuffledSentence 추가
    parsedArray.forEach((item: any) => {
      item.shuffledSentence = shuffleSentence(item.sentence);
    });

    return NextResponse.json(parsedArray);
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
  return words.join(' / ');
}
