import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib';
import { Certificate } from '../models/index';

const REGULAR_FONT_PATH = path.resolve(__dirname, '../assets/NotoSans-Regular.ttf');
const BOLD_FONT_PATH = path.resolve(__dirname, '../assets/NotoSans-Bold.ttf');
const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;
const PANEL_WIDTH = 108;
const CONTENT_LEFT = 145;
const CONTENT_RIGHT = PAGE_WIDTH - 38;
const GREEN = rgb(0.055, 0.255, 0.165);
const GOLD = rgb(0.72, 0.49, 0.16);
const INK = rgb(0.12, 0.16, 0.14);
const MUTED = rgb(0.38, 0.42, 0.4);
const PAPER = rgb(0.99, 0.985, 0.955);

const fitSize = (font: PDFFont, text: string, width: number, preferred: number, minimum: number) => {
  let size = preferred;
  while (size > minimum && font.widthOfTextAtSize(text, size) > width) size -= 0.5;
  return size;
};

const drawCentered = (
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  y: number,
  color = INK
) => {
  const width = font.widthOfTextAtSize(text, size);
  const contentWidth = CONTENT_RIGHT - CONTENT_LEFT;
  page.drawText(text, {
    x: CONTENT_LEFT + (contentWidth - width) / 2,
    y,
    size,
    font,
    color
  });
};

const drawRiverPanel = (page: PDFPage, regular: PDFFont) => {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PANEL_WIDTH,
    height: PAGE_HEIGHT,
    color: GREEN
  });
  page.drawLine({
    start: { x: PANEL_WIDTH, y: 0 },
    end: { x: PANEL_WIDTH, y: PAGE_HEIGHT },
    thickness: 1.1,
    color: GOLD
  });

  const drawRiver = (phase: number, sway: number, color: ReturnType<typeof rgb>, thickness: number) => {
    let previous: { x: number; y: number } | null = null;
    for (let index = 0; index <= 56; index++) {
      const y = 105 + index * 6.7;
      const x = 56 + Math.sin(y / 53 + phase) * sway + Math.sin(y / 117 + phase) * 5;
      if (previous) {
        page.drawLine({ start: previous, end: { x, y }, thickness, color });
      }
      previous = { x, y };
    }
  };
  drawRiver(0.2, 20, rgb(0.35, 0.57, 0.45), 0.55);
  drawRiver(0.9, 18, rgb(0.35, 0.57, 0.45), 0.55);
  drawRiver(0.55, 12, GOLD, 1.2);
  drawRiver(1.25, 27, rgb(0.35, 0.57, 0.45), 0.5);

  page.drawText('NAIROBI', {
    x: 22,
    y: 68,
    size: 12,
    font: regular,
    color: PAPER
  });
  page.drawText('KENYA', {
    x: 22,
    y: 51,
    size: 8,
    font: regular,
    color: rgb(0.92, 0.72, 0.37)
  });
  page.drawLine({
    start: { x: 22, y: 540 },
    end: { x: 51, y: 540 },
    thickness: 0.8,
    color: GOLD
  });
};

const embedSignature = async (document: PDFDocument): Promise<PDFImage | undefined> => {
  const configuredPath = process.env.CERTIFICATE_SIGNATURE_PATH;
  if (!configuredPath) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Certificate signature image is not configured.');
    }
    return undefined;
  }

  const signaturePath = path.resolve(configuredPath);
  const extension = path.extname(signaturePath).toLowerCase();
  const bytes = await readFile(signaturePath);
  if (extension === '.png') return document.embedPng(bytes);
  if (extension === '.jpg' || extension === '.jpeg') return document.embedJpg(bytes);
  throw new Error('Certificate signature image must be PNG or JPEG.');
};

export const createCertificatePdf = async (certificate: Certificate): Promise<Buffer> => {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const certificateDate = new Date(certificate.issueDate);
  document.setCreationDate(certificateDate);
  document.setModificationDate(certificateDate);
  document.setTitle(`Certificate of Completion: ${certificate.courseTitle}`);
  document.setAuthor(certificate.instructorName);
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(REGULAR_FONT_PATH),
    readFile(BOLD_FONT_PATH)
  ]);
  const [regular, bold] = await Promise.all([
    document.embedFont(regularBytes),
    document.embedFont(boldBytes)
  ]);
  const page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: PAPER });
  drawRiverPanel(page, regular);

  const signature = await embedSignature(document);

  drawCentered(page, 'NAIROBI CLIMATE JUSTICE', regular, 15, 520, GREEN);
  page.drawLine({
    start: { x: (CONTENT_LEFT + CONTENT_RIGHT) / 2 - 25, y: 501 },
    end: { x: (CONTENT_LEFT + CONTENT_RIGHT) / 2 + 25, y: 501 },
    thickness: 0.8,
    color: GOLD
  });
  drawCentered(page, 'Certificate of Completion', bold, 34, 456, GREEN);
  drawCentered(page, 'Awarded to', regular, 12, 415, MUTED);

  const learnerSize = fitSize(bold, certificate.learnerName, CONTENT_RIGHT - CONTENT_LEFT - 40, 37, 17);
  drawCentered(page, certificate.learnerName, bold, learnerSize, 357, INK);

  drawCentered(
    page,
    'for completing the required lessons and assessments in',
    regular,
    12,
    288,
    MUTED
  );
  const courseSize = fitSize(bold, certificate.courseTitle, CONTENT_RIGHT - CONTENT_LEFT - 48, 25, 13);
  drawCentered(page, certificate.courseTitle, bold, courseSize, 247, GREEN);
  drawCentered(
    page,
    'The course examines climate risks in Nairobi, practical household preparedness,',
    regular,
    11,
    201,
    MUTED
  );
  drawCentered(
    page,
    'and how communities can take part in local climate decisions.',
    regular,
    11,
    183,
    MUTED
  );

  page.drawLine({
    start: { x: CONTENT_LEFT, y: 157 },
    end: { x: CONTENT_RIGHT, y: 157 },
    thickness: 0.45,
    color: rgb(0.78, 0.8, 0.77)
  });

  if (signature) {
    const dimensions = signature.scaleToFit(138, 35);
    page.drawImage(signature, {
      x: CONTENT_LEFT,
      y: 83,
      width: dimensions.width,
      height: dimensions.height
    });
  }
  page.drawLine({
    start: { x: CONTENT_LEFT, y: 78 },
    end: { x: CONTENT_LEFT + 220, y: 78 },
    thickness: 0.75,
    color: GOLD
  });
  page.drawText(certificate.instructorName, {
    x: CONTENT_LEFT,
    y: 55,
    size: 15,
    font: bold,
    color: GREEN
  });
  page.drawText(certificate.instructorTitle, {
    x: CONTENT_LEFT,
    y: 35,
    size: 10,
    font: regular,
    color: MUTED
  });

  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(certificate.issueDate));
  page.drawText('ISSUE DATE', {
    x: 505,
    y: 95,
    size: 8,
    font: regular,
    color: MUTED
  });
  page.drawText(date, {
    x: 505,
    y: 70,
    size: 12,
    font: regular,
    color: INK
  });
  page.drawText('CERTIFICATE ID', {
    x: 657,
    y: 95,
    size: 8,
    font: regular,
    color: MUTED
  });
  const idText = certificate.id;
  const idSize = fitSize(regular, idText, CONTENT_RIGHT - 657, 10, 7);
  page.drawText(idText, {
    x: 657,
    y: 70,
    size: idSize,
    font: regular,
    color: INK
  });

  return Buffer.from(await document.save());
};
