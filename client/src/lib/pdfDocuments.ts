import type { Color, PDFFont, PDFPage } from 'pdf-lib';
import type { LessonContent, ModuleData } from '../data/modules.en';

type PdfBlock = {
  kind: 'title' | 'heading' | 'paragraph' | 'bullet' | 'numbered' | 'source';
  text: string;
  url?: string;
  listNumber?: number;
};

type TextRun = { text: string; bold: boolean; url?: string };
type PdfFonts = { regular: PDFFont; bold: PDFFont };
type PdfColors = { green: Color; gold: Color; ink: Color; muted: Color; link: Color };

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BODY_SIZE = 11.5;

const pdfDocument = async () => {
  const [{ PDFDocument, PDFName, PDFString, rgb }, { default: fontkit }] = await Promise.all([
    import('pdf-lib'),
    import('@pdf-lib/fontkit')
  ]);
  const [regularResponse, boldResponse] = await Promise.all([
    fetch('/fonts/NotoSans-Regular.ttf'),
    fetch('/fonts/NotoSans-Bold.ttf')
  ]);
  if (!regularResponse.ok || !boldResponse.ok) {
    throw new Error(`Could not load PDF fonts (${regularResponse.status}, ${boldResponse.status})`);
  }

  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const [regular, bold] = await Promise.all([
    regularResponse.arrayBuffer().then(bytes => document.embedFont(bytes, { subset: true })),
    boldResponse.arrayBuffer().then(bytes => document.embedFont(bytes, { subset: true }))
  ]);
  const colors = {
    green: rgb(0.055, 0.255, 0.165),
    gold: rgb(0.72, 0.49, 0.16),
    ink: rgb(0.13, 0.16, 0.14),
    muted: rgb(0.38, 0.42, 0.4),
    link: rgb(0.03, 0.28, 0.58)
  };
  return { document, fonts: { regular, bold }, colors, PDFName, PDFString };
};

const measure = (fonts: PdfFonts, text: string, bold: boolean, size: number) =>
  fonts[bold ? 'bold' : 'regular'].widthOfTextAtSize(text, size);

const formatInline = (value: string): TextRun[] => {
  const tokens = value.split(/(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|https?:\/\/\S+|(?<![\p{L}\p{N}*\\])\*[^*\s](?:[^*\r\n]*[^*\s])?\*(?![\p{L}\p{N}*]))/gu).filter(Boolean);
  return tokens.flatMap(token => {
    const markdownLink = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (markdownLink) return [{ text: markdownLink[1], bold: false, url: markdownLink[2] }];
    if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
      return [{ text: token.slice(2, -2), bold: true }];
    }
    const italic = token.match(/^\*([^*\s](?:[^*\r\n]*[^*\s])?)\*$/);
    if (italic) return [{ text: italic[1], bold: false }];

    const url = token.match(/^(https?:\/\/\S+?)([.,;:!?]+)?$/);
    if (url) {
      return [
        { text: url[1], bold: false, url: url[1] },
        ...(url[2] ? [{ text: url[2], bold: false }] : [])
      ];
    }
    return [{ text: token, bold: false }];
  });
};

const wrapRuns = (fonts: PdfFonts, runs: TextRun[], size: number, maxWidth: number) => {
  const lines: TextRun[][] = [];
  let line: TextRun[] = [];
  let lineWidth = 0;
  const pushLine = () => {
    lines.push(line);
    line = [];
    lineWidth = 0;
  };
  const append = (run: TextRun, text: string, width: number) => {
    const previous = line[line.length - 1];
    if (previous && previous.bold === run.bold && previous.url === run.url) previous.text += text;
    else line.push({ ...run, text });
    lineWidth += width;
  };

  for (const run of runs) {
    const words = run.text.split(/(\s+)/).filter(Boolean);
    for (const word of words) {
      const isWhitespace = /^\s+$/.test(word);
      const width = measure(fonts, word, run.bold, size);
      if (lineWidth + width > maxWidth && line.length > 0 && !isWhitespace) pushLine();
      if (isWhitespace && line.length === 0) continue;

      if (width <= maxWidth) {
        append(run, word, width);
        continue;
      }

      let chunk = '';
      for (const character of word) {
        const nextChunk = chunk + character;
        if (chunk && measure(fonts, nextChunk, run.bold, size) > maxWidth) {
          append(run, chunk, measure(fonts, chunk, run.bold, size));
          pushLine();
          chunk = character;
        } else {
          chunk = nextChunk;
        }
      }
      if (chunk) append(run, chunk, measure(fonts, chunk, run.bold, size));
    }
  }
  if (line.length || !lines.length) pushLine();
  return lines;
};

