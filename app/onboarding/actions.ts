"use server";

import { getAuthenticatedUserId } from "@/lib/auth-session";
import { getBusinessIdForUser } from "@/lib/business-auth";
import {
  createBusiness,
  updateBusiness,
  updateBusinessConfig,
} from "@/lib/dashboard-data";
import { revalidatePath } from "next/cache";
import { RegionCode, REGIONS } from "@/types/database";
import { sendWelcomeEmail } from "@/lib/email";

interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface OnboardingData {
  // Business info (stored in businesses table)
  name: string;
  timezone: string;
  phone?: string;

  // Region settings
  region?: RegionCode;
  currency?: string;
  locale?: string;

  // Extended business info (stored in business_configs.working_hours)
  description?: string;
  email?: string;
  website?: string;
  businessType?: string;
  customBusinessType?: string;
  address?: string;

  // Operating hours (stored in business_configs.working_hours)
  workingHours?: Record<
    string,
    { isOpen: boolean; openTime: string; closeTime: string }
  >;

  // Booking settings
  bufferTime?: number;
  advanceBookingDays?: number;
  minNoticeHours?: number;

  // Services (stored in business_configs.working_hours.services)
  services?: ServiceData[];

  // FAQs (to be saved to knowledge_chunks)
  faqs?: { question: string; answer: string }[];
}

/**
 * Initializes the business record immediately when onboarding starts.
 * Ensures we have a valid Business ID to attach everything to.
 */
export async function startOnboardingAction(businessName: string): Promise<{ success: boolean; businessId?: string; error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    // Dev bypass handling should be consistent if needed, 
    // but for now let's assume valid session or handle in component
    console.warn("[Onboarding] No user ID found for startOnboarding");
    return { success: false, error: "Unauthorized" };
  }

  // Check if business exists
  const existingBusinessId = await getBusinessIdForUser(userId);
  if (existingBusinessId) {
    console.log(`[Onboarding] Resuming existing business: ${existingBusinessId}`);
    return { success: true, businessId: existingBusinessId };
  }

  console.log(`[Onboarding] Initializing NEW business: ${businessName}`);
  const result = await createBusiness(userId, {
    name: businessName,
    timezone: "UTC", // Default, will update later
    status: "onboarding"
  });

  return result;
}

