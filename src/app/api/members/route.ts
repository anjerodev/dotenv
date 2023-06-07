import { NextResponse } from 'next/server'

import { getMembers } from '@/lib/fetching/members'
import { updateProjectMembers } from '@/lib/mutations/members'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const members = await getMembers(body)
    return NextResponse.json(members)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const members = await updateProjectMembers({ ...body })
    return NextResponse.json(members)
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message, form: error?.form }),
      { status: error.status }
    )
  }
}
