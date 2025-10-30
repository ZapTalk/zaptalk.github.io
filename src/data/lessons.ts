import type { Lesson } from '@/types/catalog';

export const lessons: Lesson[] = [
  {
    id: 'A1-L01',
    level: 'A1',
    moduleId: 'A1-M01',
    title: 'Alphabet & Sounds',
    kind: 'vocab',
    isFree: true,
    priceSats: 0,
    durationMin: 5,
    description: 'Learn the English alphabet and basic pronunciation',
    objectives: [
      'Recognize all 26 letters',
      'Pronounce basic sounds correctly',
      'Understand vowel vs consonant distinction',
    ],
    content: {
      html: `
        <div class="space-y-6">
          <h2 class="text-2xl font-bold">The English Alphabet</h2>
          <p class="text-lg">English has 26 letters: 5 vowels (A, E, I, O, U) and 21 consonants.</p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-primary/10 rounded-lg text-center">
              <span class="text-4xl font-bold">A a</span>
              <p class="text-sm mt-2">/eɪ/</p>
            </div>
            <div class="p-4 bg-primary/10 rounded-lg text-center">
              <span class="text-4xl font-bold">B b</span>
              <p class="text-sm mt-2">/biː/</p>
            </div>
            <div class="p-4 bg-primary/10 rounded-lg text-center">
              <span class="text-4xl font-bold">C c</span>
              <p class="text-sm mt-2">/siː/</p>
            </div>
            <div class="p-4 bg-primary/10 rounded-lg text-center">
              <span class="text-4xl font-bold">D d</span>
              <p class="text-sm mt-2">/diː/</p>
            </div>
          </div>

          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p class="font-semibold">💡 Tip:</p>
            <p>Practice saying each letter out loud. Listen to native speakers and repeat!</p>
          </div>
        </div>
      `,
      quiz: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'How many vowels are in the English alphabet?',
          options: ['3', '5', '7', '10'],
          correctAnswer: 1,
          explanation: 'English has 5 vowels: A, E, I, O, U',
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'The letter "B" is a vowel.',
          correctAnswer: 'false',
          explanation: 'B is a consonant. Only A, E, I, O, U are vowels.',
        },
      ],
    },
  },
  {
    id: 'A1-L02',
    level: 'A1',
    moduleId: 'A1-M01',
    title: 'Basic Greetings',
    kind: 'speaking',
    isFree: false,
    priceSats: 2000,
    durationMin: 5,
    description: 'Master essential greetings and introductions',
    objectives: [
      'Greet people in different contexts',
      'Introduce yourself confidently',
      'Ask basic questions about names',
    ],
    content: {
      html: `
        <div class="space-y-6">
          <h2 class="text-2xl font-bold">Greetings & Introductions</h2>
          
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h3 class="font-semibold text-lg mb-2">Formal Greetings</h3>
              <ul class="space-y-2">
                <li><strong>Good morning</strong> - Use before 12 PM</li>
                <li><strong>Good afternoon</strong> - Use from 12 PM to 6 PM</li>
                <li><strong>Good evening</strong> - Use after 6 PM</li>
                <li><strong>How do you do?</strong> - Very formal first meeting</li>
              </ul>
            </div>

            <div class="p-4 bg-green-50 rounded-lg">
              <h3 class="font-semibold text-lg mb-2">Informal Greetings</h3>
              <ul class="space-y-2">
                <li><strong>Hi!</strong> / <strong>Hello!</strong> - Common casual greeting</li>
                <li><strong>Hey!</strong> - Very casual, with friends</li>
                <li><strong>What's up?</strong> - Casual, asking how someone is</li>
              </ul>
            </div>

            <div class="p-4 bg-purple-50 rounded-lg">
              <h3 class="font-semibold text-lg mb-2">Introducing Yourself</h3>
              <div class="space-y-2">
                <p><strong>My name is...</strong> / <strong>I'm...</strong></p>
                <p class="text-sm text-muted-foreground">Example: "Hi! My name is Sarah." or "Hello, I'm John."</p>
                <p class="mt-3"><strong>Nice to meet you!</strong></p>
                <p class="text-sm text-muted-foreground">Say this when meeting someone for the first time</p>
              </div>
            </div>
          </div>

          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p class="font-semibold">🎯 Practice Dialogue:</p>
            <div class="mt-2 space-y-1">
              <p><strong>Person A:</strong> Good morning! My name is Emma.</p>
              <p><strong>Person B:</strong> Good morning, Emma. I'm David. Nice to meet you!</p>
              <p><strong>Person A:</strong> Nice to meet you too, David!</p>
            </div>
          </div>
        </div>
      `,
      quiz: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Which greeting would you use at 3 PM?',
          options: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
          correctAnswer: 1,
          explanation: 'Good afternoon is used from 12 PM to 6 PM',
        },
        {
          id: 'q2',
          type: 'gap-fill',
          question: 'Complete: "Nice to _____ you!"',
          correctAnswer: 'meet',
          explanation: '"Nice to meet you" is a common phrase when meeting someone for the first time',
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'Which is the most casual greeting?',
          options: ['How do you do?', 'Good morning', 'Hey!', 'Good evening'],
          correctAnswer: 2,
          explanation: '"Hey!" is very casual and typically used with friends',
        },
      ],
    },
  },
  {
    id: 'A1-L03',
    level: 'A1',
    moduleId: 'A1-M01',
    title: 'Numbers & Time',
    kind: 'vocab',
    isFree: false,
    priceSats: 2000,
    durationMin: 5,
    description: 'Learn to count and tell time in English',
    objectives: [
      'Count from 0 to 100',
      'Tell time accurately',
      'Use numbers in daily situations',
    ],
    content: {
      html: `
        <div class="space-y-6">
          <h2 class="text-2xl font-bold">Numbers & Time</h2>
          
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h3 class="font-semibold text-lg mb-3">Cardinal Numbers (0-20)</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>0 - zero</div>
                <div>1 - one</div>
                <div>2 - two</div>
                <div>3 - three</div>
                <div>4 - four</div>
                <div>5 - five</div>
                <div>6 - six</div>
                <div>7 - seven</div>
                <div>8 - eight</div>
                <div>9 - nine</div>
                <div>10 - ten</div>
                <div>11 - eleven</div>
                <div>12 - twelve</div>
                <div>13 - thirteen</div>
                <div>14 - fourteen</div>
                <div>15 - fifteen</div>
                <div>16 - sixteen</div>
                <div>17 - seventeen</div>
                <div>18 - eighteen</div>
                <div>19 - nineteen</div>
                <div>20 - twenty</div>
              </div>
            </div>

            <div class="p-4 bg-green-50 rounded-lg">
              <h3 class="font-semibold text-lg mb-3">Telling Time</h3>
              <div class="space-y-2">
                <p><strong>What time is it?</strong> - Used to ask the time</p>
                <div class="mt-3 space-y-1">
                  <p>• <strong>3:00</strong> - It's three o'clock</p>
                  <p>• <strong>3:15</strong> - It's three fifteen / quarter past three</p>
                  <p>• <strong>3:30</strong> - It's three thirty / half past three</p>
                  <p>• <strong>3:45</strong> - It's three forty-five / quarter to four</p>
                </div>
              </div>
            </div>

            <div class="p-4 bg-purple-50 rounded-lg">
              <h3 class="font-semibold text-lg mb-2">Tens (20-100)</h3>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>20 - twenty</div>
                <div>30 - thirty</div>
                <div>40 - forty</div>
                <div>50 - fifty</div>
                <div>60 - sixty</div>
                <div>70 - seventy</div>
                <div>80 - eighty</div>
                <div>90 - ninety</div>
                <div>100 - one hundred</div>
              </div>
              <p class="mt-3 text-sm"><strong>Example:</strong> 25 = twenty-five, 67 = sixty-seven</p>
            </div>
          </div>

          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p class="font-semibold">📱 Practice:</p>
            <p class="mt-2">Try reading your phone number in English, one digit at a time!</p>
          </div>
        </div>
      `,
      quiz: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'How do you say "45"?',
          options: ['fourty-five', 'forty-five', 'fourteen-five', 'four-five'],
          correctAnswer: 1,
          explanation: 'Forty-five is the correct spelling',
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What time is 3:30?',
          options: ['Quarter past three', 'Half past three', 'Quarter to three', 'Three fifteen'],
          correctAnswer: 1,
          explanation: '3:30 is half past three',
        },
        {
          id: 'q3',
          type: 'gap-fill',
          question: 'Complete: "What _____ is it?"',
          correctAnswer: 'time',
          explanation: '"What time is it?" is the question to ask about time',
        },
      ],
    },
  },
];