export async function submitOnboardingAction(data: OnboardingData): Promise<{
  success: boolean;
  error?: string;
}> {
  let userId = await getAuthenticatedUserId();

  if (!userId) {
    console.error("[Onboarding] No user ID found for save");
    return { success: false, error: "Unauthorized" };
  }

  console.log(`[Onboarding] Starting save for user: ${userId}`);
  console.log(`[Onboarding] Received Data:`, JSON.stringify(data, null, 2));

  // Check if user already has a business
  const existingBusinessId = await getBusinessIdForUser(userId);

  // Get region config for defaults
  const region = data.region || "US";
  const regionConfig = (REGIONS as any)[region];

  let businessId: string = "";
  let shouldCreate = !existingBusinessId;

  if (existingBusinessId) {
    console.log(`[Onboarding] Finalizing business setup: ${existingBusinessId}`);

    // Update existing business with final details and set status to ACTIVE
    const updateResult = await updateBusiness(existingBusinessId, {
      name: data.name,
      timezone: data.timezone,
      default_phone_number: data.phone || null,
      phone: data.phone || null,
      address: data.address || null,
      website: data.website || null,
      region: region,
      country_code: region,
      currency: data.currency || regionConfig.currency,
      locale: data.locale || regionConfig.locale,
      date_format: regionConfig.dateFormat,
      // @ts-ignore - Adding status update which might not be in Partial<Business> type def yet if not fully updated globally
      status: 'active'
    });

    if (!updateResult.success) {
      console.error(`[Onboarding] Failed to update business:`, updateResult.error);
      return { success: false, error: updateResult.error || "Failed to update business" };
    }

    businessId = existingBusinessId;
  } else {
    // This should theoretically not happen if startOnboardingAction was called,
    // but as a fallback we create one.
    console.log(`[Onboarding] Warning: No business found at finish. Creating NEW active business.`);
    const businessResult = await createBusiness(userId, {
      name: data.name,
      timezone: data.timezone,
      default_phone_number: data.phone || null,
      phone: data.phone || null,
      address: data.address || null,
      website: data.website || null,
      region: region,
      country_code: region,
      currency: data.currency || regionConfig.currency,
      locale: data.locale || regionConfig.locale,
      date_format: regionConfig.dateFormat,
      status: 'active'
    });

    if (!businessResult.success || !businessResult.businessId) {
      console.error(`[Onboarding] Failed to create business:`, businessResult.error);
      return { success: false, error: businessResult.error || "Failed to create business" };
    }

    businessId = businessResult.businessId;
  }

  console.log(`[Onboarding] Resolved Business ID: ${businessId}`);

  // Build detailed config objects
  const businessProfile = {
    description: data.description || "",
    email: (data.email && !data.email.includes("example.com") && !data.email.includes("test@")) ? data.email : "",
    website: data.website || "",
    businessType: data.businessType || "other",
    customBusinessType: data.customBusinessType || "",
    address: data.address || "",
  };

  const bookingSettings = {
    bufferTime: data.bufferTime || 15,
    advanceBookingDays: data.advanceBookingDays || 30,
  };

  const services = data.services || [];

  const faqs = (data.faqs || []).map((f: { id?: string; question: string; answer: string }) => ({
    id: f.id ?? crypto.randomUUID(),
    question: f.question,
    answer: f.answer,
  }));

  const configResult = await updateBusinessConfig(businessId, {
    working_hours: data.workingHours,
    services: services,
    faqs: faqs, // business_configs.faqs column
    booking_settings: bookingSettings,
    business_profile: businessProfile,
    min_notice_hours: data.minNoticeHours || 24,
  });

  revalidatePath("/");

  // Handle Knowledge Base (FAQs) saving if provided
  if (data.faqs && data.faqs.length > 0) {
    console.log(`[Onboarding] Automating knowledge base save for ${data.faqs.length} FAQs`);
    await saveKnowledgeBase(data.faqs);
  }

  // Send welcome email after successful onboarding
  try {
    const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL;
    const result = await sendWelcomeEmail({
      userId,
      userName: data.name,
      dashboardUrl,
    });
    if (!result.success) {
      console.warn(`[Onboarding] Failed to send welcome email: ${result.error}`);
      // Don't fail onboarding if email fails
    }
  } catch (error) {
    console.error("[Onboarding] Error sending welcome email:", error);
    // Don't fail onboarding if email fails
  }

  return { success: true };
}

// Business result type for search results
export interface BusinessSearchResult {
  id: string;
  name: string;
  address: string;
  phone?: string;
  websiteUrl?: string;
  category?: string;
  rating?: number;
  openingHours?: any;
}

// ============================================================
// React 19 useActionState Types
// ============================================================

export type SearchFormState = {
  success: boolean;
  businesses: BusinessSearchResult[];
  searchTerm?: string;
  region?: RegionCode;
  error?: string;
} | null;

export type GenerateFormState = {
  success: boolean;
  error?: string;
  data?: {
    businessInfo: {
      description: string;
      email?: string;
      name?: string;
      category?: string;
      address?: string;
      phone?: string;
      website?: string;
    };
    hours: Record<string, { isOpen: boolean; open: string; close: string }>;
    services: { name: string; duration: number; price: number; description: string }[];
    faqs: { id: string; question: string; answer: string; source: string; confidence: number; requiresConfirmation: boolean }[];
  };
} | null;

// ============================================================
// Server Actions for React 19 Forms
// ============================================================

/**
 * Search for businesses - React 19 useActionState compatible
 * Accepts prevState and FormData for proper form handling
 */
