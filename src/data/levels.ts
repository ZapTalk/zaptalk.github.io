import type { Level } from '@/types/catalog';

export const levels: Level[] = [
  {
    code: 'A1',
    title: 'Beginner A1',
    description: 'Start your English journey with the basics',
    moduleIds: ['A1-M01'],
  },
  {
    code: 'A2',
    title: 'Elementary A2',
    description: 'Build on your foundation',
    moduleIds: [],
  },
  {
    code: 'B1',
    title: 'Intermediate B1',
    description: 'Develop confidence in everyday situations',
    moduleIds: [],
  },
  {
    code: 'B2',
    title: 'Upper Intermediate B2',
    description: 'Express yourself fluently and spontaneously',
    moduleIds: [],
  },
  {
    code: 'C1',
    title: 'Advanced C1',
    description: 'Master complex language use',
    moduleIds: [],
  },
  {
    code: 'C2',
    title: 'Proficiency C2',
    description: 'Achieve native-like fluency',
    moduleIds: [],
  },
];