const markdownBlocks = (markdown: string, title: string): PdfBlock[] => {
  const blocks: PdfBlock[] = [];
  let paragraph: string[] = [];
  let skippedRepeatedTitle = false;
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ').trim() });
      paragraph = [];
    }
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    let line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const headingText = heading[2].replace(/^lesson study notes:\s*/i, '').trim();
      if (
        !skippedRepeatedTitle &&
        heading[1] === '#' &&
        headingText.localeCompare(title, undefined, { sensitivity: 'accent' }) === 0
      ) {
        skippedRepeatedTitle = true;
        continue;
      }
      blocks.push({ kind: 'heading', text: headingText });
      continue;
    }

    const course = line.match(/^\*\*Course:\*\*\s*(.+)$/i);
    if (course) {
      line = `**Course:** ${course[1].replace(/\s+\(m\d+\)\s*$/i, '')}`;
    } else if (/^\*\*Lesson:\*\*/i.test(line)) {
      continue;
    }

    const bullet = line.match(/^[-*+]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      blocks.push({ kind: 'bullet', text: bullet[1].replace(/\s+\(m\d+-l\d+\)\b/gi, '') });
      continue;
    }
    const numbered = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      blocks.push({
        kind: 'numbered',
        text: numbered[2].replace(/\s+\(m\d+-l\d+\)\b/gi, ''),
        listNumber: Number(numbered[1])
      });
      continue;
    }

    paragraph.push(line.replace(/^>\s?/, '').replace(/\s+\(m\d+-l\d+\)\b/gi, ''));
  }
  flushParagraph();
  return blocks;
};

const explicitSourceUrl = (source: string): string | undefined => {
  const match = source.match(/https?:\/\/[^\s)]+/);
  return match?.[0].replace(/[.,;:!?]+$/, '');
};

