import { NextResponse } from 'next/server'

import { getProjects } from '@/lib/fetching/projects'
import { createProject } from '@/lib/mutations/project'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const project = await createProject(body)
    return NextResponse.json(project)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
