import { Website } from '@/types/website';

export const PREDEFINED_WEBSITES: Website[] = [
  {
    id: 'eoffice',
    name: 'E Office Digital Workplace',
    url: 'https://eoffice.itiltd.in',
    isFavorite: false,
    category: 'Work',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'saral-ess',
    name: 'SARAL ESS',
    url: 'https://myhr.itiltd.in',
    isFavorite: false,
    category: 'HR',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'cams-attendance',
    name: 'CAMS Attendance',
    url: 'https://ctoadmin.itiltd.in',
    isFavorite: false,
    category: 'Attendance',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'welfare-quarters',
    name: 'Welfare Quarter Complaints',
    url: 'https://welfare.itiltd.in/quarters_complaints',
    isFavorite: false,
    category: 'Welfare',
    dateAdded: new Date().toISOString(),
  },
];