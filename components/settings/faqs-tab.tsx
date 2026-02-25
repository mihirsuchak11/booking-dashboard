"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessConfig } from "@/types/database";
import { updateBusinessConfigAction } from "@/app/settings/actions";
import { Plus, Trash2, MessageCircle, Loader2, Save, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { SettingsFormHeader } from "./settings-form-header";

interface FAQsTabProps {
  businessId: string;
  config: BusinessConfig | null;
  title?: string;
  description?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function FAQsTab({ businessId, config, title = "FAQs", description = "Answers to common questions" }: FAQsTabProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFaqs: FAQ[] =
    config?.faqs != null && Array.isArray(config.faqs)
      ? (config.faqs as FAQ[])
      : [];

  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
  });

  const handleAddFAQ = () => {
    if (!newFAQ.question?.trim() || !newFAQ.answer?.trim()) return;
    const faq: FAQ = {
      id: crypto.randomUUID(),
      question: newFAQ.question.trim(),
      answer: newFAQ.answer.trim(),
    };
    setFaqs([...faqs, faq]);
    setIsAdding(false);
    setNewFAQ({ question: "", answer: "" });
  };

  const handleUpdateFAQ = () => {
    if (!editingId || !newFAQ.question?.trim() || !newFAQ.answer?.trim()) return;
    setFaqs(
      faqs.map((f) =>
        f.id === editingId
          ? { ...f, question: newFAQ.question!.trim(), answer: newFAQ.answer!.trim() }
          : f
      )
    );
    setEditingId(null);
    setNewFAQ({ question: "", answer: "" });
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingId(faq.id);
    setNewFAQ({ question: faq.question, answer: faq.answer });
    setIsAdding(false);
  };

  const handleRemoveFAQ = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateBusinessConfigAction(businessId, {
        faqs: faqs,
      });
      if (!result.success) {
        setError(result.error || "Failed to save FAQs");
        setSaving(false);
        return;
      }
      toast.success("FAQs updated", {
        description: "Your FAQs were saved successfully.",
      });
      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const isEditing = isAdding || editingId !== null;

  return (
    <div className="space-y-6">
      <SettingsFormHeader title={title} description={description}>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </SettingsFormHeader>

      <div className="rounded-3xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">FAQs</h2>
            <p className="text-sm text-muted-foreground">
              Questions and answers for your AI assistant and customers
            </p>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`border rounded-lg p-4 bg-background flex items-start justify-between gap-4 group ${
                editingId === faq.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageCircle className="h-3 w-3 text-primary flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {faq.answer}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditFAQ(faq)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFAQ(faq.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {faqs.length === 0 && !isAdding && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
              <p>No FAQs added yet.</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setIsAdding(true)}
              >
                Add your first FAQ
              </Button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-4 border rounded-lg p-4 space-y-4 bg-muted/30">
            <h4 className="font-medium">
              {editingId ? "Edit FAQ" : "Add New FAQ"}
            </h4>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Question</label>
                <Input
                  placeholder="e.g. What are your opening hours?"
                  value={newFAQ.question}
                  onChange={(e) =>
                    setNewFAQ({ ...newFAQ, question: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Answer</label>
                <Textarea
                  placeholder="Your answer..."
                  value={newFAQ.answer}
                  onChange={(e) =>
                    setNewFAQ({ ...newFAQ, answer: e.target.value })
                  }
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdateFAQ : handleAddFAQ}
                disabled={!newFAQ.question?.trim() || !newFAQ.answer?.trim()}
                size="sm"
              >
                {editingId ? "Update" : "Add"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewFAQ({ question: "", answer: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
