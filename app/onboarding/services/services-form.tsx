"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding, Service } from "@/contexts/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Clock, ChevronLeft, ArrowRight, Edit2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatCurrency, getCurrencySymbol } from "@/lib/region-utils";
import { BUTTON_SIZE } from "@/lib/ui-constants";

const DURATION_OPTIONS = [
    { value: "15", label: "15 min" },
    { value: "30", label: "30 min" },
    { value: "45", label: "45 min" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
];

export function ServicesForm() {
    const router = useRouter();
    const { state, addService, removeService, updateService } = useOnboarding();
    const { services, businessInfo } = state;

    // Get currency symbol based on selected region
    const currencySymbol = getCurrencySymbol(businessInfo.region);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newService, setNewService] = useState<Partial<Service>>({
        name: "",
        duration: 30,
        price: 0,
        description: "",
    });

    // Ref for the form container to scroll into view
    const formRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to form when editing starts
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
    }, [isAdding, editingId]);

    const handleSaveService = () => {
        if (!newService.name) return;

        if (editingId) {
            // Update existing
            updateService(editingId, {
                name: newService.name,
                duration: Number(newService.duration) || 30,
                price: Number(newService.price) || 0,
                description: newService.description || "",
            });
        } else {
            // Add new
            addService({
                id: crypto.randomUUID(),
                name: newService.name!,
                duration: Number(newService.duration) || 30,
                price: Number(newService.price) || 0,
                description: newService.description || "",
            });
        }

        resetForm();
    };

    const handleEditService = (service: Service) => {
        setNewService({
            name: service.name,
            duration: service.duration,
            price: service.price,
            description: service.description,
        });
        setEditingId(service.id);
        setIsAdding(true);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewService({
            name: "",
            duration: 30,
            price: 0,
            description: "",
        });
    };

    const handleBack = () => {
        router.back();
    }

    const handleContinue = () => {
        router.push("/onboarding/faqs");
    }

    return (
        <div className="w-full flex flex-col h-full max-h-[calc(100dvh-11rem)] md:max-h-[calc(100vh-14rem)]">

            {/* Header */}
            <div className="space-y-2 flex-shrink-0 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 -ml-2" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">Step 2/4</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Services & Packages
                </h1>
                <p className="text-sm text-muted-foreground">
                    What services do you offer? Add at least one to continue.
                </p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-2 -mr-2">
                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`border border-border/50 rounded-lg p-4 bg-card/50 backdrop-blur-sm flex items-center justify-between group transition-colors ${editingId === service.id ? "border-primary ring-1 ring-primary" : ""}`}
                        >
                            <div className="space-y-1">
                                <h3 className="font-medium text-foreground">{service.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {service.duration} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {formatCurrency(service.price, businessInfo.region)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditService(service)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeService(service.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {services.length === 0 && !isAdding && (
                        <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-lg text-muted-foreground">
                            No services added yet.
                        </div>
                    )}
                </div>

                {(isAdding || services.length === 0) && (
                    <div 
                        ref={formRef}
                        className="border border-border/50 rounded-lg p-6 space-y-6 bg-card/30 backdrop-blur-sm"
                    >
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-foreground">Service Name</label>
                                <Input
                                    placeholder="e.g. Initial Consultation"
                                    value={newService.name}
                                    onChange={(e) =>
                                        setNewService({ ...newService, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-foreground">Duration</label>
                                    <Select
                                        value={String(newService.duration)}
                                        onValueChange={(val) =>
                                            setNewService({ ...newService, duration: Number(val) })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DURATION_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-foreground">Price ({currencySymbol})</label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-2.5 text-sm text-muted-foreground">
                                            {currencySymbol}
                                        </span>
                                        <Input
                                            type="number"
                                            className="pl-7"
                                            placeholder="0.00"
                                            value={newService.price}
                                            onChange={(e) =>
                                                setNewService({
                                                    ...newService,
                                                    price: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-foreground">Description (Optional)</label>
                                <Input
                                    placeholder="Brief details about this service..."
                                    value={newService.description}
                                    onChange={(e) =>
                                        setNewService({ ...newService, description: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button onClick={handleSaveService} disabled={!newService.name} className="flex-1">
                                {editingId ? "Update Service" : (services.length === 0 ? "Add First Service" : "Save Service")}
                            </Button>
                            {services.length > 0 && (
                                <Button variant="ghost" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="pt-4 flex-shrink-0 border-t border-border/50 mt-4 space-y-3">
                {!isAdding && services.length > 0 && (
                    <Button
                        variant="outline"
                        className="w-full border-dashed text-foreground"
                        onClick={() => { resetForm(); setIsAdding(true); }}
                        size={BUTTON_SIZE}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Another Service
                    </Button>
                )}
                {!isAdding && services.length > 0 && (
                    <Button onClick={handleContinue} className="w-full" size={BUTTON_SIZE}>
                        Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
                {/* If adding or empty, we generally block continue, or user must cancel add first */}
                {isAdding && services.length > 0 && (
                    <Button disabled className="w-full" size={BUTTON_SIZE}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                )}
                {services.length === 0 && !isAdding && (
                    <Button disabled className="w-full" size={BUTTON_SIZE}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                )}
            </div>
        </div>
    );
}
