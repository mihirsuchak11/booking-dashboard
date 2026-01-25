"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowRight, Loader2, Save, MapPin, Globe, Mail, Phone, Clock, DollarSign, Check, ChevronRight, ChevronLeft, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { saveKnowledgeBase, submitOnboardingAction } from "../actions";
import { BrandedBackground } from "@/components/branded-background";
import { BrandedCard } from "@/components/branded-card";
import { INPUT_HEIGHT, BUTTON_SIZE } from "@/lib/ui-constants";
import { cn } from "@/lib/utils";

// Types matching our schema
interface FAQ {
    id: string;
    question: string;
    answer: string;
    source?: string;
    askDuringCall?: boolean;
}

interface Service {
    name: string;
    duration?: number;
    price?: number;
    description: string;
}

interface BusinessInfo {
    description: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    category?: string;
    name?: string;
}

interface WorkingHours {
    [key: string]: { isOpen: boolean; open: string; close: string };
}

interface FullProfile {
    businessInfo: BusinessInfo;
    hours: WorkingHours;
    services: Service[];
    faqs: FAQ[];
}

const STEPS = [
    { id: "intro", title: "Welcome" },
    { id: "info", title: "Business Info" },
    { id: "hours", title: "Business Hours" },
    { id: "services", title: "Services" },
    { id: "faqs", title: "FAQs" },
    { id: "finish", title: "Finish" }
];

