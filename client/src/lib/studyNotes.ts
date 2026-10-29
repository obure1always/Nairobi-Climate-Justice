import type { ModuleData, LessonContent } from '../data/modules.en';
import type { LessonMediaData } from '../data/lessonMedia';

/**
 * Builds a comprehensive, cleanly structured study notes Markdown document
 * for a specific lesson, integrating curriculum concepts, field contexts,
 * key definitions, takeaways, and verified media observations.
 */
export function generateComprehensiveStudyNotes(
  moduleData: ModuleData,
  lesson: LessonContent,
  media?: LessonMediaData | null
): string {
  const sections: string[] = [];

  // Header Title
  sections.push(`# Lesson Study Notes: ${lesson.heading}`);

  // Metadata block
  sections.push(
    `**Course:** ${moduleData.title} (${moduleData.id.toUpperCase()})\n` +
    `**Lesson:** ${lesson.heading} (${lesson.id})\n` +
    `**Platform:** Climate Justice Nairobi\n` +
    `**Focus:** Kenya Climate Resilience, Urban Adaptation, and Environmental Rights`
  );

  // Learning Objectives
  if (lesson.objectives && lesson.objectives.length > 0) {
    sections.push(
      `## Learning Outcomes & Objectives\n` +
      lesson.objectives.map((obj) => `- ${obj}`).join('\n')
    );
  }

  // Core Theoretical Explanation
  if (lesson.paragraphs && lesson.paragraphs.length > 0) {
    sections.push(
      `## Core Conceptual Synthesis\n` +
      lesson.paragraphs.join('\n\n')
    );
  }

  // Kenyan Practical Context
  if (lesson.nairobiExample) {
    sections.push(
      `## Kenyan Field Context & Observations\n` +
      `> "${lesson.nairobiExample}"`
    );
  }

  // Key Terms
  if (lesson.keyTerms && lesson.keyTerms.length > 0) {
    sections.push(
      `## Key Terminology & Definitions\n` +
      lesson.keyTerms.map((k, i) => `${i + 1}. **${k.term}:** ${k.definition}`).join('\n')
    );
  }

  // Key Takeaways
  if (lesson.takeaways && lesson.takeaways.length > 0) {
    sections.push(
      `## Critical Takeaways\n` +
      lesson.takeaways.map((t) => `- ${t}`).join('\n')
    );
  }

  // Misconceptions & Corrections
  if (lesson.misconceptions && lesson.misconceptions.length > 0) {
    sections.push(
      `## Scientific Corrections & Misconceptions\n` +
      lesson.misconceptions
        .map((m) => `- **Misconception:** ${m.misconception}\n  **Scientific Correction:** ${m.correction}`)
        .join('\n\n')
    );
  }

  // Practical Field Activity
  if (lesson.activity) {
    sections.push(
      `## Practical Field Exercise\n` +
      `${lesson.activity}`
    );
  }

  // Verified Media Overview
  if (media) {
    const mediaPoints = [
      `**Title:** ${media.videoTitle}`,
      `**Attribution / Publisher:** ${media.sourceAttribution}`,
      `**Format:** ${media.hasAudio ? 'Spoken Narration (English)' : 'Silent Geospatial & Scientific Simulation'}`,
      `**Duration:** ${media.videoDuration}`
    ];
    if (media.keyTakeaways && media.keyTakeaways.length > 0) {
      mediaPoints.push(`\n### Media Analysis Takeaways\n` + media.keyTakeaways.map(t => `- ${t}`).join('\n'));
    }
    sections.push(
      `## Verified Media & Observation Record\n` +
      mediaPoints.join('\n')
    );
  }

  // Sources
  if (lesson.sources && lesson.sources.length > 0) {
    sections.push(
      `## Scientific Citations & Regulatory References\n` +
      lesson.sources.map((s) => `- ${s}`).join('\n')
    );
  }

  return sections.join('\n\n') + '\n';
}
