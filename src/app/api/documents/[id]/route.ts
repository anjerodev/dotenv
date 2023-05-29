import { NextResponse } from 'next/server'

import { getDocument } from '@/lib/fetching/documents'
import { updateDocument } from '@/lib/mutations/document'

type ParamsType = {
  params: { id: string }
}

export async function GET(req: Request, { params }: ParamsType) {
  try {
    const id = params.id
    const document = await getDocument(id)
    return NextResponse.json(document)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}

export async function PATCH(req: Request, { params }: ParamsType) {
  try {
    const id = params.id
    const body = await req.json()
    const document = await updateDocument(id, body)
    return NextResponse.json(document)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
