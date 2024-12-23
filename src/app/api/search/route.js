import { NextResponse } from "next/server";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  const { transactionDigest } = await req.json();
  const apiKey = process.env.BLOCKBERRY_KEY;

  const headers = {
    "accept": "*/*",
    "x-api-key": apiKey,
  };

  const response = await fetch(`https://api.blockberry.one/sui/v1/raw-transactions/${transactionDigest}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
  }

  const data = await response.json();

  await delay(2000);

  const response2 = await fetch(`https://api.blockberry.one/sui/v1/transactions/${transactionDigest}/metadata`, {
    method: "GET",
    headers,
  });

  if (!response2.ok) {
    console.log("ERROR HERE");
    return NextResponse.json(data);
  }

  const data2 = await response2.json();

  data["addedMetadata"] = data2;

  return NextResponse.json(data);
}
