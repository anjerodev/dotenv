import { NextResponse } from 'next/server'

import { getProject } from '@/lib/fetching/projects'
import { removeProject, updateProject } from '@/lib/mutations/project'

type ParamsType = {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: ParamsType) {
  try {
    const id = params.id
    const data = await getProject(id)

    return NextResponse.json(data)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}

export async function PATCH(req: Request, { params }: ParamsType) {
  try {
    const body = await req.json()
    const project = await updateProject(params.id, body)
    return NextResponse.json(project)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}

export async function DELETE(req: Request, { params }: ParamsType) {
  try {
    const project = await removeProject(params.id)
    return NextResponse.json(project)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
