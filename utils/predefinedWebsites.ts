import { Website } from '@/types/website';

export const PREDEFINED_WEBSITES: Website[] = [
  {
    id: 'eoffice',
    name: 'E Office Digital Workplace',
    url: 'https://eoffice.itiltd.in',
    icon: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isFavorite: false,
    category: 'Work',
    dateAdded: new Date().toISOString(),
    hasAutoLogin: true,
  },
  {
    id: 'saral-ess',
    name: 'SARAL ESS',
    url: 'https://myhr.itiltd.in',
    icon: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isFavorite: false,
    category: 'HR',
    dateAdded: new Date().toISOString(),
    hasAutoLogin: true,
  },
  {
    id: 'cams-attendance',
    name: 'CAMS Attendance',
    url: 'https://ctoadmin.itiltd.in/cams/user',
    icon: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isFavorite: false,
    category: 'Attendance',
    dateAdded: new Date().toISOString(),
    hasAutoLogin: true,
  },
  {
    id: 'welfare-quarters',
    name: 'Welfare Quarter Complaints',
    url: 'https://welfare.itiltd.in/quarters_complaints',
    icon: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isFavorite: false,
    category: 'Welfare',
    dateAdded: new Date().toISOString(),
    hasAutoLogin: true,
  },
];