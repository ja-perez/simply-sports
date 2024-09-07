import { fetchRandomMatch } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
    console.log("Getting random match")
    const res = await fetchRandomMatch()
    return NextResponse.json(res)
}