import { openai, hasApiKey } from "@/lib/openai";
import { SYSTEM_PROMPT, createUserPrompt } from "@/lib/prompts";
import { getFallbackRecommendations } from "@/data/sampleGifts";

export async function POST(request) {
  try {
    const body = await request.json();
    const { relationship, age, occasion, interests, budget, vibe } = body;

    // Basic Validation
    if (!relationship || !age || !occasion || !budget) {
      return Response.json(
        { error: "Missing required fields: relationship, age, occasion, and budget are required." },
        { status: 400 }
      );
    }

    // Check if live API key is configured
    if (!hasApiKey || !openai) {
      // Simulate network latency for a realistic loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const fallbackGifts = getFallbackRecommendations({
        relationship,
        age,
        occasion,
        interests,
        budget,
        vibe
      });

      return Response.json({
        recommendations: fallbackGifts,
        isDemoMode: true
      });
    }

    // Call OpenAI GPT-4o-mini
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: createUserPrompt({ relationship, age, occasion, interests, budget, vibe }) }
        ],
        response_format: { type: "json_object" }
      });

      const rawContent = completion.choices[0].message.content;
      const parsedData = JSON.parse(rawContent);

      if (!parsedData.recommendations || !Array.isArray(parsedData.recommendations)) {
        throw new Error("Invalid response format from OpenAI API");
      }

      return Response.json({
        recommendations: parsedData.recommendations,
        isDemoMode: false
      });

    } catch (apiError) {
      console.error("OpenAI API call failed, falling back to local database:", apiError);
      
      // Fallback on API failure
      const fallbackGifts = getFallbackRecommendations({
        relationship,
        age,
        occasion,
        interests,
        budget,
        vibe
      });

      return Response.json({
        recommendations: fallbackGifts,
        isDemoMode: true,
        warning: `OpenAI error: ${apiError.message}. Fell back to local recommendation database.`
      });
    }

  } catch (err) {
    console.error("Internal API route error:", err);
    return Response.json(
      { error: "An unexpected server error occurred: " + err.message },
      { status: 500 }
    );
  }
}
