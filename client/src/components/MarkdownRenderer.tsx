import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Safely parses inline markdown elements into React nodes:
 * - Bold: **text**
 * - Italic: *text*
 * - Inline code: `code`
 * - Links: [label](url)
 */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Regex to match links, inline code, bold, italic
  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Link [text](url)
      nodes.push(
        <a
          key={`link-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:text-emerald-900 underline font-medium"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // Code `code`
      nodes.push(
        <code
          key={`code-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono text-xs text-emerald-800 font-semibold"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      // Bold **text**
      nodes.push(
        <strong key={`bold-${match.index}`} className="font-bold text-gray-950">
          {match[5]}
        </strong>
      );
    } else if (match[6]) {
      // Italic *text*
      nodes.push(
        <em key={`italic-${match.index}`} className="italic text-gray-800">
          {match[6]}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  // Unescape backslashes before markdown characters and normalize line breaks
  const sanitizedContent = content
    .replace(/\\n/g, '\n')
    .replace(/\\([*_#`~\[\]()|])/g, '$1');

  const lines = sanitizedContent.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let currentListItems: React.ReactNode[] = [];
  let currentTableRows: string[] = [];

  const flushList = (keySuffix: number | string) => {
    if (currentListType && currentListItems.length > 0) {
      if (currentListType === 'ul') {
        elements.push(
          <ul key={`ul-${keySuffix}`} className="my-3 space-y-1.5 list-disc pl-5 text-gray-750 text-sm leading-relaxed">
            {currentListItems}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${keySuffix}`} className="my-3 space-y-1.5 list-decimal pl-5 text-gray-750 text-sm leading-relaxed">
            {currentListItems}
          </ol>
        );
      }
      currentListType = null;
      currentListItems = [];
    }
  };

  const flushTable = (keySuffix: number | string) => {
    if (currentTableRows.length > 0) {
      // Filter out markdown divider rows like | --- | --- |
      const validRows = currentTableRows.filter(r => !/^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)+\|?\s*$/.test(r));
      if (validRows.length > 0) {
        const parseRow = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
        const headerCells = parseRow(validRows[0]);
        const bodyRows = validRows.slice(1).map(parseRow);

        elements.push(
          <div key={`table-${keySuffix}`} className="my-3 overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {headerCells.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-bold text-gray-900 border-r last:border-r-0 border-gray-200">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-gray-50/50' : ''}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-gray-800 border-r last:border-r-0 border-gray-200">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      currentTableRows = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table line: starts and ends with pipe, or contains multiple pipes
    if (trimmed.startsWith('|') && (trimmed.endsWith('|') || trimmed.includes('|'))) {
      flushList(idx);
      currentTableRows.push(trimmed);
      return;
    }

    // Any non-table line flushes pending tables
    flushTable(idx);

    // Empty line flushes lists and resets
    if (!trimmed) {
      flushList(idx);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h3 key={`h3-${idx}`} className="text-base font-bold text-gray-900 mt-4 mb-2 tracking-tight">
          {renderInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h2 key={`h2-${idx}`} className="text-lg md:text-xl font-extrabold text-[#00331e] mt-6 mb-3 tracking-tight border-b border-gray-100 pb-1.5">
          {renderInline(trimmed.substring(3))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h1 key={`h1-${idx}`} className="text-xl md:text-2xl font-black text-gray-950 mt-2 mb-4 tracking-tight border-b-2 border-emerald-800/20 pb-2">
          {renderInline(trimmed.substring(2))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(idx);
      elements.push(
        <blockquote key={`quote-${idx}`} className="my-3 pl-4 py-1.5 border-l-4 border-emerald-600 bg-emerald-50/60 rounded-r-xl text-gray-800 text-sm italic">
          {renderInline(trimmed.substring(2))}
        </blockquote>
      );
      return;
    }

    // Unordered List (- or * followed by space)
    if (/^[-*]\s+/.test(trimmed)) {
      if (currentListType !== 'ul') {
        flushList(idx);
        currentListType = 'ul';
      }
      const itemContent = trimmed.replace(/^[-*]\s+/, '');
      currentListItems.push(
        <li key={`li-${idx}`} className="pl-1">
          {renderInline(itemContent)}
        </li>
      );
      return;
    }

    // Ordered List (1. 2. etc)
    if (/^\d+\.\s+/.test(trimmed)) {
      if (currentListType !== 'ol') {
        flushList(idx);
        currentListType = 'ol';
      }
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      currentListItems.push(
        <li key={`oli-${idx}`} className="pl-1">
          {renderInline(itemContent)}
        </li>
      );
      return;
    }

    // Standard paragraph line
    flushList(idx);
    elements.push(
      <p key={`p-${idx}`} className="my-2 text-sm leading-relaxed text-gray-800">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList('end');
  flushTable('end');

  return (
    <div className={`prose-clean space-y-1 text-gray-850 ${className}`}>
      {elements}
    </div>
  );
}
