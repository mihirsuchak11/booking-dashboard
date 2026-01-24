"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessConfig, Business, RegionCode, REGIONS } from "@/types/database";
import { updateBusinessConfigAction } from "@/app/settings/actions";
import { Plus, Trash2, Clock, Loader2, Save, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, getCurrencySymbol } from "@/lib/region-utils";

interface ServicesTabProps {
  businessId: string;
  config: BusinessConfig | null;
  business?: Business | null;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "240", label: "4 hours" },
];

export function ServicesTab({ businessId, config, business }: ServicesTabProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get region for currency formatting
  const region: RegionCode = (business?.region as RegionCode) || "US";
  const currencySymbol = getCurrencySymbol(region);

  // Parse services from config or use empty array
  const initialServices: Service[] =
    config?.working_hours?.services && Array.isArray(config.working_hours.services)
      ? config.working_hours.services
      : [];

  const [services, setServices] = useState<Service[]>(initialServices);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    duration: 30,
    price: 0,
    description: "",
  });

  const handleAddService = () => {
    if (!newService.name) return;

    const service: Service = {
      id: crypto.randomUUID(),
      name: newService.name!,
      duration: Number(newService.duration) || 30,
      price: Number(newService.price) || 0,
      description: newService.description || "",
    };

    setServices([...services, service]);
    setIsAdding(false);
    setNewService({
      name: "",
      duration: 30,
      price: 0,
      description: "",
    });
  };

  const handleUpdateService = () => {
    if (!editingId || !newService.name) return;

    setServices(
      services.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: newService.name!,
              duration: Number(newService.duration) || 30,
              price: Number(newService.price) || 0,
              description: newService.description || "",
            }
          : s
      )
    );
    setEditingId(null);
    setNewService({
      name: "",
      duration: 30,
      price: 0,
      description: "",
    });
  };

  const handleEditService = (service: Service) => {
    setEditingId(service.id);
    setNewService({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description,
    });
    setIsAdding(false);
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Get existing working_hours and merge with services
      const existingWorkingHours = config?.working_hours || {};
      
      const result = await updateBusinessConfigAction(businessId, {
        working_hours: {
          ...existingWorkingHours,
          services: services,
        },
      });

      if (!result.success) {
        setError(result.error || "Failed to save services");
        setSaving(false);
        return;
      }

      toast.success("Services updated", {
        description: "Your services and packages were saved successfully.",
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
      <div className="rounded-3xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Services & Packages</h2>
            <p className="text-sm text-muted-foreground">
              Manage the services you offer to customers
            </p>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 bg-background flex items-center justify-between group ${
                editingId === service.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="space-y-1">
                <h3 className="font-medium">{service.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {service.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    {formatCurrency(service.price, region)}
                  </span>
                </div>
                {service.description && (
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditService(service)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveService(service.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {services.length === 0 && !isAdding && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
              <p>No services added yet.</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setIsAdding(true)}
              >
                Add your first service
              </Button>
            </div>
          )}
        </div>

        {/* Add/Edit Form */}
        {isEditing && (
          <div className="mt-4 border rounded-lg p-4 space-y-4 bg-muted/30">
            <h4 className="font-medium">
              {editingId ? "Edit Service" : "Add New Service"}
            </h4>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Service Name</label>
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
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
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
                  <label className="text-sm font-medium text-muted-foreground">Price ({currencySymbol})</label>
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
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Description (Optional)</label>
                <Input
                  placeholder="Brief details about this service..."
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({ ...newService, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdateService : handleAddService}
                disabled={!newService.name}
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
                  setNewService({
                    name: "",
                    duration: 30,
                    price: 0,
                    description: "",
                  });
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

      <div className="flex justify-end">
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
      </div>
    </div>
  );
}
