import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { sendLeadNotification } from "@/lib/notify";

const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  city: z.string().trim().min(2, "City is required").max(100),
  course: z.string().trim().min(1, "Please select a course").max(50),
  questions: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const lead = await Lead.create(result.data);

    // Asynchronously dispatch instant notification to counselors (non-blocking)
    sendLeadNotification(result.data).catch(() => {});

    return NextResponse.json(
      { message: "Lead submitted successfully", id: lead._id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
