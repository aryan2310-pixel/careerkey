import { NextResponse } from "next/server";
import type { z } from "zod";

type Result<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: NextResponse };

function failure(error: z.ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      issues: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    },
    { status: 400 }
  );
}

export async function parseBody<S extends z.ZodTypeAny>(
  req: Request,
  schema: S
): Promise<Result<z.infer<S>>> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return { error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }

  const result = schema.safeParse(json);
  if (!result.success) return { error: failure(result.error) };
  return { data: result.data };
}

export function parseQuery<S extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: S
): Result<z.infer<S>> {
  const result = schema.safeParse(Object.fromEntries(searchParams));
  if (!result.success) return { error: failure(result.error) };
  return { data: result.data };
}