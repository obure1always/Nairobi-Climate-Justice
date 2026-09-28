import { BookText, AlertTriangle, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ResourceCategory = 'learn-more' | 'emergency-preparedness' | 'rights-civic-participation';

export interface ResourceData {
  id: string;
  category: ResourceCategory;
  title: string;
  description: string;
  source: string;
  url: string;
}

export const resourceCategories: { id: ResourceCategory; titleEn: string; titleSw: string; icon: LucideIcon }[] = [
  {
    id: 'learn-more',
    titleEn: 'Learn More',
    titleSw: 'Jifunze Zaidi',
    icon: BookText
  },
  {
    id: 'emergency-preparedness',
    titleEn: 'Emergency & Preparedness',
    titleSw: 'Maandalizi ya Dharura',
    icon: AlertTriangle
  },
  {
    id: 'rights-civic-participation',
    titleEn: 'Rights & Civic Participation',
    titleSw: 'Haki na Ushiriki',
    icon: Scale
  }
];

export const resources: ResourceData[] = [
  {
    id: "climate-change-act-2016",
    category: "learn-more",
    title: "Kenya Climate Change Act 2016",
    description: "Understanding Kenya's legal framework for responding to climate change.",
    source: "Kenya Law",
    url: "https://new.kenyalaw.org/akn/ke/act/2016/11/eng%402022-12-31"
  },
  {
    id: "nairobi-climate-action-plan",
    category: "learn-more",
    title: "Nairobi Climate Action Plan 2020–2050",
    description: "Explore Nairobi City's climate mitigation and adaptation priorities.",
    source: "Nairobi City County Government",
    url: "https://nairobi.go.ke/climate-action-plan-2020-2050"
  },
  {
    id: "nairobi-climate-action-plan-full",
    category: "learn-more",
    title: "Nairobi Climate Action Plan 2020–2050 - Full Document",
    description: "Access the full Nairobi Climate Action Plan for deeper research.",
    source: "KIPPRA Repository / County Government of Nairobi",
    url: "https://repository.kippra.or.ke/items/8f93f334-1dcc-4bfc-8615-b357180fe067"
  },
  {
    id: "kenya-red-cross-floods",
    category: "emergency-preparedness",
    title: "Kenya Red Cross - Floods Operations",
    description: "Learn about flood preparedness, response and safety information relevant to Kenya.",
    source: "Kenya Red Cross Society",
    url: "https://redcross.or.ke/floods/"
  },
  {
    id: "kenya-red-cross-emergency",
    category: "emergency-preparedness",
    title: "Kenya Red Cross Emergency Support",
    description: "Find flood and emergency preparedness information and support from the Kenya Red Cross Society.",
    source: "Kenya Red Cross Society",
    url: "https://redcross.or.ke/floods/"
  },
  {
    id: "county-public-participation-guidelines",
    category: "rights-civic-participation",
    title: "County Public Participation Guidelines",
    description: "Learn how residents can participate in county policy, planning, budgeting, implementation, monitoring and evaluation.",
    source: "Government of Kenya",
    url: "https://knowledgehub.devolution.go.ke/wp-content/uploads/2022/05/county-public-participation_january-2016.pdf"
  },
  {
    id: "kenya-policy-on-public-participation",
    category: "rights-civic-participation",
    title: "Kenya Policy on Public Participation - Sessional Paper No. 3 of 2023",
    description: "Understand Kenya's national framework for public participation and citizen engagement.",
    source: "Kenya Law Reform Commission / Office of the Attorney-General and Department of Justice",
    url: "https://www.klrc.go.ke/index.php/reports-and-publications/752-kenya-policy-on-public-participation-sessional-paper-no-3-of-2023"
  }
];
