import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// This Next.js API route acts as a secure proxy for the payment webhook.
//
// Why this exists:
// The WEBHOOK_SECRET must never be exposed to the browser.
// If we generated the HMAC in the frontend, the secret would be visible
// in the JavaScript bundle. Instead:
//   1. The browser calls this route with just the order_id
//   2. This route reads WEBHOOK_SECRET from server-side env vars
//   3. It generates the HMAC signature and forwards to the Go backend
//   4. The Go backend validates the signature and issues tickets
export async function POST(request: NextRequest) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.WEBHOOK_SECRET;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Build the payload exactly as the Go backend expects
    const payload = JSON.stringify({
      order_id,
      status: "SUCCESS",
      payment_reference: `SIM-${Date.now()}`,
    });

    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    // Forward to the Go backend with the correct signature header
    const response = await fetch(
      `${apiUrl}/webhooks/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
        },
        body: payload,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error ?? "Webhook failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[simulate-payment]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}