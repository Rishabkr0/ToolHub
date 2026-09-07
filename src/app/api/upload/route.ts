import { NextResponse } from "next/server"

export async function POST(req: Request) {
  return NextResponse.json({ message: "Upload endpoint hit successfully" })
}
