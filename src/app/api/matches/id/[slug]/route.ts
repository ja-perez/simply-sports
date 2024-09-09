import { fetchMatchById } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const matchId = params.slug
    console.log(`Getting match with id: ${matchId}`)
    const res = await fetchMatchById(matchId)
    return NextResponse.json(res)
}