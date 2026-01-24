"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/onboarding-context";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, MapPin, Clock, Briefcase, Phone, Store, MessageCircle, Package, Loader2, Edit2 } from "lucide-react";
import { submitOnboardingAction } from "../actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/region-utils";

export function ReviewForm() {
    const router = useRouter();
    const { state } = useOnboarding();
    const { businessInfo, services, faqs } = state;
    const [submitting, setSubmitting] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleEditProfile = () => router.push("/onboarding/search");
    const handleEditServices = () => router.push("/onboarding/services");
    const handleEditFAQs = () => router.push("/onboarding/faqs");

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Prepare data for submission
            const payload = {
                name: businessInfo.name,
                type: businessInfo.type,
                customType: businessInfo.customBusinessType,
                address: businessInfo.address,
                phone: businessInfo.phone,
                email: businessInfo.email,
                description: businessInfo.description,
                region: businessInfo.region,
                timezone: businessInfo.timezone,
                currency: businessInfo.currency,
                locale: businessInfo.locale,
                operatingHours: businessInfo.operatingHours,
                services: services,
                faqs: faqs,
            };

            const result = await submitOnboardingAction(payload);

            if (result.success) {
                toast.success("Business set up successfully!");
                // Clear onboarding session data
                sessionStorage.removeItem("onboarding_state");
                sessionStorage.removeItem("onboarding_state_v2");
                sessionStorage.removeItem("onboarding_generated_full_profile");
                router.push("/dashboard"); // Redirect to dashboard home
            } else {
                toast.error(result.error || "Failed to save business details.");
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An unexpected error occurred.");
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-8">

            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">Step 4/4</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Review & Finish
                </h1>
                <p className="text-sm text-muted-foreground">
                    Check your details before creating your AI agent.
                </p>
            </div>

            <div className="space-y-6">

                {/* Business Profile Summary */}
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                            <Store className="h-4 w-4" /> Business Profile
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleEditProfile} className="h-8 px-2 text-muted-foreground hover:text-foreground">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                        </Button>
                    </div>
                    <div className="space-y-2 pl-6">
                        <div className="font-medium text-lg text-foreground">{businessInfo.name}</div>
                        <div className="grid grid-cols-2 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Briefcase className="h-3 w-3" /> {businessInfo.type === 'other' ? businessInfo.customBusinessType : businessInfo.type}</div>
                            <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {businessInfo.address || "No address"}</div>
                            <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {businessInfo.phone || "No phone"}</div>
                            <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> {businessInfo.operatingHours?.filter(h => h.isOpen).length} days open</div>
                        </div>
                    </div>
                </div>

                {/* Services Summary */}
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                            <Package className="h-4 w-4" /> Services ({services.length})
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleEditServices} className="h-8 px-2 text-muted-foreground hover:text-foreground">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                        </Button>
                    </div>
                    <div className="pl-6 space-y-2">
                        {services.length > 0 ? (
                            services.slice(0, 3).map((s) => (
                                <div key={s.id} className="flex justify-between text-sm">
                                    <span className="text-foreground">{s.name}</span>
                                    <span className="text-muted-foreground">{formatCurrency(s.price, businessInfo.region)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground italic">No services added</div>
                        )}
                        {services.length > 3 && (
                            <div className="text-xs text-muted-foreground pt-1">+ {services.length - 3} more services</div>
                        )}
                    </div>
                </div>

                {/* FAQs Summary */}
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                            <MessageCircle className="h-4 w-4" /> FAQs ({faqs.length})
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleEditFAQs} className="h-8 px-2 text-muted-foreground hover:text-foreground">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                        </Button>
                    </div>
                    <div className="pl-6 space-y-2">
                        {faqs.length > 0 ? (
                            faqs.slice(0, 2).map((q) => (
                                <div key={q.id} className="text-sm">
                                    <div className="font-medium truncate text-foreground">{q.question}</div>
                                    <div className="text-muted-foreground truncate text-xs">{q.answer}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground italic">No FAQs added</div>
                        )}
                        {faqs.length > 2 && (
                            <div className="text-xs text-muted-foreground pt-1">+ {faqs.length - 2} more questions</div>
                        )}
                    </div>
                </div>


                <div className="pt-4">
                    <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up...
                            </>
                        ) : (
                            <>
                                Finish Setup <Check className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
