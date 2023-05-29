import { NextResponse } from 'next/server'

import { getProjectDocuments } from '@/lib/fetching/documents'
import { createDocument } from '@/lib/mutations/document'

type ParamsType = {
  params: { id: string }
}

export async function GET(req: Request, { params }: ParamsType) {
  try {
    const documents = await getProjectDocuments(params.id)
    return NextResponse.json(documents)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error?.message, form: error?.form }),
      { status: error?.status }
    )
  }
}

export async function POST(req: Request, { params }: ParamsType) {
  try {
    const body = await req.json()
    const document = await createDocument(params.id, body)
    return NextResponse.json(document)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error?.message, form: error?.form }),
      { status: error?.status }
    )
  }
}
