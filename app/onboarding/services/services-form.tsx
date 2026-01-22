"use client";

import { useState } from "react";
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
        <div className="w-full max-w-lg mx-auto space-y-8">

            {/* Header */}
            <div className="space-y-2">
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

            <div className="space-y-6">
                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`border rounded-lg p-4 bg-card flex items-center justify-between group transition-colors ${editingId === service.id ? "border-primary ring-1 ring-primary" : ""}`}
                        >
                            <div className="space-y-1">
                                <h3 className="font-medium">{service.name}</h3>
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
                        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                            No services added yet.
                        </div>
                    )}
                </div>

                {isAdding || services.length === 0 ? (
                    <div className="border rounded-lg p-6 space-y-6 bg-muted/30">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Service Name</label>
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
                                    <label className="text-sm font-medium">Duration</label>
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
                                    <label className="text-sm font-medium">Price ({currencySymbol})</label>
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
                                <label className="text-sm font-medium">Description (Optional)</label>
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
                ) : (
                    <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => { resetForm(); setIsAdding(true); }}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Another Service
                    </Button>
                )}

                <div className="pt-4">
                    {!isAdding && services.length > 0 && (
                        <Button onClick={handleContinue} className="w-full">
                            Continue <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                    {/* If adding or empty, we generally block continue, or user must cancel add first */}
                    {isAdding && services.length > 0 && (
                        <Button disabled className="w-full">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                    )}
                    {services.length === 0 && !isAdding && (
                        <Button disabled className="w-full">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
                    )}
                </div>
            </div>
        </div>
    );
}
