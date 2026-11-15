// A section heading; each era adds its own decoration (see .section-label in globals.css).
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label mb-3">{children}</h2>
}
