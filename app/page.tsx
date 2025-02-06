'use client';

import { useState } from 'react';

interface GeneratedContent {
  sentence: string;
  translation: string;
  examples: string[];
  wordExplanation: string;
}

export default function Page() {
  const [word, setWord] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [partOfSpeech, setPartOfSpeech] = useState('verb');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser');
    }
  };

  const generateSentence = async () => {
    if (!word.trim()) {
      alert('Please enter a word');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, difficulty, partOfSpeech }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate sentence');
      }

      const data = await response.json();
      setContent(data);
    } catch {
      alert('Failed to generate sentence');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-12">
        English Sentence Generator
      </h1>
      
      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Enter a word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        
        <select 
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        
        <select
          value={partOfSpeech}
          onChange={(e) => setPartOfSpeech(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="verb">Verb</option>
          <option value="noun">Noun</option>
          <option value="adjective">Adjective</option>
          <option value="adverb">Adverb</option>
        </select>
        
        <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 border-2 border-blue-600" onClick={generateSentence}>
          Generate Sentence
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {content && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-300 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Generated Sentence:</h3>
            <p className="text-gray-700 mb-3">{content.sentence}</p>
            <button 
              onClick={() => handleSpeak(content.sentence)}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              🔊 Listen
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-300 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Korean Translation:</h3>
            <p className="text-gray-700">{content.translation}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-300 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Similar Examples:</h3>
            <div className="space-y-2">
              {content.examples.map((example, index) => (
                <p key={index} className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">{example}</p>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-300 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Word Explanation:</h3>
            <p className="text-gray-700">{content.wordExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
