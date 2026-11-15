import type { Born } from '@/data/profile'
import type { Job } from '@/data/work'

type Props = { jobs: Job[]; born: Born }

export function Timeline({ jobs, born }: Props) {
  return (
    <ol className="space-y-3">
      {jobs.map(job => (
        <li key={job.company} className="card grid gap-1 p-4 sm:grid-cols-[7.5rem_1fr]">
          <span className="pt-1 font-label text-[10px] text-muted">{job.period}</span>
          <div>
            <h3 className="font-display font-bold">
              {job.company} <span className="font-sans font-normal text-muted">· {job.place}</span>
            </h3>
            <ul className="mt-1 space-y-0.5 text-sm">
              {job.roles.map(role => (
                <li key={role.title + role.period}>
                  {role.title} <span className="text-muted">· {role.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
      <li className="grid gap-1 px-4 sm:grid-cols-[7.5rem_1fr]">
        <span className="font-label text-[10px] text-muted">{born.year}</span>
        <span className="text-sm">{born.text}</span>
      </li>
    </ol>
  )
}
