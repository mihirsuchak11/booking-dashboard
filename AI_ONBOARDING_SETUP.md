# AI-Powered Onboarding Integration

## Overview

The onboarding wizard now includes AI-powered auto-fill functionality using the Vercel AI SDK and OpenAI.

## Setup

1. **Install dependencies** (already done):
   ```bash
   pnpm add ai @ai-sdk/openai zod
   ```

2. **Set up environment variables**:
   
   Create a `.env.local` file in the root of `ai-booking-agent-dashboard-business` with:
   
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
   
   Get your OpenAI API key from: https://platform.openai.com/api-keys

## How It Works

### API Route

**Endpoint**: `POST /api/onboarding/ai-draft`

**Request Body**:
```json
{
  "input": "https://business-website.com or any text description"
}
```

**Response**:
```json
{
  "businessInfo": {
    "name": "Business Name",
    "description": "...",
    "type": "hospital|photography|salon|other",
    "phone": "...",
    "email": "..."
  },
  "locations": [...],
  "services": [...],
  "questions": [...]
}
```

### Frontend Integration

1. User enters a URL or business description on `/onboarding/start`
2. Clicks "Auto-fill with AI"
3. API calls OpenAI GPT-4o to analyze the input
4. AI generates structured business configuration
5. Data is populated into the `OnboardingContext`
6. User is redirected to `/onboarding/profile` to review and edit

## Testing

To test the AI integration:

1. Set your `OPENAI_API_KEY` in `.env.local`
2. Run `pnpm dev`
3. Navigate to `/onboarding/start`
4. Try inputs like:
   - `https://www.dentistry.com`
   - `https://instagram.com/photographystudio`
   - `"We are a hair salon in downtown offering cuts, color, and styling"`

## Fallback

If the AI fails or the user prefers manual entry, they can click "Enter details manually" to skip AI and fill everything out themselves.

