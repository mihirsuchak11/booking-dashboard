import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPlanKey } from "@/config/stripe-plans";

const STRIPE_PLAN_COOKIE = "stripe_plan";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/signin") {
    return NextResponse.next();
  }

  const planParam = request.nextUrl.searchParams.get("plan");
  const planKey = planParam && isPlanKey(planParam) ? planParam : null;

  if (!planKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(STRIPE_PLAN_COOKIE, planKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
}
