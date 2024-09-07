import { fetchMatchesByParams } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
    console.log("Getting all matches")
    const res = await fetchMatchesByParams({})
    return NextResponse.json(res)
}