export async function findBusinessesAction(
  prevState: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  try {
    const name = formData.get("businessName") as string;
    const region = (formData.get("region") as RegionCode) || "US";
    const location = formData.get("location") as string || "";

    if (!name?.trim()) {
      return {
        success: false,
        businesses: [],
        error: "Please enter your business name.",
      };
    }

    // TODO: DEBUG CODE - NEED TO REMOVE
    const DEBUG = process.env.DEBUG === "true";
    if (DEBUG) {
      const sampleBusinesses: BusinessSearchResult[] = [
        {
          id: `search_0_${Date.now()}`,
          name: name.trim() || "Sample Business",
          address: "123 Main St, Sample City",
          phone: "+1 555-0100",
          websiteUrl: "https://example.com",
          category: "General Business",
          rating: 4.5,
        },
        {
          id: `search_1_${Date.now()}`,
          name: `${name.trim() || "Sample"} - Second Location`,
          address: "456 Oak Ave, Sample City",
          phone: "+1 555-0101",
          websiteUrl: "https://example.com",
          category: "General Business",
        },
      ];
      return {
        success: true,
        businesses: sampleBusinesses,
        searchTerm: name,
        region,
      };
    }

    let userId = await getAuthenticatedUserId();
    if (!userId) {
      console.warn("[Onboarding] Using DEV TEST USER ID");
      userId = "test-user-id";
    }

    const regionConfig = REGIONS[region];
    const regionName = regionConfig?.name || "United States";

    // Build search query with location if provided
    let searchQuery = name;
    if (location.trim()) {
      searchQuery = `${name} in ${location}`;
    } else {
      searchQuery = `${name} in ${regionName}`;
    }

    let businesses: BusinessSearchResult[];

    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      console.error("[Onboarding] Error: SERPER_API_KEY is not defined");
      return {
        success: false,
        businesses: [],
        searchTerm: name,
        region,
        error: "Search service is not configured",
      };
    }

    const response = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchQuery,
        gl: region.toLowerCase(),
        ...(location.trim() && { location: location.trim() }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Onboarding] Serper API Error (${response.status}): ${errorText}`);

      return {
        success: false,
        businesses: [],
        searchTerm: name,
        region,
        error: response.status === 403
          ? "Search service permission denied."
          : "Search service error. Please try again.",
      };
    }

    const result = await response.json();

    // Increased from 3 to 5 results
    const places = result.places?.slice(0, 5) || [];

    businesses = places.map((place: any, index: number) => ({
      id: `search_${index}_${Date.now()}`,
      name: place.title || place.name || "Unknown Business",
      address: place.address ?? place.addressLines ?? "",
      phone: place.phone ?? place.phoneNumber ?? undefined,
      websiteUrl: place.website ?? place.websiteUrl ?? place.url ?? undefined,
      category: place.category ?? place.type ?? undefined,
      rating: place.rating ?? undefined,
      openingHours: place.openingHours ?? place.hours ?? undefined,
    }));

    return {
      success: true,
      businesses,
      searchTerm: name,
      region,
      error: businesses.length === 0 ? "No businesses found matching your search." : undefined,
    };

  } catch (error) {
    console.error("[Onboarding] Search error:", error);
    return {
      success: false,
      businesses: [],
      error: "An unexpected error occurred during search",
    };
  }
}

/**
 * Select a business and generate profile - React 19 useActionState compatible
 */
export async function selectAndGenerateAction(
  prevState: GenerateFormState,
  formData: FormData
): Promise<GenerateFormState> {
  try {
    const businessData = formData.get("businessData") as string;
    if (!businessData) {
      return { success: false, error: "No business selected" };
    }

    const business: BusinessSearchResult = JSON.parse(businessData);

    // Initialize the business in DB
    try {
      await startOnboardingAction(business.name);
    } catch (initError) {
      console.error("Failed to init business:", initError);
    }

    // Generate profile
    const genResult = await generateBusinessProfile({
      name: business.name,
      category: business.category || "General Business",
      address: business.address || "",
      phone: business.phone || "",
      website: business.websiteUrl || "",
    });

    if (!genResult.success || !genResult.data) {
      return { success: false, error: genResult.error || "Failed to generate profile" };
    }

    return {
      success: true,
      data: genResult.data,
    };

  } catch (error) {
    console.error("[Onboarding] Select/Generate error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ============================================================
// Legacy function (kept for backward compatibility)
// ============================================================

// Search for businesses using Serper (Google Places) - returns up to 3 results
export async function findBusinesses(data: {
  name: string;
  region: RegionCode;
}): Promise<{
  businesses: BusinessSearchResult[];
  error?: string;
}> {
  const formData = new FormData();
  formData.set("businessName", data.name);
  formData.set("region", data.region);

  const result = await findBusinessesAction(null, formData);
  return {
    businesses: result?.businesses || [],
    error: result?.error,
  };
}

// Generate COMPREHENSIVE business profile
export async function generateBusinessProfile(businessData: {
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
}): Promise<{
  success: boolean;
  data?: {
    businessInfo: {
      description: string;
      email?: string;
      name?: string;
      category?: string;
      address?: string;
      phone?: string;
      website?: string;
    };
    hours: {
      monday: { isOpen: boolean; open: string; close: string };
      tuesday: { isOpen: boolean; open: string; close: string };
      wednesday: { isOpen: boolean; open: string; close: string };
      thursday: { isOpen: boolean; open: string; close: string };
      friday: { isOpen: boolean; open: string; close: string };
      saturday: { isOpen: boolean; open: string; close: string };
      sunday: { isOpen: boolean; open: string; close: string };
    };
    services: { name: string; duration: number; price: number; description: string }[];
    faqs: { id: string; question: string; answer: string; source: string; confidence: number; requiresConfirmation: boolean }[];
  };
  error?: string;
}> {
  try {
    // TODO: DEBUG CODE - NEED TO REMOVE
    const DEBUG = process.env.DEBUG === "true";
    if (DEBUG) {
      const defaultDay = { isOpen: true, open: "10:00", close: "19:00" };
      return {
        success: true,
        data: {
          businessInfo: {
            description: "Sample business description for testing. Update this in settings after onboarding.",
            name: businessData.name,
            category: businessData.category,
            address: businessData.address,
            phone: businessData.phone,
            website: businessData.website,
          },
          hours: {
            monday: defaultDay,
            tuesday: defaultDay,
            wednesday: defaultDay,
            thursday: defaultDay,
            friday: defaultDay,
            saturday: defaultDay,
            sunday: defaultDay,
          },
          services: [
            { name: "Consultation", duration: 30, price: 50, description: "Initial consultation" },
            { name: "Standard Service", duration: 60, price: 100, description: "Standard service session" },
            { name: "Premium Service", duration: 90, price: 150, description: "Extended premium session" },
          ],
          faqs: [
            { id: "gen_0", question: "What are your opening hours?", answer: "Please contact us to confirm.", source: "ai_generated", confidence: 0.8, requiresConfirmation: true },
            { id: "gen_1", question: "Do you accept walk-ins?", answer: "We recommend booking in advance.", source: "ai_generated", confidence: 0.9, requiresConfirmation: false },
            { id: "gen_2", question: "What payment methods do you accept?", answer: "We accept major credit cards and local payment options.", source: "ai_generated", confidence: 0.85, requiresConfirmation: false },
          ],
        },
      };
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      console.warn("[Onboarding] Using DEV TEST USER ID for generation");
    }

    const { openai } = await import("@ai-sdk/openai");
    const { generateObject } = await import("ai");
    const { z } = await import("zod");

    const schema = z.object({
      businessInfo: z.object({
        description: z.string().describe("Professional business description for the booking page (2-3 sentences)."),
        email: z.string().optional().describe("Inferred email or empty string."),
      }),
      services: z.array(z.object({
        name: z.string(),
        duration: z.number().describe("Duration in minutes (estimate)"),
        price: z.number().describe("Price in USD/Local Currency (estimate)"),
        description: z.string().describe("Short description of the service")
      })).describe("List of 3-5 core services offered by this type of business"),
      faqs: z.array(z.object({
        question: z.string(),
        answer: z.string(),
        confidence: z.number(),
        requiresConfirmation: z.boolean()
      })).describe("List of 5-7 essential FAQs for booking/location/pricing")
    });

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: schema,
      prompt: `
            You are setting up a Booking Agent for a business.
            Generate a full initial profile based on this info:
            
            Name: ${businessData.name}
            Category: ${businessData.category}
            Address: ${businessData.address}
            Phone: ${businessData.phone || "Not found"}
            Website: ${businessData.website || "Not found"}

            Guidelines:
            1. **Services**: Infer standard services for a "${businessData.category}". E.g. for a Dentist: "Checkup", "Cleaning". Estimate standard market prices/durations.
            2. **FAQs**: vital questions about parking, insurance (if medical), booking policy, etc.
            3. **Description**: Professional and welcoming tone.
            4. **Email/Address/Phone**: Only return these if you can strongly infer them or they are provided. Otherwise, return an EMPTY STRING. Do NOT use placeholders like "test@example.com", "123 Main St", or "555-0199".

            CRITICAL: Do NOT hallucinate specific details like "Free parking at the rear" or "We accept BlueCross insurance" unless you are 100% certain based on the category (e.g. "We accept major credit cards" is usually safe).
            If you don't know a specific detail, use a generic placeholder answer like "Please contact us to confirm" or "varies by service".
        `,
    });

    // Hardcoded default hours (10 AM - 7 PM, 7 days a week)
    const defaultDay = { isOpen: true, open: "10:00", close: "19:00" };

    const hoursMap = {
      monday: defaultDay,
      tuesday: defaultDay,
      wednesday: defaultDay,
      thursday: defaultDay,
      friday: defaultDay,
      saturday: defaultDay,
      sunday: defaultDay
    };

    return {
      success: true,
      data: {
        businessInfo: {
          ...object.businessInfo,
          name: businessData.name,
          category: businessData.category,
          address: businessData.address,
          phone: businessData.phone,
          website: businessData.website
        },
        hours: hoursMap,
        services: object.services,
        faqs: object.faqs.map((f, i) => ({
          id: `gen_${i}`,
          question: f.question,
          answer: f.answer,
          source: "ai_generated",
          confidence: f.confidence,
          requiresConfirmation: f.requiresConfirmation
        }))
      }
    };

  } catch (error) {
    console.error("[Onboarding] Generation error:", error);
    return { success: false, error: "An unexpected error occurred during generation" };
  }
}

// Separate action for saving knowledge base (FAQ)
export async function saveKnowledgeBase(questions: { id?: string; question: string; answer: string; source?: string; confidence?: number; requiresConfirmation?: boolean }[]): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const businessId = await getBusinessIdForUser(userId);
    if (!businessId) {
      return { success: false, error: "Business not found" };
    }

    // Prepare chunks for embedding
    const chunks = questions.map((q) => {
      // We only embed the Q&A text content for retrieval
      return `Q: ${q.question}\nA: ${q.answer}`;
    });

    console.log(`[Knowledge] Generating embeddings for ${chunks.length} chunks...`);

    // Dynamic import to avoid edge runtime issues if needed
    const { openai } = await import("@ai-sdk/openai");
    const { embedMany } = await import("ai");
    const { createSupabaseClient } = await import("@/lib/supabase-client");

    // Generate embeddings
    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: chunks,
    });

    const supabase = createSupabaseClient();

    // Delete existing knowledge for this business to avoid duplicates
    await supabase.from("knowledge_chunks").delete().eq("business_id", businessId);

    // Prepare rows for insertion
    const rows = chunks.map((content, index) => ({
      business_id: businessId,
      content: content,
      embedding: embeddings[index],
    }));

    // Insert new chunks
    const { error } = await supabase.from("knowledge_chunks").insert(rows);

    if (error) {
      console.error("[Knowledge] Supabase insert error:", error);
      return { success: false, error: "Failed to save to database" };
    }

    console.log(`[Knowledge] Successfully saved ${rows.length} chunks.`);
    return { success: true };

  } catch (error) {
    console.error("[Knowledge] Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
