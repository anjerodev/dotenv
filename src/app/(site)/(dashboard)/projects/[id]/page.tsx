import { getProject } from '@/lib/fetching/projects'
import { DocumentsContainer } from '@/components/documents-container'

type PageParamsType = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export default async function Page({ params: { id } }: PageParamsType) {
  await getProject(id)

  return (
    <>
      <DocumentsContainer projectId={id} />
    </>
  )
}
