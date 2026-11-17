// Every Kanotes text is in both languages; CSS shows the one picked in
// `data-kanotes-lang` (see src/lib/kanotesLang.ts and kanotes.css).
export function T({ vi, en }: { vi: React.ReactNode; en: React.ReactNode }) {
  return (
    <>
      <span lang="vi" className="k-vi">
        {vi}
      </span>
      <span lang="en" className="k-en">
        {en}
      </span>
    </>
  )
}
