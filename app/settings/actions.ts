"use server";

import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import {
  updateBusiness,
  updateBusinessConfig,
  deleteBusiness,
} from "@/lib/dashboard-data";
import { revalidatePath } from "next/cache";

export async function updateBusinessAction(data: {
  name?: string;
  timezone?: string;
  default_phone_number?: string | null;
  website?: string | null;
  address?: string | null;
}) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const businessId = await getBusinessIdForUser(userId);

  if (!businessId) {
    return { success: false, error: "No business found" };
  }

  const result = await updateBusiness(businessId, data);

  if (result.success) {
    revalidatePath("/settings");
  }

  return result;
}

export async function updateBusinessConfigAction(
  businessId: string,
  data: {
    greeting?: string | null;
    notes_for_ai?: string | null;
    working_hours?: Record<string, unknown>;
    services?: unknown[];
    faqs?: unknown[]; // business_configs.faqs column
    min_notice_hours?: number;
  }
) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify the user owns this business
  const userBusinessId = await getBusinessIdForUser(userId);

  if (!userBusinessId || userBusinessId !== businessId) {
    return { success: false, error: "Unauthorized to update this business" };
  }

  const result = await updateBusinessConfig(businessId, data);

  if (result.success) {
    revalidatePath("/settings");
  }

  return result;
}

export async function deleteBusinessAction() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const businessId = await getBusinessIdForUser(userId);

  if (!businessId) {
    return { success: false, error: "No business found" };
  }

  return await deleteBusiness(businessId);
}

