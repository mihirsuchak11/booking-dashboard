"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Building2, PenLine } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "./business-card";
import { BusinessSearchResult } from "../actions";

interface BusinessSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    businesses: BusinessSearchResult[];
    searchTerm: string;
    isLoading?: boolean;
    onSelect: (business: BusinessSearchResult) => void;
    onManualEntry: () => void;
}

// ============================================================
// Confirm Button with useFormStatus (for future form integration)
// ============================================================
function ConfirmButton({
    selectedBusiness,
    onClick,
}: {
    selectedBusiness: BusinessSearchResult | null;
    onClick: () => void;
}) {
    const { pending } = useFormStatus();

    return (
        <Button
            onClick={onClick}
            disabled={!selectedBusiness || pending}
            className="w-full"
            size="lg"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : selectedBusiness ? (
                <>Select {selectedBusiness.name.length > 25 ? selectedBusiness.name.slice(0, 25) + "..." : selectedBusiness.name}</>
            ) : (
                "Select a business to continue"
            )}
        </Button>
    );
}

// ============================================================
// Main Dialog Component
// ============================================================
export function BusinessSelectionDialog({
    open,
    onOpenChange,
    businesses,
    searchTerm,
    isLoading = false,
    onSelect,
    onManualEntry,
}: BusinessSelectionDialogProps) {
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessSearchResult | null>(null);

    const handleSelect = (business: BusinessSearchResult) => {
        setSelectedBusiness(business);
    };

    const handleConfirm = () => {
        if (selectedBusiness) {
            onSelect(selectedBusiness);
            setSelectedBusiness(null); // Reset for next time
        }
    };

    const handleManualEntry = () => {
        setSelectedBusiness(null);
        onManualEntry();
    };

    // Reset selection when dialog closes
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedBusiness(null);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Select Your Business
                    </DialogTitle>
                    <DialogDescription>
                        We found these businesses matching "{searchTerm}". Select yours to continue.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                        </div>
                        <p className="text-muted-foreground text-sm">Searching for businesses...</p>
                    </div>
                ) : businesses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">No businesses found</p>
                            <p className="text-sm text-muted-foreground">
                                We couldn't find any businesses matching your search.
                            </p>
                        </div>
                        <Button onClick={handleManualEntry} variant="outline">
                            <PenLine className="w-4 h-4 mr-2" />
                            Enter Details Manually
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Business Cards - Scrollable */}
                        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                            {businesses.map((business) => (
                                <BusinessCard
                                    key={business.id}
                                    business={business}
                                    isSelected={selectedBusiness?.id === business.id}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </div>

                        {/* Actions - Fixed at bottom */}
                        <div className="flex flex-col gap-3 pt-4 mt-4 border-t sticky bottom-0 bg-background">
                            <ConfirmButton
                                selectedBusiness={selectedBusiness}
                                onClick={handleConfirm}
                            />

                            <Button
                                onClick={handleManualEntry}
                                variant="ghost"
                                className="w-full text-muted-foreground hover:text-foreground"
                            >
                                <PenLine className="w-4 h-4 mr-2" />
                                My business isn't listed — enter manually
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