const lessonBlocks = (lesson: LessonContent, index: number, sw: boolean): PdfBlock[] => {
  const blocks: PdfBlock[] = [
    { kind: 'heading', text: `${sw ? 'Somo' : 'Lesson'} ${index + 1}: ${lesson.heading}` },
    { kind: 'heading', text: sw ? 'Malengo ya Kujifunza' : 'Learning Objectives' },
    ...lesson.objectives.map(text => ({ kind: 'bullet' as const, text })),
    ...lesson.paragraphs.map(text => ({ kind: 'paragraph' as const, text }))
  ];
  if (lesson.nairobiExample) {
    blocks.push(
      { kind: 'heading', text: sw ? 'Mfano wa Nairobi' : 'Nairobi Example' },
      { kind: 'paragraph', text: lesson.nairobiExample }
    );
  }
  if (lesson.keyTerms.length) {
    blocks.push({ kind: 'heading', text: sw ? 'Maneno Muhimu' : 'Key Terms' });
    blocks.push(...lesson.keyTerms.map(term => ({
      kind: 'bullet' as const,
      text: `**${term.term}:** ${term.definition}`
    })));
  }
  if (lesson.takeaways.length) {
    blocks.push({ kind: 'heading', text: sw ? 'Mambo Muhimu ya Kukumbuka' : 'Key Takeaways' });
    blocks.push(...lesson.takeaways.map(text => ({ kind: 'bullet' as const, text })));
  }
  if (lesson.reflectionQuestion) {
    blocks.push(
      { kind: 'heading', text: sw ? 'Swali la Tafakari ya Jamii' : 'Community Reflection' },
      { kind: 'paragraph', text: lesson.reflectionQuestion }
    );
  }
  if (lesson.activity) {
    blocks.push(
      { kind: 'heading', text: sw ? 'Shughuli ya Vitendo' : 'Practical Activity' },
      { kind: 'paragraph', text: lesson.activity }
    );
  }
  if (lesson.misconceptions.length) {
    blocks.push({ kind: 'heading', text: sw ? 'Dhana Potofu na Marekebisho' : 'Misconceptions and Corrections' });
    for (const item of lesson.misconceptions) {
      blocks.push({ kind: 'bullet', text: `**${sw ? 'Dhana Potofu' : 'Misconception'}:** ${item.misconception}` });
      blocks.push({ kind: 'paragraph', text: `**${sw ? 'Marekebisho' : 'Correction'}:** ${item.correction}` });
    }
  }
  if (lesson.sources.length || lesson.relatedLinks?.length) {
    blocks.push({ kind: 'heading', text: sw ? 'Marejeleo na Viungo' : 'Sources and Links' });
    blocks.push(...lesson.sources.map(text => ({
      kind: 'source' as const,
      text,
      ...(explicitSourceUrl(text) ? { url: explicitSourceUrl(text) } : {})
    })));
    blocks.push(...(lesson.relatedLinks || []).map(item => ({
      kind: 'source' as const,
      text: item.title,
      url: item.link
    })));
  }
  return blocks;
};

