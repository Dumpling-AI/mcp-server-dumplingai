/**
 * MCP Server for Dumpling AI
 *
 * Changes:
 * - Added get-youtube-transcript tool to fetch transcripts from YouTube videos using the Dumpling AI API
 * - Added search tool to perform Google web searches and optionally scrape content from results
 * - Added get-autocomplete tool to get Google search autocomplete suggestions based on a query
 * - Added search-maps tool to perform Google Maps searches
 * - Added search-places tool to perform Google Places searches
 * - Added search-news tool to perform Google News searches
 * - Added get-google-reviews tool to fetch Google reviews for a place
 * - Added scrape tool to extract content from a webpage
 * - Added crawl tool to crawl a website and extract content from multiple pages
 * - Added extract-document tool to extract structured data from document files
 * - Added extract-video tool to extract structured data from video files
 * - Added extract-audio tool to extract structured data from audio files
 * - Added generate-ai-image tool to generate AI images
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://app.dumplingai.com";

// Define types for Dumpling AI API responses
interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
  position: number;
  sitelinks?: Array<{ title: string; link: string }>;
  date?: string;
  scrapeOutput?: {
    title: string;
    metadata: Record<string, unknown>;
    url: string;
    format: string;
    cleaned: boolean;
    content: string;
  };
}

// Create server instance
const server = new McpServer({
  name: "dumplingai",
  version: "1.0.0",
});

// Tool to fetch YouTube transcript from the Dumpling AI API
server.tool(
  "get-youtube-transcript",
  {
    videoUrl: z.string().url(),
    includeTimestamps: z.boolean().optional(),
    timestampsToCombine: z.number().optional(),
    preferredLanguage: z.string().optional(),
  },
  async ({
    videoUrl,
    includeTimestamps,
    timestampsToCombine,
    preferredLanguage,
  }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(
        `${NWS_API_BASE}/api/v1/get-youtube-transcript`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            videoUrl,
            includeTimestamps,
            timestampsToCombine,
            preferredLanguage,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch YouTube transcript: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      return {
        content: [
          {
            type: "text",
            text: `Transcript: ${data.transcript}\nLanguage: ${data.language}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching YouTube transcript:", error);
      throw error;
    }
  }
);

// Tool to perform Google web search and optionally scrape content from results
server.tool(
  "search",
  {
    query: z.string(),
    country: z.string().optional(),
    location: z.string().optional(),
    language: z.string().optional(),
    dateRange: z
      .enum([
        "anyTime",
        "pastHour",
        "pastDay",
        "pastWeek",
        "pastMonth",
        "pastYear",
      ])
      .optional(),
    page: z.number().optional(),
    scrapeResults: z.boolean().optional(),
    numResultsToScrape: z.number().optional(),
    scrapeOptions: z
      .object({
        format: z.enum(["markdown", "html", "screenshot"]).optional(),
        cleaned: z.boolean().optional(),
      })
      .optional(),
  },
  async ({
    query,
    country,
    location,
    language,
    dateRange,
    page,
    scrapeResults,
    numResultsToScrape,
    scrapeOptions,
  }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          country,
          location,
          language,
          dateRange,
          page,
          scrapeResults,
          numResultsToScrape,
          scrapeOptions,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to perform search: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      // Transform search results into a structured format for the MCP response
      const formattedResults = {
        searchParameters: data.searchParameters,
        organicResults: data.organic.map((result: SearchResultItem) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          position: result.position,
          ...(result.scrapeOutput && { content: result.scrapeOutput.content }),
        })),
        ...(data.featuredSnippet && { featuredSnippet: data.featuredSnippet }),
        ...(data.relatedSearches && { relatedSearches: data.relatedSearches }),
        ...(data.peopleAlsoAsk && { peopleAlsoAsk: data.peopleAlsoAsk }),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formattedResults, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error performing search:", error);
      throw error;
    }
  }
);

// Tool to get Google search autocomplete suggestions
server.tool(
  "get-autocomplete",
  {
    query: z.string(),
    location: z.string().optional(),
    country: z.string().optional(),
    language: z.string().optional(),
  },
  async ({ query, location, country, language }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/get-autocomplete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          location,
          country,
          language,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get autocomplete suggestions: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                searchParameters: data.searchParameters,
                suggestions: data.suggestions,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting autocomplete suggestions:", error);
      throw error;
    }
  }
);

// Tool to perform Google Maps search
server.tool(
  "search-maps",
  {
    query: z.string(),
    gpsPositionZoom: z.string().optional(),
    placeId: z.string().optional(),
    cid: z.string().optional(),
    language: z.string().optional(),
    page: z.number().optional(),
  },
  async ({ query, gpsPositionZoom, placeId, cid, language, page }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/search-maps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          gpsPositionZoom,
          placeId,
          cid,
          language,
          page,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to perform maps search: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                searchParameters: data.searchParameters,
                ll: data.ll,
                places: data.places,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error performing maps search:", error);
      throw error;
    }
  }
);

// Tool to perform Google Places search
server.tool(
  "search-places",
  {
    query: z.string(),
    country: z.string().optional(),
    location: z.string().optional(),
    language: z.string().optional(),
    page: z.number().optional(),
  },
  async ({ query, country, location, language, page }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/search-places`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          country,
          location,
          language,
          page,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to perform places search: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                searchParameters: data.searchParameters,
                places: data.places,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error performing places search:", error);
      throw error;
    }
  }
);

// Tool to perform Google News search
server.tool(
  "search-news",
  {
    query: z.string(),
    country: z.string().optional(),
    location: z.string().optional(),
    language: z.string().optional(),
    dateRange: z
      .enum([
        "anyTime",
        "pastHour",
        "pastDay",
        "pastWeek",
        "pastMonth",
        "pastYear",
      ])
      .optional(),
    page: z.number().optional(),
  },
  async ({ query, country, location, language, dateRange, page }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/search-news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          country,
          location,
          language,
          dateRange,
          page,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to perform news search: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                searchParameters: data.searchParameters,
                news: data.news,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error performing news search:", error);
      throw error;
    }
  }
);

// Tool to fetch Google reviews for a place
server.tool(
  "get-google-reviews",
  {
    placeId: z.string().optional(),
    businessName: z.string().optional(),
    location: z.string().optional(),
    language: z.string().optional(),
    limit: z.number().optional(),
    sortBy: z.enum(["relevance", "newest"]).optional(),
  },
  async ({ placeId, businessName, location, language, limit, sortBy }) => {
    // Ensure either placeId or businessName is provided
    if (!placeId && !businessName) {
      throw new Error("Either placeId or businessName is required");
    }

    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(
        `${NWS_API_BASE}/api/v1/get-google-reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            placeId,
            businessName,
            location,
            language,
            limit,
            sortBy,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get Google reviews: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting Google reviews:", error);
      throw error;
    }
  }
);

// Tool to scrape content from a webpage
server.tool(
  "scrape",
  {
    url: z.string().url(),
    format: z.enum(["markdown", "html", "screenshot"]).optional(),
    cleaned: z.boolean().optional(),
    renderJs: z.boolean().optional(),
  },
  async ({ url, format, cleaned, renderJs }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          format,
          cleaned,
          renderJs,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to scrape webpage: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                title: data.title,
                url: data.url,
                content: data.content,
                metadata: data.metadata,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error scraping webpage:", error);
      throw error;
    }
  }
);

// Tool to crawl a website and extract content from multiple pages
server.tool(
  "crawl",
  {
    url: z.string().url(),
    limit: z.number().optional(),
    depth: z.number().optional(),
    format: z.enum(["markdown", "html", "screenshot"]).optional(),
    cleaned: z.boolean().optional(),
    renderJs: z.boolean().optional(),
  },
  async ({ url, limit, depth, format, cleaned, renderJs }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          limit,
          depth,
          format,
          cleaned,
          renderJs,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to crawl website: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                baseUrl: data.baseUrl,
                pages: data.pages,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error crawling website:", error);
      throw error;
    }
  }
);

// Tool to extract structured data from document files
server.tool(
  "extract-document",
  {
    url: z.string().url().optional(),
    base64: z.string().optional(),
    prompt: z.string(),
    model: z.enum(["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"]).optional(),
  },
  async ({ url, base64, prompt, model }) => {
    // Ensure either url or base64 is provided
    if (!url && !base64) {
      throw new Error("Either url or base64 is required");
    }

    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/extract-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          base64,
          prompt,
          model,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to extract document data: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                result: data.result,
                model: data.model,
                credits: data.credits,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error extracting document data:", error);
      throw error;
    }
  }
);

// Tool to extract structured data from video files
server.tool(
  "extract-video",
  {
    url: z.string().url().optional(),
    base64: z.string().optional(),
    prompt: z.string(),
    model: z.enum(["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"]).optional(),
    frameRate: z.number().optional(),
  },
  async ({ url, base64, prompt, model, frameRate }) => {
    // Ensure either url or base64 is provided
    if (!url && !base64) {
      throw new Error("Either url or base64 is required");
    }

    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/extract-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          base64,
          prompt,
          model,
          frameRate,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to extract video data: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                result: data.result,
                model: data.model,
                credits: data.credits,
                duration: data.duration,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error extracting video data:", error);
      throw error;
    }
  }
);

// Tool to extract structured data from audio files
server.tool(
  "extract-audio",
  {
    url: z.string().url().optional(),
    base64: z.string().optional(),
    prompt: z.string(),
    model: z.enum(["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"]).optional(),
  },
  async ({ url, base64, prompt, model }) => {
    // Ensure either url or base64 is provided
    if (!url && !base64) {
      throw new Error("Either url or base64 is required");
    }

    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/extract-audio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          base64,
          prompt,
          model,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to extract audio data: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                result: data.result,
                model: data.model,
                credits: data.credits,
                duration: data.duration,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error extracting audio data:", error);
      throw error;
    }
  }
);

// Tool to generate AI images
server.tool(
  "generate-ai-image",
  {
    prompt: z.string(),
    model: z.enum([
      "FLUX.1-schnell",
      "FLUX.1-dev",
      "FLUX.1-pro",
      "FLUX.1.1-pro",
      "recraft-v3",
    ]).optional(),
    size: z.string().optional(),
    style: z.string().optional(),
    negativePrompt: z.string().optional(),
    seed: z.number().optional(),
    steps: z.number().optional(),
    cfgScale: z.number().optional(),
    numImages: z.number().optional(),
  },
  async ({
    prompt,
    model,
    size,
    style,
    negativePrompt,
    seed,
    steps,
    cfgScale,
    numImages,
  }) => {
    // Get API key from environment variable
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) {
      throw new Error("DUMPLING_API_KEY environment variable not set");
    }

    try {
      const response = await fetch(`${NWS_API_BASE}/api/v1/generate-ai-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          model,
          size,
          style,
          negativePrompt,
          seed,
          steps,
          cfgScale,
          numImages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to generate AI image: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                images: data.images,
                model: data.model,
                credits: data.credits,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      console.error("Error generating AI image:", error);
      throw error;
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Dumpling AI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
