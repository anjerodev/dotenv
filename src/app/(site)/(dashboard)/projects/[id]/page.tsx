import { getProject } from '@/lib/fetching/projects'
import { DocumentsContainer } from '@/components/documents-container'

type PageParamsType = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export default async function Page({ params: { id } }: PageParamsType) {
  await getProject(id)

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-12">
      <DocumentsContainer projectId={id} />
    </div>
  )
}
