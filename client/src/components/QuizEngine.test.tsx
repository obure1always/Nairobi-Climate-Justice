import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QuizEngine } from './QuizEngine';

// Mock Language Context
vi.mock('../LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' })
}));

// Mock utils to bypass tailwind merge ESM issues in jsdom
vi.mock('../lib/utils', () => ({
  cn: (...args: any[]) => args.join(' ')
}));

describe('QuizEngine Component', () => {
  const mockQuestions = [
    {
      id: 'q1',
      question: 'What is climate change?',
      options: ['A weather app', 'Long-term change in temperature', 'A type of cloud'],
      correctAnswer: 1,
      explanation: 'Climate change refers to long-term shifts in temperatures and weather patterns.'
    }
  ];

  it('renders the first question correctly', () => {
    const handleComplete = vi.fn();
    render(<QuizEngine questions={mockQuestions} onComplete={handleComplete} />);
    
    expect(screen.getByText('What is climate change?')).toBeDefined();
    expect(screen.getByText('A weather app')).toBeDefined();
    expect(screen.getByText('Long-term change in temperature')).toBeDefined();
  });

  it('handles selecting an option and checking the answer', () => {
    const handleComplete = vi.fn();
    render(<QuizEngine questions={mockQuestions} onComplete={handleComplete} />);
    
    // Select correct option
    const optionButton = screen.getByText('Long-term change in temperature');
    fireEvent.click(optionButton);
    
    // Check answer
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    // Explanation should appear
    expect(screen.getByText('Climate change refers to long-term shifts in temperatures and weather patterns.')).toBeDefined();
    
    // Next button should appear
    const nextButton = screen.getByText('Finish');
    fireEvent.click(nextButton);
    
    // onComplete should be called with score 1, total 1
    expect(handleComplete).toHaveBeenCalledWith(1, 1);
  });
});
