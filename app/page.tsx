'use client';

import { useState } from 'react';
import styles from './page.module.css';

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
    } catch (error) {
      alert('Failed to generate sentence');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>English Sentence Generator</h1>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter a word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className={styles.input}
        />

        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
          className={styles.select}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select 
          value={partOfSpeech} 
          onChange={(e) => setPartOfSpeech(e.target.value)}
          className={styles.select}
        >
          <option value="verb">Verb</option>
          <option value="noun">Noun</option>
          <option value="adjective">Adjective</option>
          <option value="adverb">Adverb</option>
        </select>

        <button 
          onClick={generateSentence} 
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? 'Generating...' : 'Generate Sentence'}
        </button>
      </div>

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {content && (
        <div className={styles.result}>
          <div className={styles.section}>
            <h3>Generated Sentence:</h3>
            <p>{content.sentence}</p>
            <button 
              onClick={() => handleSpeak(content.sentence)}
              className={styles.speakButton}
            >
              🔊 Listen
            </button>
          </div>

          <div className={styles.section}>
            <h3>Korean Translation:</h3>
            <p>{content.translation}</p>
          </div>

          <div className={styles.section}>
            <h3>Similar Examples:</h3>
            {content.examples.map((example, index) => (
              <p key={index}>{example}</p>
            ))}
          </div>

          <div className={styles.section}>
            <h3>Word Explanation:</h3>
            <p>{content.wordExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
