import { Projects } from '@/components/projects'
import { Search } from '@/components/search'

export default async function Page() {
  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div className="title">Your Projects</div>
        <div className="w-full max-w-xs">
          <Search />
        </div>
      </div>
      <Projects />
    </div>
  )
}
