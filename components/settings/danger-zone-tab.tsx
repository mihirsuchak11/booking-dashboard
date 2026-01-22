"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteBusinessAction } from "@/app/settings/actions";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";

interface DangerZoneTabProps {
  businessId: string;
  businessName: string;
}

export function DangerZoneTab({ businessId, businessName }: DangerZoneTabProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== businessName) {
      setError("Business name doesn't match");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const result = await deleteBusinessAction();

      if (!result.success) {
        setError(result.error || "Failed to delete business");
        setDeleting(false);
        return;
      }

      // Redirect to sign in after deletion
      router.push("/signin");
    } catch (err) {
      console.error("Delete error:", err);
      setError("An unexpected error occurred");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-destructive/10 p-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-destructive">
              Delete Business
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your business and all associated data. This
              action cannot be undone.
            </p>

            <div className="mt-4">
              {!showConfirm ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Business
                </Button>
              ) : (
                <div className="space-y-4 p-4 rounded-lg border border-destructive/30 bg-background">
                  <p className="text-sm font-medium">
                    To confirm, type{" "}
                    <span className="font-mono bg-muted px-1 rounded">
                      {businessName}
                    </span>{" "}
                    below:
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type business name to confirm"
                    className="max-w-md"
                  />

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleting || confirmText !== businessName}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Permanently Delete
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowConfirm(false);
                        setConfirmText("");
                        setError(null);
                      }}
                      disabled={deleting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium mb-2">What will be deleted:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• All business information and settings</li>
          <li>• All call history and recordings</li>
          <li>• All booking records</li>
          <li>• All customer data</li>
          <li>• AI assistant configuration</li>
        </ul>
      </div>
    </div>
  );
}
