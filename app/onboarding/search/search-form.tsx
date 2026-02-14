"use client";

import { useActionState, useEffect, useState, startTransition, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight, MapPin, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/contexts/onboarding-context";
import { INPUT_HEIGHT, BUTTON_SIZE } from "@/lib/ui-constants";
import { cn, generateUUID } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RegionCode } from "@/types/database";
import { BusinessSelectionDialog } from "./business-selection-dialog";
import { getRegionFromTimezone } from "@/lib/region-utils";
import {
    findBusinessesAction,
    selectAndGenerateAction,
    BusinessSearchResult,
    SearchFormState,
    GenerateFormState,
} from "../actions";

// Only US and India allowed
const REGION_OPTIONS: { value: RegionCode; label: string; flag: string }[] = [
    { value: "US", label: "United States", flag: "🇺🇸" },
    { value: "IN", label: "India", flag: "🇮🇳" },
];

// ============================================================
// Submit Button with useFormStatus
// ============================================================
function SearchSubmitButton({ isSearching }: { isSearching: boolean }) {
    const { pending } = useFormStatus();
    const showLoading = pending || isSearching;

    return (
        <Button type="submit" disabled={showLoading} className="w-full" size={BUTTON_SIZE}>
            {showLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                </>
            ) : (
                <>
                    Find Business <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

// ============================================================
// Get initial region from timezone (runs only on client)
// ============================================================
function getInitialRegion(): RegionCode {
    if (typeof window === "undefined") return "US";

    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return getRegionFromTimezone(timezone);
    } catch {
        return "US";
    }
}

// ============================================================
// Main Search Form Component
// ============================================================
export function SearchForm() {
    const router = useRouter();
    const { state, setAllData } = useOnboarding();

    // Dialog state
    const [showSelectionDialog, setShowSelectionDialog] = useState(false);

    // Track if component has mounted (for hydration)
    const [mounted, setMounted] = useState(false);

    // Region state
    const [region, setRegion] = useState<RegionCode>(() => {
        if (state.businessInfo.region) return state.businessInfo.region;
        return getInitialRegion();
    });

    // City/Location state
    const [location, setLocation] = useState("");
    const [isLocating, setIsLocating] = useState(false);

    // Business name state (controlled for proper context sync)
    const [businessName, setBusinessName] = useState("");

    // Generation progress state
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");

    // Ref to prevent duplicate processing of generation success
    const generationProcessedRef = useRef(false);

    // React 19 useActionState for search
    const [searchState, searchAction, isSearchPending] = useActionState<SearchFormState, FormData>(
        findBusinessesAction,
        null
    );

    // React 19 useActionState for profile generation
    const [generateState, generateAction, isGeneratePending] = useActionState<GenerateFormState, FormData>(
        selectAndGenerateAction,
        null
    );

    // Mark as mounted for hydration
    useEffect(() => {
        setMounted(true);
        if (!state.businessInfo.region) {
            setRegion(getInitialRegion());
        }
    }, []);

    // Pre-fill from context - ONLY on initial mount for businessName
    // Region can update dynamically, but businessName should only load once
    useEffect(() => {
        if (state.businessInfo.region) {
            setRegion(state.businessInfo.region);
        }
    }, [state.businessInfo.region]);

    // Only pre-fill businessName and location on FIRST mount
    useEffect(() => {
        // Only sync from context if user hasn't typed anything yet
        if (state.businessInfo.name && !businessName) {
            setBusinessName(state.businessInfo.name);
        }
        if (state.businessInfo.address && !location) {
            const parts = state.businessInfo.address.split(",");
            if (parts.length >= 2) {
                setLocation(parts[parts.length - 2].trim());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search success - open dialog
    useEffect(() => {
        if (searchState?.success && searchState.businesses.length > 0) {
            setShowSelectionDialog(true);
        } else if (searchState?.error && !searchState.success) {
            toast.error(searchState.error);
            if (searchState.businesses.length === 0) {
                setShowSelectionDialog(true);
            }
        }
    }, [searchState]);

    // Handle generation success
    useEffect(() => {
        // Guard: Prevent re-processing if already handled
        if (generationProcessedRef.current) return;

        if (generateState?.success && generateState.data) {
            generationProcessedRef.current = true; // Mark as processed
            setStatus("Finalizing profile...");
            setProgress(90);

            const data = generateState.data;
            // Prefer current dropdown region so selected region is always what user sees and gets saved to DB
            const currentRegion = region || searchState?.region;

            setAllData({
                businessInfo: {
                    name: data.businessInfo.name || searchState?.searchTerm || "",
                    description: data.businessInfo.description || "",
                    phone: data.businessInfo.phone || "",
                    email: data.businessInfo.email || "",
                    website: data.businessInfo.website || "",
                    address: data.businessInfo.address || "",
                    type: "other",
                    customBusinessType: data.businessInfo.category || "General Business",
                    operatingHours: Object.entries(data.hours).map(([day, times]) => ({
                        day,
                        isOpen: times.isOpen,
                        openTime: times.open,
                        closeTime: times.close,
                    })),
                    timezone: "UTC",
                    region: currentRegion,
                    currency: currentRegion === "US" ? "USD" : "INR",
                    locale: currentRegion === "US" ? "en-US" : "en-IN",
                    bufferTime: 15,
                    advanceBookingDays: 30,
                },
                services: data.services.map((s) => ({
                    ...s,
                    id: generateUUID()
                })),
                faqs: data.faqs
            });

            setTimeout(() => {
                router.push("/onboarding/services");
            }, 800);
        } else if (generateState?.error) {
            toast.error(generateState.error);
            setIsGenerating(false);
            generationProcessedRef.current = false; // Allow retry on error
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generateState]);

    // Get current location using browser GPS
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Reverse geocode to get city name
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                    );
                    const data = await response.json();

                    // Extract city/town/village from response
                    const city = data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.suburb ||
                        data.address?.county ||
                        "";

                    const state = data.address?.state || "";

                    if (city) {
                        setLocation(state ? `${city}, ${state}` : city);
                        toast.success(`Location detected: ${city}`);
                    } else {
                        toast.error("Could not determine your city");
                    }
                } catch (error) {
                    console.error("Geocoding error:", error);
                    toast.error("Failed to get location name");
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                setIsLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Location access denied. Please enter your city manually.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Location unavailable. Please enter your city manually.");
                        break;
                    case error.TIMEOUT:
                        toast.error("Location request timed out. Please try again.");
                        break;
                    default:
                        toast.error("Failed to get location. Please enter manually.");
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
    };

    // Handle business selection
    const handleBusinessSelect = (business: BusinessSearchResult) => {
        setShowSelectionDialog(false);
        setIsGenerating(true);
        setStatus("Analyzing business details...");
        setProgress(40);
        generationProcessedRef.current = false; // Reset for new generation

        const formData = new FormData();
        formData.set("businessData", JSON.stringify(business));
        startTransition(() => {
            generateAction(formData);
        });
    };

    // Handle manual entry - skip AI generation, just use what user typed
    const handleManualEntry = () => {
        setShowSelectionDialog(false);

        // Save only the name and location user typed - clear old services/faqs
        setAllData({
            businessInfo: {
                ...state.businessInfo,
                name: businessName || "",
                address: location || "",
                region: region,
                currency: region === "US" ? "USD" : "INR",
                locale: region === "US" ? "en-US" : "en-IN",
            },
            services: [], // Clear old services
            faqs: [], // Clear old FAQs
        });

        // Go directly to services step - user will fill everything manually
        router.push("/onboarding/services");
    };

    // Generating state UI
    if (isGenerating || isGeneratePending) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-bold text-foreground">Setting up {businessName || searchState?.searchTerm || "your business"}</h2>
                    <p className="text-muted-foreground">{status}</p>
                </div>

                <div className="relative flex justify-center py-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
                    </div>
                </div>

                <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-2" />
                </div>
            </div>
        );
    }

    return (
        <>
            <form action={searchAction} className="w-full max-w-sm mx-auto space-y-8">
                {/* Form Fields */}
                <div className="space-y-5">

                    {/* Region Select */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Region</Label>
                        <Select
                            value={region}
                            onValueChange={(val: RegionCode) => setRegion(val)}
                        >
                            <SelectTrigger className={cn(`!${INPUT_HEIGHT}`, "[&>svg]:text-muted-foreground")}>
                                {mounted ? (
                                    <span className="flex items-center">
                                        <span className="text-lg mr-2">{REGION_OPTIONS.find(o => o.value === region)?.flag}</span>
                                        {REGION_OPTIONS.find(o => o.value === region)?.label}
                                    </span>
                                ) : (
                                    <SelectValue placeholder="Loading..." />
                                )}
                            </SelectTrigger>
                            <SelectContent>
                                {REGION_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <span className="flex items-center">
                                            <span className="text-lg mr-2">{option.flag}</span>
                                            {option.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="region" value={region} />
                    </div>

                    {/* City/Location Input */}
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">City / Location</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="e.g. Ahmedabad, Gujarat"
                                    className={cn(INPUT_HEIGHT, "pl-10")}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-lg"
                                onClick={handleGetLocation}
                                disabled={isLocating}
                                title="Use my location"
                            >
                                {isLocating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <LocateFixed className="h-4 w-4 text-foreground" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Adding your city helps find the exact business
                        </p>
                    </div>

                    {/* Business Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="businessName"
                                name="businessName"
                                placeholder="e.g. Kohinoor Photography"
                                className={cn(INPUT_HEIGHT, "pl-10")}
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <SearchSubmitButton isSearching={isSearchPending} />
                </div>
            </form>

            {/* Business Selection Modal */}
            <BusinessSelectionDialog
                open={showSelectionDialog}
                onOpenChange={setShowSelectionDialog}
                businesses={searchState?.businesses || []}
                searchTerm={searchState?.searchTerm || ""}
                isLoading={isSearchPending}
                onSelect={handleBusinessSelect}
                onManualEntry={handleManualEntry}
            />
        </>
    );
}
