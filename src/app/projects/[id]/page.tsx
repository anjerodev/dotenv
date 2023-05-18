import PageContent from './content'

type PageParamsType = {
  params: { id: string }
}

export default async function ProjectPage({ params: { id } }: PageParamsType) {
  return (
    <>
      <div className="mx-auto max-w-4xl px-8 py-12">
        <PageContent id={id} />
      </div>
    </>
  )
}
