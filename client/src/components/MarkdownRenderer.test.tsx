import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MarkdownRenderer from './MarkdownRenderer';
import { cleanTextForSpeech } from '../lib/speech';

describe('MarkdownRenderer & Speech Formatting', () => {
  it('renders markdown tables as semantic HTML tables without raw pipes', () => {
    const tableMarkdown = `
| Factor | Impact |
|---|---|
| Heavy Rain | Urban Flooding |
| Blocked Drains | Stagnant Water |
`;
    const { container } = render(<MarkdownRenderer content={tableMarkdown} />);
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    
    const headers = container.querySelectorAll('th');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toBe('Factor');
    expect(headers[1].textContent).toBe('Impact');

    const cells = container.querySelectorAll('td');
    expect(cells.length).toBe(4);
    expect(cells[0].textContent).toBe('Heavy Rain');
    expect(cells[1].textContent).toBe('Urban Flooding');
  });

  it('unescapes unintended backslashes cleanly', () => {
    const textWithBackslashes = 'Article\\# 42 protects the \\*environment\\* and clean \\| healthy living.';
    const { container } = render(<MarkdownRenderer content={textWithBackslashes} />);
    expect(container.textContent).toContain('Article# 42 protects the');
    expect(container.textContent).not.toContain('\\#');
    expect(container.textContent).not.toContain('\\*');
    expect(container.textContent).not.toContain('\\|');
  });

  it('cleanTextForSpeech strips markdown syntax so voice playback does not announce formatting characters', () => {
    const rawMarkdown = '### Key Summary\n* **Maize yields** dropped by 30% [View Report](https://example.com).\n| Region | Loss |\n| Turkana | High |';
    const cleaned = cleanTextForSpeech(rawMarkdown, 'en');

    expect(cleaned).not.toContain('###');
    expect(cleaned).not.toContain('**');
    expect(cleaned).not.toContain('[');
    expect(cleaned).not.toContain(']');
    expect(cleaned).not.toContain('https://');
    expect(cleaned).toContain('Key Summary');
    expect(cleaned).toContain('Maize yields dropped by 30% View Report');
  });
});