const drawBlocks = (
  document: Awaited<ReturnType<typeof pdfDocument>>['document'],
  initialPage: PDFPage,
  fonts: PdfFonts,
  blocks: PdfBlock[],
  header: string,
  colors: PdfColors,
  PDFName: Awaited<ReturnType<typeof pdfDocument>>['PDFName'],
  PDFString: Awaited<ReturnType<typeof pdfDocument>>['PDFString']
) => {
  const pages = [initialPage];
  let page = initialPage;
  let y = PAGE_HEIGHT - MARGIN;
  const footerTop = MARGIN + 24;
  const addPage = () => {
    page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    page.drawText(header, { x: MARGIN, y: PAGE_HEIGHT - 32, size: 8.5, font: fonts.regular, color: colors.green });
    page.drawLine({
      start: { x: MARGIN, y: PAGE_HEIGHT - 39 },
      end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 39 },
      thickness: 0.45,
      color: colors.gold
    });
    y = PAGE_HEIGHT - MARGIN - 18;
  };
  const ensureSpace = (height: number) => {
    if (y - height < footerTop) addPage();
  };
  const drawRuns = (
    runs: TextRun[],
    size: number,
    color: Color,
    x: number,
    width: number,
    lineHeight: number,
    leading = 0
  ) => {
    const lines = wrapRuns(fonts, runs, size, width);
    for (const line of lines) {
      ensureSpace(lineHeight);
      let cursorX = x;
      for (const run of line) {
        const runFont = fonts[run.bold ? 'bold' : 'regular'];
        const runWidth = runFont.widthOfTextAtSize(run.text, size);
        const runColor = run.url ? colors.link : color;
        page.drawText(run.text, { x: cursorX, y, size, font: runFont, color: runColor });
        if (run.url) {
          const annotation = document.context.obj({
            Type: PDFName.of('Annot'),
            Subtype: PDFName.of('Link'),
            Rect: [cursorX, y - 2, cursorX + runWidth, y + size + 2],
            Border: [0, 0, 0],
            A: {
              Type: PDFName.of('Action'),
              S: PDFName.of('URI'),
              URI: PDFString.of(run.url)
            }
          });
          page.node.addAnnot(document.context.register(annotation));
        }
        cursorX += runWidth;
      }
      y -= lineHeight;
    }
    y -= leading;
  };

  initialPage.drawText(header, { x: MARGIN, y: PAGE_HEIGHT - 32, size: 8.5, font: fonts.regular, color: colors.green });
  initialPage.drawLine({
    start: { x: MARGIN, y: PAGE_HEIGHT - 39 },
    end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 39 },
    thickness: 0.45,
    color: colors.gold
  });
  y = PAGE_HEIGHT - MARGIN - 18;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.kind === 'title' || block.kind === 'heading') {
      const size = block.kind === 'title' ? 22 : 14;
      const lineHeight = block.kind === 'title' ? 28 : 18;
      const nextBlock = blocks[index + 1];
      const nextLineHeight = nextBlock
        ? nextBlock.kind === 'heading' ? 18 : nextBlock.kind === 'title' ? 28 : 15
        : 0;
      ensureSpace(lineHeight + nextLineHeight + 4);
      y -= block.kind === 'title' ? 2 : 7;
      drawRuns(
        formatInline(block.text).map(run => ({ ...run, bold: true })),
        size,
        colors.green,
        MARGIN,
        CONTENT_WIDTH,
        lineHeight,
        block.kind === 'title' ? 7 : 3
      );
    } else if (block.kind === 'bullet' || block.kind === 'numbered') {
      const marker = block.kind === 'bullet' ? '•  ' : `${block.listNumber ?? 1}.  `;
      drawRuns(formatInline(`${marker}${block.text}`), BODY_SIZE, colors.ink, MARGIN + 6, CONTENT_WIDTH - 6, 15, 2);
    } else {
      const runs = formatInline(block.text);
      if (block.url && !runs.some(run => run.url) && runs[0]) runs[0] = { ...runs[0], url: block.url };
      drawRuns(runs, BODY_SIZE, block.kind === 'source' ? colors.muted : colors.ink, MARGIN, CONTENT_WIDTH, 15, 2);
    }
  }

  pages.forEach((currentPage, index) => {
    currentPage.drawLine({
      start: { x: MARGIN, y: MARGIN + 18 },
      end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 18 },
      thickness: 0.4,
      color: colors.muted
    });
    currentPage.drawText(header, {
      x: MARGIN,
      y: MARGIN + 5,
      size: 8.5,
      font: fonts.regular,
      color: colors.muted
    });
    const footer = `${index + 1} / ${pages.length}`;
    currentPage.drawText(footer, {
      x: PAGE_WIDTH - MARGIN - fonts.regular.widthOfTextAtSize(footer, 8.5),
      y: MARGIN + 5,
      size: 8.5,
      font: fonts.regular,
      color: colors.muted
    });
  });
  return pages;
};

const buildPdf = async (title: string, blocks: PdfBlock[]) => {
  const { document, fonts, colors, PDFName, PDFString } = await pdfDocument();
  document.setTitle(title);
  document.setProducer('Nairobi Climate Justice');
  document.setSubject('Course learning material');
  const firstPage = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawBlocks(document, firstPage, fonts, [{ kind: 'title', text: title }, ...blocks], 'Nairobi Climate Justice', colors, PDFName, PDFString);
  return document.save();
};

const downloadPdf = (bytes: Uint8Array, filename: string) => {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

export const createModulePdf = (module: ModuleData, language: 'en' | 'sw') => {
  const sw = language === 'sw';
  const blocks: PdfBlock[] = [
    { kind: 'paragraph', text: module.description },
    ...module.content.flatMap((lesson, index) => lessonBlocks(lesson, index, sw))
  ];
  return buildPdf(module.title, blocks);
};

export const downloadModulePdf = async (module: ModuleData, language: 'en' | 'sw') => {
  const bytes = await createModulePdf(module, language);
  downloadPdf(bytes, `${module.id}-${language}-module.pdf`);
};

export const createStudyNotesPdf = (markdown: string, title: string) =>
  buildPdf(title, markdownBlocks(markdown, title));

export const downloadStudyNotesPdf = async (markdown: string, title: string, filename: string) => {
  const bytes = await createStudyNotesPdf(markdown, title);
  downloadPdf(bytes, filename);
};
