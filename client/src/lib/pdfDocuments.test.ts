/// <reference types="node" />

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PDFDict, PDFDocument, PDFName, PDFPage, PDFString } from 'pdf-lib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { modules } from '../data/modules';
import { createModulePdf, createStudyNotesPdf } from './pdfDocuments';

const fontFiles = {
  '/fonts/NotoSans-Regular.ttf': resolve('public/fonts/NotoSans-Regular.ttf'),
  '/fonts/NotoSans-Bold.ttf': resolve('public/fonts/NotoSans-Bold.ttf')
};

describe('PDF documents', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      const file = fontFiles[String(input) as keyof typeof fontFiles];
      if (!file) return { ok: false, status: 404 };
      const bytes = new Uint8Array(await readFile(file));
      return { ok: true, status: 200, arrayBuffer: async () => bytes.buffer };
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('creates a multipage A4 module PDF with static Unicode regular and bold fonts', async () => {
    for (const language of ['en', 'sw'] as const) {
      const module = modules[language].find(item => item.id === 'm2');
      if (!module) throw new Error(`Urban Flooding module missing for ${language}`);
      const bytes = await createModulePdf(module, language);
      const pdf = await PDFDocument.load(bytes);
      expect(pdf.getPageCount()).toBeGreaterThan(1);
      for (const page of pdf.getPages()) {
        expect(page.getWidth()).toBeCloseTo(595.28, 1);
        expect(page.getHeight()).toBeCloseTo(841.89, 1);
      }
    }
  }, 20_000);

  it('adds a clickable link annotation for explicit Markdown URLs', async () => {
    const bytes = await createStudyNotesPdf(
      '# Lesson Study Notes: Flooding\n\n## Key Terms\n- **Maji:** Hali ya hewa, jamii, ūpepo — ‘mvua’.\n\n[Verified source](https://example.org/data).',
      'Flooding'
    );
    const pdf = await PDFDocument.load(bytes);
    const annotations = pdf.getPage(0).node.Annots()?.asArray() ?? [];
    expect(annotations).toHaveLength(1);
    const annotation = pdf.context.lookup(annotations[0], PDFDict);
    const action = pdf.context.lookup(annotation.get(PDFName.of('A')), PDFDict);
    const uri = pdf.context.lookup(action.get(PDFName.of('URI')), PDFString);
    expect(uri.decodeText()).toBe('https://example.org/data');
  });

  it('draws bold terms in the bold font and omits emphasis markers in study notes', async () => {
    const drawText = vi.spyOn(PDFPage.prototype, 'drawText');
    await createStudyNotesPdf(
      'A **Life-Cycle Assessment (LCA)** examines the full product lifespan.\n\nA fictional advert claims: *"Zero impact!"*',
      'Product Life-Cycles'
    );

    const boldText = drawText.mock.calls
      .filter(([, options]) => options?.font?.name === 'NotoSans-Bold')
      .map(([text]) => text)
      .join(' ');
    expect(boldText).toContain('Life-Cycle Assessment (LCA)');
    const drawnText = drawText.mock.calls.map(([text]) => text).join(' ');
    expect(drawnText).toContain('"Zero impact!"');
    expect(drawnText).not.toContain('*');
  });
});
