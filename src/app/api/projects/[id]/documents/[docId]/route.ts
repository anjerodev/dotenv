import { NextResponse } from 'next/server'

import { updateDocument } from '@/lib/mutations/document'

type ParamsType = {
  params: { id: string; docId: string }
}

export async function PATCH(req: Request, { params }: ParamsType) {
  try {
    const projectId = params.id
    const documentId = params.docId
    const body = await req.json()
    console.log({ projectId, documentId, body })
    const document = await updateDocument(projectId, documentId, body)
    return NextResponse.json(document)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
