import type { ModuleData } from './modules.en';
import { modules_sw_part1 } from './modules.sw.part1';
import { modules_sw_part2 } from './modules.sw.part2';

export const modules_sw: ModuleData[] = [
  ...modules_sw_part1,
  ...modules_sw_part2
];
