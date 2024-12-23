import { NextResponse } from "next/server";

export async function POST(req) {
  const { packageValue } = await req.json();
  const apiKey = process.env.BLOCKBERRY_KEY;

  const headers = {
    "accept": "*/*",
    "x-api-key": apiKey,
  };

  const response = await fetch(`https://api.blockberry.one/sui/v1/packages/${packageValue}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
