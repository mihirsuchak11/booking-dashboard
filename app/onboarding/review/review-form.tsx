"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/contexts/onboarding-context";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Clock, Briefcase, Phone, Store, MessageCircle, Package, Loader2, Edit2, ChevronLeft } from "lucide-react";
import { submitOnboardingAction } from "../actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/region-utils";
import { BUTTON_SIZE } from "@/lib/ui-constants";

export function ReviewForm() {
    const router = useRouter();
    const { state } = useOnboarding();
    const { businessInfo, services, faqs } = state;
    const [submitting, setSubmitting] = useState(false);

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
                // Removed while removing onboarding questions page - this sessionStorage key was only used by /onboarding/questions route
                // sessionStorage.removeItem("onboarding_generated_full_profile");
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
        <>
            <div className="w-full flex flex-col h-full max-h-[calc(100dvh-226px)] md:max-h-[calc(100dvh-240px)] lg:max-h-[calc(100dvh-158px)]">

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-2 -mr-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Business Profile Summary */}
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider min-w-0">
                            <Store className="h-4 w-4 flex-shrink-0" /> 
                            <span className="truncate">Business Profile</span>
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleEditProfile} className="h-8 px-2 text-muted-foreground hover:text-foreground flex-shrink-0">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                        </Button>
                    </div>
                    <div className="space-y-2 pl-6">
                        <div className="font-medium text-lg text-foreground break-words">{businessInfo.name}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 min-w-0">
                                <Briefcase className="h-3 w-3 flex-shrink-0" /> 
                                <span className="truncate">{businessInfo.type === 'other' ? businessInfo.customBusinessType : businessInfo.type}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <MapPin className="h-3 w-3 flex-shrink-0" /> 
                                <span className="truncate">{businessInfo.address || "No address"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Phone className="h-3 w-3 flex-shrink-0" /> 
                                <span className="truncate">{businessInfo.phone || "No phone"}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                                <Clock className="h-3 w-3 flex-shrink-0" /> 
                                <span>{businessInfo.operatingHours?.filter(h => h.isOpen).length} days open</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Summary */}
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/50 backdrop-blur-sm lg:col-span-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider min-w-0">
                            <Package className="h-4 w-4 flex-shrink-0" /> 
                            <span className="truncate">Services ({services.length})</span>
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleEditServices} className="h-8 px-2 text-muted-foreground hover:text-foreground flex-shrink-0">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                        </Button>
                    </div>
                    <div className="pl-6 space-y-2">
                        {services.length > 0 ? (
                            services.slice(0, 3).map((s) => (
                                <div key={s.id} className="flex justify-between gap-2 text-sm min-w-0">
                                    <span className="text-foreground truncate min-w-0">{s.name}</span>
                                    <span className="text-muted-foreground flex-shrink-0 ml-2">{formatCurrency(s.price, businessInfo.region)}</span>
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
                <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-card/50 backdrop-blur-sm lg:col-span-2">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider min-w-0">
                            <MessageCircle className="h-4 w-4 flex-shrink-0" /> 
                            <span className="truncate">FAQs ({faqs.length})</span>
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleEditFAQs} className="h-8 px-2 text-muted-foreground hover:text-foreground flex-shrink-0">
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                        </Button>
                    </div>
                    <div className="pl-6 space-y-2">
                        {faqs.length > 0 ? (
                            faqs.slice(0, 2).map((q) => (
                                <div key={q.id} className="text-sm min-w-0">
                                    <div className="font-medium text-foreground break-words line-clamp-2">{q.question}</div>
                                    <div className="text-muted-foreground text-xs break-words line-clamp-2 mt-1">{q.answer}</div>
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
                </div>
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="pt-4 flex-shrink-0 border-t border-border/50 mt-4 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end lg:justify-between gap-3 min-w-0 w-full">
                    {/* Back Button - Left Side (Hidden on mobile, visible on large screens) */}
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        size={BUTTON_SIZE}
                        className="hidden lg:flex flex-shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>

                    {/* Finish Setup Button - Right Side */}
                    <Button 
                        onClick={handleSubmit} 
                        disabled={submitting} 
                        className="w-full sm:flex-shrink-0 sm:max-w-[180px] min-w-0" 
                        size={BUTTON_SIZE}
                    >
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
        </>
    );
}
