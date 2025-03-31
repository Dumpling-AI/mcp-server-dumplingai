#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createTransport } from "@smithery/sdk/transport.js";
import { z } from "zod";

const NWS_API_BASE = "https://app.dumplingai.com";

// Create server instance
const server = new McpServer({
  name: "dumplingai",
  version: "1.0.0",
});

// Tool to fetch YouTube transcript
server.tool(
  "get-youtube-transcript",
  "Extract transcripts from YouTube videos with optional parameters for timestamps and language preferences.",
  {
    videoUrl: z.string().url().describe("URL of the YouTube video"),
    includeTimestamps: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether to include timestamps"),
    timestampsToCombine: z
      .number()
      .optional()
      .default(5)
      .describe("Number of timestamps to combine"),
    preferredLanguage: z
      .string()
      .optional()
      .default("en")
      .describe("Preferred language code"),
  },
  async ({
    videoUrl,
    includeTimestamps,
    timestampsToCombine,
    preferredLanguage,
  }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
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
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to perform Google web search
server.tool(
  "search",
  "Perform Google web searches with customizable parameters.",
  {
    query: z.string().describe("Search query"),
    country: z.string().optional().describe("Country code (e.g., 'us')"),
    location: z.string().optional().describe("Location name"),
    language: z.string().optional().describe("Language code (e.g., 'en')"),
    dateRange: z
      .enum([
        "anyTime",
        "pastHour",
        "pastDay",
        "pastWeek",
        "pastMonth",
        "pastYear",
      ])
      .optional()
      .describe("Time range filter"),
    page: z.number().optional().describe("Page number"),
    scrapeResults: z.boolean().optional().describe("Whether to scrape results"),
    numResultsToScrape: z
      .number()
      .optional()
      .describe("Number of results to scrape"),
    scrapeOptions: z
      .object({
        format: z.enum(["markdown", "html", "screenshot"]).optional(),
        cleaned: z.boolean().optional(),
      })
      .optional()
      .describe("Scraping options"),
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
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
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
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to get Google autocomplete suggestions
server.tool(
  "get-autocomplete",
  "Retrieve Google autocomplete suggestions for a query.",
  {
    query: z.string().describe("Search query"),
    location: z.string().optional().describe("Location name"),
    country: z.string().optional().describe("Country code (e.g., 'us')"),
    language: z.string().optional().describe("Language code (e.g., 'en')"),
  },
  async ({ query, location, country, language }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/get-autocomplete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, location, country, language }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to perform Google Maps search
server.tool(
  "search-maps",
  "Search Google Maps for locations and businesses.",
  {
    query: z.string().describe("Search query"),
    gpsPositionZoom: z
      .string()
      .optional()
      .describe("GPS coordinates with zoom (e.g., 'lat,long,zoom')"),
    placeId: z.string().optional().describe("Google Place ID"),
    cid: z.string().optional().describe("Google Maps CID"),
    language: z.string().optional().describe("Language code (e.g., 'en')"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ query, gpsPositionZoom, placeId, cid, language, page }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
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
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to perform Google Places search
server.tool(
  "search-places",
  "Search for places with detailed business information.",
  {
    query: z.string().describe("Search query"),
    country: z.string().optional().describe("Country code (e.g., 'us')"),
    location: z.string().optional().describe("Location name"),
    language: z.string().optional().describe("Language code (e.g., 'en')"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ query, country, location, language, page }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/search-places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, country, location, language, page }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to perform Google News search
server.tool(
  "search-news",
  "Search for news articles across multiple sources.",
  {
    query: z.string().describe("Search query"),
    country: z.string().optional().describe("Country code (e.g., 'us')"),
    location: z.string().optional().describe("Location name"),
    language: z.string().optional().describe("Language code (e.g., 'en')"),
    dateRange: z
      .enum([
        "anyTime",
        "pastHour",
        "pastDay",
        "pastWeek",
        "pastMonth",
        "pastYear",
      ])
      .optional()
      .describe("Time range filter"),
    page: z.number().optional().describe("Page number"),
  },
  async ({ query, country, location, language, dateRange, page }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
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
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to fetch Google reviews
server.tool(
  "get-google-reviews",
  "Retrieve Google reviews for businesses or places.",
  {
    keyword: z.string().optional().describe("Business name or search term"),
    cid: z.string().optional().describe("Google Maps CID"),
    placeId: z.string().optional().describe("Google Place ID"),
    reviews: z
      .number()
      .optional()
      .default(10)
      .describe("Number of reviews to fetch"),
    sortBy: z
      .enum(["relevant", "newest", "highest_rating", "lowest_rating"])
      .optional()
      .default("relevant")
      .describe("Sort order"),
    language: z
      .string()
      .optional()
      .default("en")
      .describe("Language code (e.g., 'en')"),
    location: z
      .string()
      .optional()
      .default("London,England,United Kingdom")
      .describe("Location context"),
  },
  async ({ keyword, cid, placeId, reviews, sortBy, language, location }) => {
    if (!keyword && !cid && !placeId)
      throw new Error("Either keyword, cid, or placeId is required");
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/get-google-reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        keyword,
        cid,
        placeId,
        reviews,
        sortBy,
        language,
        location,
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to scrape content from a URL
server.tool(
  "scrape",
  "Extract and parse content from any web page.",
  {
    url: z.string().url().describe("URL to scrape"),
    format: z
      .enum(["markdown", "html", "screenshot"])
      .optional()
      .describe("Output format"),
    cleaned: z.boolean().optional().describe("Whether to clean content"),
    renderJs: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether to render JavaScript"),
  },
  async ({ url, format, cleaned, renderJs }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url, format, cleaned, renderJs }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to crawl a website
server.tool(
  "crawl",
  "Recursively crawl websites and extract content.",
  {
    url: z.string().url().describe("Starting URL"),
    limit: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of pages to crawl"),
    depth: z.number().optional().default(2).describe("Maximum depth"),
    format: z
      .enum(["markdown", "text", "raw"])
      .optional()
      .default("markdown")
      .describe("Output format"),
  },
  async ({ url, limit, depth, format }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
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
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to extract structured data from web pages
server.tool(
  "extract",
  "Extract structured data from web pages using AI-powered instructions.",
  {
    url: z.string().url().describe("URL to extract from"),
    schema: z.record(z.any()).describe("Schema defining the data to extract"),
  },
  async ({ url, schema }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url, schema }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to capture screenshots
server.tool(
  "screenshot",
  "Capture screenshots of web pages with customizable settings.",
  {
    url: z.string().url().describe("URL to capture"),
    width: z.number().optional().describe("Viewport width"),
    height: z.number().optional().describe("Viewport height"),
    deviceScaleFactor: z.number().optional().describe("Device scale factor"),
    fullPage: z.boolean().optional().describe("Capture full page"),
    format: z.enum(["png", "jpeg"]).optional().describe("Image format"),
    quality: z.number().optional().describe("Image quality (1-100)"),
    renderJs: z.boolean().optional().describe("Render JavaScript"),
    wait: z
      .number()
      .min(0)
      .max(5000)
      .default(0)
      .describe("Wait time in ms before capture"),
    clipRectangle: z
      .object({
        top: z.number(),
        left: z.number(),
        width: z.number(),
        height: z.number(),
      })
      .optional()
      .describe("Area to clip"),
    blockCookieBanners: z
      .boolean()
      .optional()
      .default(true)
      .describe("Block cookie banners"),
    autoScroll: z.boolean().optional().describe("Auto-scroll page"),
  },
  async ({
    url,
    width,
    height,
    deviceScaleFactor,
    fullPage,
    format,
    quality,
    renderJs,
    wait,
    clipRectangle,
    blockCookieBanners,
    autoScroll,
  }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/screenshot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        width,
        height,
        deviceScaleFactor,
        fullPage,
        format,
        quality,
        renderJs,
        waitFor: wait,
        clipRectangle,
        blockCookieBanners,
        autoScroll,
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to convert documents to text
server.tool(
  "doc-to-text",
  "Convert various document formats to plain text.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    file: z.string().describe("URL or base64-encoded file content"),
    pages: z.string().optional().describe("Pages to process (e.g., '1, 2-5')"),
  },
  async ({ inputMethod, file, pages }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/doc-to-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputMethod, file, pages }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to convert files to PDF
server.tool(
  "convert-to-pdf",
  "Convert various file formats to PDF.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    file: z.string().describe("URL or base64-encoded file content"),
  },
  async ({ inputMethod, file }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/convert-to-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputMethod, file }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to merge PDFs
server.tool(
  "merge-pdfs",
  "Combine multiple PDF files into a single document.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    files: z.array(z.string()).describe("Array of URLs or base64-encoded PDFs"),
    metadata: z
      .object({
        Title: z.string().optional(),
        Author: z.string().optional(),
        Subject: z.string().optional(),
        Keywords: z.string().optional(),
      })
      .optional()
      .describe("Metadata for merged PDF"),
    pdfa: z
      .enum(["PDF/A-1b", "PDF/A-2b", "PDF/A-3b"])
      .optional()
      .describe("PDF/A compliance"),
    pdfua: z.boolean().optional().describe("PDF/UA compliance"),
    requestSource: z.string().optional().describe("Request source"),
  },
  async ({ inputMethod, files, metadata, pdfa, pdfua, requestSource }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/merge-pdfs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputMethod,
        files,
        metadata,
        pdfa,
        pdfua,
        requestSource,
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to trim videos
server.tool(
  "trim-video",
  "Trim videos to a specific duration.",
  {
    videoUrl: z.string().url().describe("URL of the video"),
    startTimestamp: z.string().describe("Start time in HH:MM:SS"),
    endTimestamp: z.string().describe("End time in HH:MM:SS"),
  },
  async ({ videoUrl, startTimestamp, endTimestamp }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/trim-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        videoUrl,
        startTimestamp,
        endTimestamp,
        requestSource: "mcp",
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to extract content from documents
server.tool(
  "extract-document",
  "Extract structured data from documents based on a prompt.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    files: z
      .array(z.string())
      .describe("Array of URLs or base64-encoded documents"),
    prompt: z.string().describe("Extraction prompt"),
    jsonMode: z.boolean().optional().describe("Return in JSON format"),
  },
  async ({ inputMethod, files, prompt, jsonMode }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/extract-document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputMethod,
        files,
        prompt,
        jsonMode,
        requestSource: "mcp",
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to extract from images
server.tool(
  "extract-image",
  "Extract structured data from images based on a prompt.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    images: z
      .array(z.string())
      .describe("Array of URLs or base64-encoded images"),
    prompt: z.string().describe("Extraction prompt"),
    jsonMode: z.boolean().optional().describe("Return in JSON format"),
  },
  async ({ inputMethod, images, prompt, jsonMode }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/extract-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputMethod,
        image: images[0],
        prompt,
        jsonMode,
        requestSource: "mcp",
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to extract from audio
server.tool(
  "extract-audio",
  "Extract structured data from audio files based on a prompt.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    audio: z.string().describe("URL or base64-encoded audio"),
    prompt: z.string().describe("Extraction prompt"),
    jsonMode: z.boolean().optional().describe("Return in JSON format"),
  },
  async ({ inputMethod, audio, prompt, jsonMode }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/extract-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputMethod,
        audio,
        prompt,
        jsonMode,
        requestSource: "mcp",
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to extract from videos
server.tool(
  "extract-video",
  "Extract structured data from videos based on a prompt.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    video: z.string().describe("URL or base64-encoded video"),
    prompt: z.string().describe("Extraction prompt"),
    jsonMode: z.boolean().optional().describe("Return in JSON format"),
  },
  async ({ inputMethod, video, prompt, jsonMode }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/extract-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputMethod,
        video,
        prompt,
        jsonMode,
        requestSource: "mcp",
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to read PDF metadata
server.tool(
  "read-pdf-metadata",
  "Extract metadata from PDF files.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    files: z.array(z.string()).describe("Array of URLs or base64-encoded PDFs"),
    requestSource: z.string().optional().describe("Request source"),
  },
  async ({ inputMethod, files, requestSource }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/read-pdf-metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputMethod, files, requestSource }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to write PDF metadata
server.tool(
  "write-pdf-metadata",
  "Write metadata to PDF files.",
  {
    inputMethod: z.enum(["url", "base64"]).describe("Input method"),
    files: z.array(z.string()).describe("Array of URLs or base64-encoded PDFs"),
    metadata: z
      .object({
        Title: z.string().optional(),
        Author: z.string().optional(),
        Subject: z.string().optional(),
        Keywords: z.string().optional(),
        Creator: z.string().optional(),
        Producer: z.string().optional(),
      })
      .describe("Metadata to write"),
  },
  async ({ inputMethod, files, metadata }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/write-pdf-metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputMethod, files, metadata }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to generate agent completions
server.tool(
  "generate-agent-completion",
  "Generate AI text completions with customizable parameters.",
  {
    messages: z
      .array(
        z.object({ role: z.enum(["user", "assistant"]), content: z.string() })
      )
      .describe("Array of messages"),
    agentId: z.string().describe("Agent ID"),
    parseJson: z.boolean().optional().describe("Parse response as JSON"),
    threadId: z
      .string()
      .optional()
      .describe("Thread ID for conversation history"),
  },
  async ({ messages, agentId, parseJson, threadId }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(
      `${NWS_API_BASE}/api/v1/agents/generate-completion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ messages, agentId, parseJson, threadId }),
      }
    );
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to search knowledge base
server.tool(
  "search-knowledge-base",
  "Search a knowledge base for relevant information.",
  {
    knowledgeBaseId: z.string().describe("Knowledge base ID"),
    query: z.string().describe("Search query"),
    resultCount: z.number().optional().default(5).describe("Number of results"),
  },
  async ({ knowledgeBaseId, query, resultCount }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(
      `${NWS_API_BASE}/api/v1/query-knowledge-base`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ knowledgeBaseId, query, resultCount }),
      }
    );
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to add to knowledge base
server.tool(
  "add-to-knowledge-base",
  "Add new text resources to a knowledge base.",
  {
    knowledgeBaseId: z.string().describe("Knowledge base ID"),
    name: z.string().describe("Resource name"),
    content: z.string().describe("Text content to add"),
  },
  async ({ knowledgeBaseId, name, content }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/knowledge-bases/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ knowledgeBaseId, name, content }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to generate AI images
server.tool(
  "generate-ai-image",
  "Generate AI images from text prompts.",
  {
    model: z.string().describe("Model to use for generation"),
    input: z
      .object({
        prompt: z.string().describe("Text prompt"),
        seed: z.number().optional().describe("Random seed"),
        num_outputs: z.number().optional().describe("Number of images"),
        aspect_ratio: z.string().optional().describe("Aspect ratio"),
        output_format: z.string().optional().describe("Output format"),
        output_quality: z.number().optional().describe("Output quality"),
        num_inference_steps: z.number().optional().describe("Inference steps"),
        guidance: z.number().optional().describe("Guidance scale"),
      })
      .describe("Model-specific parameters"),
  },
  async ({ model, input }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/generate-ai-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, input }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to run JavaScript code
server.tool(
  "run-js-code",
  "Execute JavaScript code in a sandbox.",
  {
    code: z.string().describe("JavaScript code"),
    commands: z.string().optional().describe("NPM install commands"),
    parseJson: z.boolean().optional().describe("Parse output as JSON"),
    timeout: z.number().optional().describe("Execution timeout in ms"),
    memory: z.number().optional().describe("Memory allocation in MB"),
  },
  async ({ code, commands, parseJson, timeout, memory }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/run-js-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ code, commands, parseJson, timeout, memory }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool to run Python code
server.tool(
  "run-python-code",
  "Execute Python code in a sandbox.",
  {
    code: z.string().describe("Python code"),
    commands: z.string().optional().describe("Pip install commands"),
    parseJson: z.boolean().optional().describe("Parse output as JSON"),
    timeout: z.number().optional().describe("Execution timeout in ms"),
    memory: z.number().optional().describe("Memory allocation in MB"),
    saveOutputFiles: z.boolean().optional().describe("Save output files"),
  },
  async ({ code, commands, parseJson, timeout, memory, saveOutputFiles }) => {
    const apiKey = process.env.DUMPLING_API_KEY;
    if (!apiKey) throw new Error("DUMPLING_API_KEY not set");
    const response = await fetch(`${NWS_API_BASE}/api/v1/run-python-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        code,
        commands,
        parseJson,
        timeout,
        memory,
        saveOutputFiles,
      }),
    });
    if (!response.ok)
      throw new Error(`Failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Smithery integration tools
server.tool(
  "smithery-sequential-thinking",
  "Enhance reasoning with structured sequential thinking process.",
  {
    prompt: z.string().describe("The problem or question to think about"),
    maxSteps: z.number().optional().default(5).describe("Maximum number of thinking steps"),
    format: z.enum(["markdown", "json"]).optional().default("markdown").describe("Output format"),
  },
  async ({ prompt, maxSteps, format }) => {
    const apiKey = process.env.SMITHERY_API_KEY;
    if (!apiKey) throw new Error("SMITHERY_API_KEY not set");
    
    try {
      // Create Smithery transport
      const transport = createTransport(
        "https://server.smithery.ai/@smithery-ai/server-sequential-thinking",
        {},
        apiKey
      );
      
      // Call the sequential thinking tool
      const response = await transport.callTool("sequential-thinking", {
        prompt,
        max_steps: maxSteps,
        format,
      });
      
      return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
    } catch (error) {
      throw new Error(`Smithery API error: ${error.message}`);
    }
  }
);

server.tool(
  "smithery-brave-search",
  "Perform web searches using Brave Search via Smithery.",
  {
    query: z.string().describe("Search query"),
    count: z.number().optional().default(10).describe("Number of results to return"),
    country: z.string().optional().describe("Country code (e.g., 'us')"),
    language: z.string().optional().describe("Language code (e.g., 'en')"),
  },
  async ({ query, count, country, language }) => {
    const apiKey = process.env.SMITHERY_API_KEY;
    if (!apiKey) throw new Error("SMITHERY_API_KEY not set");
    
    try {
      // Create Smithery transport
      const transport = createTransport(
        "https://server.smithery.ai/brave-search",
        {},
        apiKey
      );
      
      // Call the Brave search tool
      const response = await transport.callTool("search", {
        query,
        count,
        country,
        language,
      });
      
      return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
    } catch (error) {
      throw new Error(`Smithery API error: ${error.message}`);
    }
  }
);

server.tool(
  "smithery-browserbase",
  "Automate browser interactions using Browserbase via Smithery.",
  {
    url: z.string().url().describe("URL to navigate to"),
    action: z.enum(["navigate", "screenshot", "extract", "click", "type"]).describe("Action to perform"),
    selector: z.string().optional().describe("CSS selector for click or type actions"),
    text: z.string().optional().describe("Text to type"),
    waitForSelector: z.string().optional().describe("Selector to wait for before action"),
  },
  async ({ url, action, selector, text, waitForSelector }) => {
    const apiKey = process.env.SMITHERY_API_KEY;
    if (!apiKey) throw new Error("SMITHERY_API_KEY not set");
    
    try {
      // Create Smithery transport
      const transport = createTransport(
        "https://server.smithery.ai/browserbase",
        {},
        apiKey
      );
      
      // Map actions to appropriate Browserbase tools
      let toolName = "";
      let params = {};
      
      switch (action) {
        case "navigate":
          toolName = "navigate";
          params = { url, waitForSelector };
          break;
        case "screenshot":
          toolName = "screenshot";
          params = { waitForSelector };
          break;
        case "extract":
          toolName = "extract-page-content";
          params = { waitForSelector };
          break;
        case "click":
          toolName = "click";
          params = { selector, waitForSelector };
          break;
        case "type":
          toolName = "type";
          params = { selector, text, waitForSelector };
          break;
      }
      
      // Call the appropriate Browserbase tool
      const response = await transport.callTool(toolName, params);
      
      return { content: [{ type: "text", text: JSON.stringify(response, null, 2) }] };
    } catch (error) {
      throw new Error(`Smithery API error: ${error.message}`);
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
