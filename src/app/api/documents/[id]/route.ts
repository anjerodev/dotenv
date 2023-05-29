import { NextResponse } from 'next/server'

import { getDocument } from '@/lib/fetching/documents'

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
