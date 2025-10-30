import type { Sku } from '@/types/catalog';

export const skus: Sku[] = [
  // Lesson SKUs
  {
    id: 'sku-lesson-A1-L01',
    type: 'lesson',
    refId: 'A1-L01',
    priceSats: 0,
    displayName: 'Alphabet & Sounds',
    description: 'Free preview lesson',
  },
  {
    id: 'sku-lesson-A1-L02',
    type: 'lesson',
    refId: 'A1-L02',
    priceSats: 2000,
    displayName: 'Basic Greetings',
    description: 'Master essential greetings',
  },
  {
    id: 'sku-lesson-A1-L03',
    type: 'lesson',
    refId: 'A1-L03',
    priceSats: 2000,
    displayName: 'Numbers & Time',
    description: 'Learn numbers and telling time',
  },
  // Module SKUs
  {
    id: 'sku-module-A1-M01',
    type: 'module',
    refId: 'A1-M01',
    priceSats: 3500,
    displayName: 'Essentials Module',
    description: 'Save 500 sats with the bundle!',
  },
  // Level SKUs
  {
    id: 'sku-level-A1',
    type: 'level',
    refId: 'A1',
    priceSats: 20000,
    displayName: 'Complete A1 Level',
    description: 'Full beginner course access',
  },
];
