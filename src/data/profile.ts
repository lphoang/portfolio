export const profile = {
  name: 'Le Phuoc Hoang',
  tagline: 'Developer, dreamer, everything all at once.',
  intro:
    'Software engineer at mgm technology partners in Da Nang, Vietnam, with five years across back-end and front-end work. After hours I write short videos as code for two YouTube channels, one with "what if" comic stories and one with bite-size coding questions, and I\'m building 2Eat, a meal planner app made with React and Rust.',
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
