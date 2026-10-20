import { modules_en } from './modules.en';
import { modules_sw } from './modules.sw';
import type { ModuleData } from './modules.en';

export * from './modules.en';
export { modules_sw } from './modules.sw';

export const modules: Record<'en' | 'sw', ModuleData[]> = {
  en: modules_en,
  sw: modules_sw
};
