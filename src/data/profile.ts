export const profile = {
  name: 'Le Phuoc Hoang',
  tagline: 'Developer, dreamer, everything all at once.',
  born: { year: '1999', text: 'Born in Hue, Vietnam' },
  hobbies: [
    'Reading detective books',
    'Adventure movies',
    'Coding',
    'Pokémon (games and anime)'
  ],
  links: [
    { label: 'GitHub', text: '@lphoang', url: 'https://github.com/lphoang' },
    {
      label: 'LinkedIn',
      text: 'Le Phuoc Hoang',
      url: 'https://www.linkedin.com/in/le-phuoc-hoang-10933b194/'
    }
  ]
}

export type Born = typeof profile.born
