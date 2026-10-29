import { modules } from '../data/modules';
import { climateLearningPathways } from '../data/pathways';

export function generateOfflineLearningPackMarkdown(language: 'en' | 'sw' = 'en'): string {
  const currentMods = modules[language];
  const isSwahili = language === 'sw';

  let pack = `# ${isSwahili ? 'Kifurushi cha Mafunzo ya Haki ya Tabianchi Nairobi' : 'Nairobi Climate Justice Offline Learning Pack'}\n`;
  pack += `**Publisher:** Climate Justice Nairobi\n`;
  pack += `**Format:** Low-Bandwidth Text & Field Guide\n`;
  pack += `**Generated Date:** ${new Date().toISOString().slice(0, 10)}\n\n`;
  pack += `---\n\n`;

  pack += `## ${isSwahili ? 'Njia 6 za Masomo' : '6 Structured Climate Learning Pathways'}\n\n`;
  for (const pathway of climateLearningPathways) {
    pack += `### ${isSwahili ? pathway.swTitle : pathway.title} (${pathway.level.toUpperCase()} - ${pathway.durationHours} Hours)\n`;
    pack += `${isSwahili ? pathway.swDescription : pathway.description}\n`;
    pack += `* **Prerequisites:** ${pathway.prerequisites.join('; ')}\n`;
    pack += `* **Applied Project:** ${pathway.finalProjectTitle}\n\n`;
  }

  pack += `---\n\n`;
  pack += `## ${isSwahili ? 'Mitaala Kamili ya Moduli 7' : 'Complete 7-Module Curriculum'}\n\n`;

  for (const mod of currentMods) {
    pack += `### ${mod.title}\n`;
    pack += `${mod.description}\n\n`;

    for (let i = 0; i < mod.content.length; i++) {
      const lesson = mod.content[i];
      pack += `#### Lesson ${i + 1}: ${lesson.heading}\n\n`;

      if (lesson.objectives && lesson.objectives.length > 0) {
        pack += `**Objectives:**\n`;
        lesson.objectives.forEach(obj => { pack += `- ${obj}\n`; });
        pack += `\n`;
      }

      pack += `**Content Summary:**\n`;
      lesson.paragraphs.forEach(p => { pack += `${p}\n\n`; });

      if (lesson.nairobiExample) {
        pack += `**Nairobi Practical Context:**\n> "${lesson.nairobiExample}"\n\n`;
      }

      if (lesson.takeaways && lesson.takeaways.length > 0) {
        pack += `**Key Takeaways:**\n`;
        lesson.takeaways.forEach(t => { pack += `- ${t}\n`; });
        pack += `\n`;
      }

      if (lesson.keyTerms && lesson.keyTerms.length > 0) {
        pack += `**Key Terms:**\n`;
        lesson.keyTerms.forEach(kt => {
          pack += `- **${kt.term}:** ${kt.definition}\n`;
        });
        pack += `\n`;
      }

      pack += `---\n\n`;
    }
  }

  return pack;
}

export function downloadOfflineLearningPack(language: 'en' | 'sw' = 'en') {
  const markdown = generateOfflineLearningPackMarkdown(language);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nairobi-climate-justice-offline-pack-${language}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
