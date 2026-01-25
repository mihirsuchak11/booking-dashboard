"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding, FAQ } from "@/contexts/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this, or use standard textarea
import { Plus, Trash2, MessageCircle, ChevronLeft, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { BUTTON_SIZE } from "@/lib/ui-constants";

export function FAQsForm() {
    const router = useRouter();
    const { state, addFAQ, removeFAQ } = useOnboarding();
    const { faqs } = state;

    const [isAdding, setIsAdding] = useState(false);
    const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({
        question: "",
        answer: "",
    });

    // Ref for the form container to scroll into view
    const formRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to form when adding starts
    useEffect(() => {
        if (isAdding && formRef.current) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                });
            }, 100);
        }
    }, [isAdding]);

    const handleAddFAQ = () => {
        if (!newFAQ.question || !newFAQ.answer) return;

        addFAQ({
            id: crypto.randomUUID(),
            question: newFAQ.question,
            answer: newFAQ.answer,
        });

        setIsAdding(false);
        setNewFAQ({ question: "", answer: "" });
    };

    const handleBack = () => {
        router.back();
    };

    const handleContinue = () => {
        router.push("/onboarding/review");
    };

    return (
        <div className="w-full flex flex-col h-full max-h-[calc(100dvh-11rem)] md:max-h-[calc(100vh-14rem)]">

            {/* Header */}
            <div className="space-y-2 flex-shrink-0 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">Step 3/4</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Frequently Asked Questions
                </h1>
                <p className="text-sm text-muted-foreground">
                    Help AI answer common customer questions accurately.
                </p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-2 -mr-2">
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="border border-border/50 rounded-lg p-4 bg-card/50 backdrop-blur-sm group space-y-2"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-medium flex items-center gap-2 text-foreground">
                                        <MessageCircle className="h-3 w-3 text-primary" />
                                        {faq.question}
                                    </h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {faq.answer}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFAQ(faq.id)}
                                    className="text-muted-foreground hover:text-destructive shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {faqs.length === 0 && !isAdding && (
                        <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-lg text-muted-foreground">
                            No FAQs added yet.
                        </div>
                    )}
                </div>

                {isAdding || faqs.length === 0 ? (
                    <div 
                        ref={formRef}
                        className="border border-border/50 rounded-lg p-6 space-y-6 bg-card/30 backdrop-blur-sm"
                    >
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Question</Label>
                                <Input
                                    placeholder="e.g. Do you accept insurance?"
                                    value={newFAQ.question}
                                    onChange={(e) =>
                                        setNewFAQ({ ...newFAQ, question: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">Answer</Label>
                                <Textarea
                                    placeholder="e.g. Yes, we accept most major insurance plans..."
                                    className="min-h-[100px]"
                                    value={newFAQ.answer}
                                    onChange={(e) =>
                                        setNewFAQ({ ...newFAQ, answer: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button onClick={handleAddFAQ} disabled={!newFAQ.question || !newFAQ.answer} className="flex-1" size={BUTTON_SIZE}>
                                {faqs.length === 0 ? "Add First FAQ" : "Save FAQ"}
                            </Button>
                            {faqs.length > 0 && (
                                <Button variant="ghost" onClick={() => setIsAdding(false)} size={BUTTON_SIZE}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full border-dashed text-foreground"
                        onClick={() => setIsAdding(true)}
                        size={BUTTON_SIZE}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Another Question
                    </Button>
                )}
            </div>

            {/* Continue Button - Fixed at Bottom */}
            <div className="pt-4 flex-shrink-0 border-t border-border/50 mt-4">
                {!isAdding && faqs.length > 0 && (
                    <Button onClick={handleContinue} className="w-full" size={BUTTON_SIZE}>
                        Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
                {/* If adding or empty, we generally block continue, or user must cancel add first */}
                {isAdding && faqs.length > 0 && (
                    <Button disabled className="w-full" size={BUTTON_SIZE}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                )}
                {faqs.length === 0 && !isAdding && (
                    <Button disabled className="w-full" size={BUTTON_SIZE}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                )}
            </div>
        </div>
    );
}
