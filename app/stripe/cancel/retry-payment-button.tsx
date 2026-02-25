"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RetryPaymentButtonProps {
  planKey: string;
}

export function RetryPaymentButton({ planKey }: RetryPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRetry() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Preserve plan so after sign-in they go straight to Stripe for same plan
          router.push(`/signin?plan=${encodeURIComponent(planKey)}`);
          return;
        }
        router.push("/");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      router.push("/");
    } catch {
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleRetry} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting…
        </>
      ) : (
        "Retry payment"
      )}
    </Button>
  );
}
