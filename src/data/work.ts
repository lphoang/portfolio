export type Role = { title: string; period: string }

export type Job = {
  company: string
  place: string
  period: string
  roles: Role[]
}

// From the LinkedIn profile, newest first.
export const work: Job[] = [
  {
    company: 'mgm technology partners Vietnam',
    place: 'Da Nang',
    period: '2025 – now',
    roles: [{ title: 'Software Engineer', period: 'Jun 2025 – now' }]
  },
  {
    company: 'mesoneer',
    place: 'Da Nang',
    period: '2023 – 2025',
    roles: [{ title: 'Software Engineer', period: 'Feb 2023 – May 2025' }]
  },
  {
    company: 'FPT Software',
    place: 'Da Nang',
    period: '2021 – 2023',
    roles: [
      { title: 'Frontend Developer', period: 'May 2022 – Jan 2023' },
      { title: 'Back End Developer', period: 'Oct 2021 – Jan 2023' },
      { title: 'Back End Developer (intern)', period: 'Jun – Jul 2021' }
    ]
  }
]

export const education = {
  degree: 'Engineering degree',
  school: 'Danang University of Science and Technology',
  period: '2017 – 2022'
}