export default function ReviewProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isHoursEditing, setIsHoursEditing] = useState(false);

    // Initial empty state
    const [data, setData] = useState<FullProfile>({
        businessInfo: { description: "" },
        hours: {},
        services: [],
        faqs: []
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Try to load full profile
            const storedProfile = sessionStorage.getItem("onboarding_generated_full_profile");
            console.log("[Onboarding] SessionStorage raw:", storedProfile);

            if (storedProfile) {
                try {
                    const parsed = JSON.parse(storedProfile);
                    console.log("[Onboarding] Loaded profile from session:", parsed);
                    setData(parsed);
                } catch (e) {
                    console.error("Failed to parse profile", e);
                }
            } else {
                console.warn("[Onboarding] No profile found in sessionStorage!");
            }
        }
    }, []);

    const updateBusinessInfo = (field: keyof BusinessInfo, value: string) => {
        setData(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, [field]: value } }));
    };

    const updateService = (index: number, field: keyof Service, value: string | number | undefined) => {
        const newServices = [...data.services];
        // @ts-ignore
        newServices[index] = { ...newServices[index], [field]: value };
        setData(prev => ({ ...prev, services: newServices }));
    };

    const addService = () => {
        setData(prev => ({
            ...prev,
            services: [...prev.services, { name: "", description: "" }]
        }));
    };

    const removeService = (index: number) => {
        setData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
    };

    const updateFAQ = (index: number, field: keyof FAQ, value: any) => {
        const newFAQs = [...data.faqs];
        newFAQs[index] = { ...newFAQs[index], [field]: value };
        setData(prev => ({ ...prev, faqs: newFAQs }));
    };

    const addFAQ = () => {
        setData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { id: Math.random().toString(), question: "", answer: "" }]
        }));
    };

    const removeFAQ = (index: number) => {
        setData(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index)
        }));
    };

    const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    const updateHours = (day: string, field: "isOpen" | "open" | "close", value: any) => {
        setData(prev => ({
            ...prev,
            hours: {
                ...prev.hours,
                [day]: { ...prev.hours[day], [field]: value }
            }
        }));
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log("[Onboarding] Current data state:", data);

            const onboardingPayload = {
                name: data.businessInfo.name || "My Business",
                address: data.businessInfo.address,
                description: data.businessInfo.description,
                email: data.businessInfo.email,
                website: data.businessInfo.website,
                phone: data.businessInfo.phone,
                businessType: data.businessInfo.category,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                workingHours: mapHoursToPayload(data.hours),
                services: data.services.map((s, i) => ({
                    ...s,
                    id: `svc_${i}`,
                    duration: s.duration || 30,
                    price: s.price || 0
                })),
                faqs: data.faqs
                    .filter(f => !f.askDuringCall)
                    .map(f => ({ question: f.question, answer: f.answer }))
            };

            const dbResult = await submitOnboardingAction(onboardingPayload);
            if (!dbResult.success) throw new Error(dbResult.error);

            toast.success("Setup complete!");
            // Move to "Finish" step to show success message
            setCurrentStep(STEPS.length - 1);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    const mapHoursToPayload = (uiHours: WorkingHours) => {
        const payload: any = {};
        Object.entries(uiHours).forEach(([day, schedule]) => {
            payload[day] = {
                isOpen: schedule.isOpen,
                openTime: schedule.open,
                closeTime: schedule.close
            };
        });
        return payload;
    };

    const totalSteps = STEPS.length + 1; // +1 for the search step
    const currentGlobalStep = currentStep + 2; // +1 for 1-based, +1 for search step
    const progressValue = (currentGlobalStep / totalSteps) * 100;

    // Render Steps
    const renderStepContent = () => {
        switch (STEPS[currentStep].id) {
            case "intro":
                return (
                    <div className="text-center space-y-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                            <Check className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">We've prefilled your profile</h1>
                        <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            We found your business on Google and your website. Just verify the details and we're good to go.
                        </p>
                    </div>
                );

            case "info":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2 border-b pb-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Business Information</h2>
                            <p className="text-base text-muted-foreground">Review the details we found from your online presence.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm">Business Name</Label>
                                <div className="relative">
                                    <Input value={data.businessInfo.name || ""} disabled className={cn("bg-muted/30 border-muted", INPUT_HEIGHT)} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/50 text-xs font-medium text-muted-foreground border shadow-sm">
                                        <MapPin className="w-3 h-3" /> Google
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm">Category</Label>
                                <div className="relative">
                                    <Input value={data.businessInfo.category || ""} disabled className={cn("bg-muted/30 border-muted", INPUT_HEIGHT)} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/50 text-xs font-medium text-muted-foreground border shadow-sm">
                                        <Globe className="w-3 h-3" /> Google
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm">Phone</Label>
                                <div className="relative">
                                    <Input value={data.businessInfo.phone || ""} onChange={e => updateBusinessInfo("phone", e.target.value)} className={INPUT_HEIGHT} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-xs font-medium text-blue-600 border border-blue-100 shadow-sm">
                                        <Phone className="w-3 h-3" /> Google
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm">Address</Label>
                                <div className="relative">
                                    <Input value={data.businessInfo.address || ""} onChange={e => updateBusinessInfo("address", e.target.value)} className={INPUT_HEIGHT} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-xs font-medium text-blue-600 border border-blue-100 shadow-sm">
                                        <MapPin className="w-3 h-3" /> Google
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm">Website</Label>
                                <div className="relative">
                                    <Input value={data.businessInfo.website || ""} onChange={e => updateBusinessInfo("website", e.target.value)} className={INPUT_HEIGHT} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-xs font-medium text-blue-600 border border-blue-100 shadow-sm">
                                        <Globe className="w-3 h-3" /> Google
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm">Email</Label>
                                <div className="relative">
                                    <Input value={data.businessInfo.email || ""} onChange={e => updateBusinessInfo("email", e.target.value)} className={INPUT_HEIGHT} />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-50 text-xs font-medium text-orange-600 border border-orange-100 shadow-sm">
                                        <Mail className="w-3 h-3" /> Website
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm">Description</Label>
                                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100 flex items-center gap-1">
                                        ✨ AI-Generated
                                    </span>
                                </div>
                                <Textarea className="min-h-[120px] text-lg leading-relaxed p-4" value={data.businessInfo.description || ""} onChange={e => updateBusinessInfo("description", e.target.value)} />
                            </div>
                        </div>
                    </div>
                );

            case "hours":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2 border-b pb-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Business Hours</h2>
                            <p className="text-base text-muted-foreground">When are you open for customers?</p>
                        </div>

                        {!isHoursEditing ? (
                            <div className="border border-muted/40 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center space-y-6 text-center bg-muted/5 shadow-inner">
                                <h3 className="text-xl font-medium tracking-tight">Are these your business hours?</h3>

                                <div className="px-6 md:px-8 py-4 md:py-6 bg-white dark:bg-card border rounded-2xl shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-2 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                        <span>Mon–Sat</span>
                                        <span className="hidden md:inline"> · </span>
                                        <span className="text-2xl md:text-4xl">{data.hours["monday"]?.open || "09:00"} – {data.hours["monday"]?.close || "17:00"}</span>
                                    </div>
                                </div>

                                <p className="text-base text-muted-foreground max-w-sm">
                                    We'll use this detailed schedule for booking appointments.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                    {dayOrder.map((day, index) => {
                                        const dayData = data.hours[day] || { isOpen: false, open: "09:00", close: "17:00" };
                                        return (
                                            <div key={day} className={`flex items-center justify-between p-4 ${index !== dayOrder.length - 1 ? 'border-b' : ''} hover:bg-muted/5 transition-colors`}>
                                                <div className="flex items-center space-x-6 w-40">
                                                    <Switch checked={dayData.isOpen} onCheckedChange={(c) => updateHours(day, "isOpen", c)} />
                                                    <span className="capitalize font-medium text-lg">{day}</span>
                                                </div>
                                                {dayData.isOpen ? (
                                                    <div className="flex items-center space-x-3">
                                                        <Input type="time" className={cn("w-36 text-center", INPUT_HEIGHT)} value={dayData.open} onChange={e => updateHours(day, "open", e.target.value)} />
                                                        <span className="text-muted-foreground font-medium">to</span>
                                                        <Input type="time" className={cn("w-36 text-center", INPUT_HEIGHT)} value={dayData.close} onChange={e => updateHours(day, "close", e.target.value)} />
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic flex-1 text-center bg-muted/20 py-2 rounded-md mx-4">Closed</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "services":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2 border-b pb-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
                            <p className="text-base text-muted-foreground">Verify your services. Price and duration are optional.</p>
                        </div>
                        <div className="space-y-6">
                            {data.services.map((service, idx) => (
                                <div key={idx} className="flex gap-6 items-start border p-6 rounded-xl relative group bg-card hover:shadow-md transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
                                        <div className="md:col-span-2 space-y-3">
                                            <Label className="text-sm">Service Name</Label>
                                            <Input className={cn("border-muted", INPUT_HEIGHT)} value={service.name} onChange={e => updateService(idx, "name", e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm">Price <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span></Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input type="number" className={cn("pl-9 border-muted", INPUT_HEIGHT)} placeholder="Ask client" value={service.price || ""} onChange={e => updateService(idx, "price", parseFloat(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm">Duration <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span></Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input type="number" className={cn("pl-9 border-muted", INPUT_HEIGHT)} placeholder="Variable" value={service.duration || ""} onChange={e => updateService(idx, "duration", parseFloat(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 space-y-3">
                                            <Label className="text-sm">Description</Label>
                                            <Input className={cn("border-muted", INPUT_HEIGHT)} value={service.description} onChange={e => updateService(idx, "description", e.target.value)} />
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive h-10 w-10 bg-destructive/5 hover:bg-destructive/10" onClick={() => removeService(idx)}>
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size={BUTTON_SIZE} onClick={addService} className="w-full border-dashed hover:bg-muted/50">
                                <Plus className="mr-2 h-5 w-5" /> Add Service
                            </Button>
                        </div>
                    </div>
                );

            case "faqs":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2 border-b pb-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                            <p className="text-base text-muted-foreground">Review answers or defer them to your onboarding call.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.faqs.map((faq, idx) => (
                                <div key={idx} className={`border p-6 rounded-xl space-y-4 relative transition-all duration-300 ${faq.askDuringCall ? "opacity-70 bg-muted/30 border-dashed" : "bg-card shadow-sm hover:shadow-md"}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-2 flex-1">
                                            <Label className="text-sm font-medium leading-normal">Q: {faq.question}</Label>
                                            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 inline-flex items-center gap-1 w-auto">
                                                ✨ Suggested by AI
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 hover:bg-destructive/10 -mt-1 -mr-2" onClick={() => removeFAQ(idx)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {!faq.askDuringCall && (
                                        <div className="space-y-2 pt-2">
                                            <Label className="text-sm font-medium text-muted-foreground">Answer</Label>
                                            <Textarea className="min-h-[100px] resize-none" value={faq.answer} onChange={e => updateFAQ(idx, "answer", e.target.value)} />
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3 pt-4 border-t mt-2">
                                        <Checkbox
                                            id={`defer-${idx}`}
                                            checked={faq.askDuringCall}
                                            onCheckedChange={(c) => updateFAQ(idx, "askDuringCall", c)}
                                            className="h-5 w-5"
                                        />
                                        <Label htmlFor={`defer-${idx}`} className="text-sm cursor-pointer font-medium text-muted-foreground hover:text-foreground transition-colors">
                                            Ask me this during onboarding call
                                        </Label>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addFAQ} className="w-full border-dashed h-full min-h-[200px] flex flex-col gap-4 hover:bg-muted/50">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <span className="font-medium text-lg">Add Custom Question</span>
                            </Button>
                        </div>
                    </div>
                );

            case "finish":
                return (
                    <div className="text-center space-y-8 py-16 animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50 dark:ring-green-900/10">
                            <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Your AI Agent is Ready!</h1>
                        <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            We've saved your profile. We'll confirm any remaining details (like specific FAQs) during your onboarding call.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <BrandedBackground>
            <div className="w-full max-w-6xl px-3 md:px-4 flex flex-col flex-1 min-h-0 overflow-hidden max-h-[calc(100vh-5rem)]">
                {/* Upper Progress Bar Section */}
                <div className="mb-8 space-y-3 w-full max-w-[80%] mx-auto shrink-0">
                    <div className="flex justify-between text-sm font-medium" style={{ color: 'var(--auth-text-secondary)' }}>
                        <span>Step {currentGlobalStep} of {totalSteps}</span>
                        <span>{Math.round(progressValue)}% Completed</span>
                    </div>
                    <Progress value={progressValue} className="h-2.5" />
                </div>

                <BrandedCard className="flex-1 flex flex-col min-h-0 min-h-[450px] overflow-hidden">
                    <div className="flex-1 pt-6 px-4 md:px-6 pb-8 overflow-hidden flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {renderStepContent()}
                        </div>
                    </div>

                    <div className="border-t p-4 md:p-6 shrink-0" style={{ borderColor: 'var(--auth-card-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        {/* Mobile: Stack buttons vertically, Desktop: Side by side */}
                        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
                            {/* Left Button (Back) - appears at bottom on mobile */}
                            <div className="w-full md:w-auto">
                                {currentStep > 0 && currentStep < STEPS.length - 1 && (
                                    <Button variant="outline" onClick={handleBack} disabled={loading} size={BUTTON_SIZE} className="w-full md:w-auto md:min-w-[100px]">
                                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                                    </Button>
                                )}
                            </div>

                            {/* Right Button (Next/Finish) - appears at top on mobile */}
                            <div className="flex flex-col gap-3 md:flex-row w-full md:w-auto">
                                {currentStep === 0 && (
                                    <Button size={BUTTON_SIZE} onClick={handleNext} className="w-full md:min-w-[140px]">
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                                
                                {/* Business Hours step - special handling for Edit Hours and Yes, Correct buttons */}
                                {STEPS[currentStep].id === "hours" && !isHoursEditing && (
                                    <>
                                        <Button onClick={handleNext} disabled={loading} size={BUTTON_SIZE} className="w-full md:w-auto md:min-w-[140px] order-first md:order-last">
                                            <Check className="w-4 h-4 mr-2" />
                                            Yes, Correct
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsHoursEditing(true)} disabled={loading} size={BUTTON_SIZE} className="w-full md:w-auto md:min-w-[140px]">
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Hours
                                        </Button>
                                    </>
                                )}
                                
                                {STEPS[currentStep].id === "hours" && isHoursEditing && (
                                    <Button onClick={() => setIsHoursEditing(false)} disabled={loading} size={BUTTON_SIZE} className="w-full md:min-w-[140px]">
                                        Done Editing
                                    </Button>
                                )}

                                {/* Other steps */}
                                {currentStep > 0 && currentStep < STEPS.length - 2 && STEPS[currentStep].id !== "hours" && (
                                    <Button onClick={handleNext} disabled={loading} size={BUTTON_SIZE} className="w-full md:min-w-[140px]">
                                        Next <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}

                                {currentStep === STEPS.length - 2 && (
                                    <Button onClick={handleSubmit} disabled={loading} size={BUTTON_SIZE} className="w-full md:min-w-[140px]">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Finish & Save
                                    </Button>
                                )}

                                {currentStep === STEPS.length - 1 && (
                                    <Button onClick={() => router.push("/dashboard")} size={BUTTON_SIZE} className="w-full md:min-w-[160px] bg-green-600 hover:bg-green-700 text-white">
                                        Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </BrandedCard>
            </div>
        </BrandedBackground>
    );
}
