[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/dumpling-ai-mcp-server-dumplingai-badge.png)](https://mseep.ai/app/dumpling-ai-mcp-server-dumplingai)

# Dumpling AI MCP Server

A Model Context Protocol (MCP) server implementation that integrates with Dumpling AI for data scraping, content processing, knowledge management, AI agents, and code execution capabilities.

[![smithery badge](https://smithery.ai/badge/@Dumpling-AI/mcp-server-dumplingai)](https://smithery.ai/server/@Dumpling-AI/mcp-server-dumplingai)

## Features

- Complete integration with all Dumpling AI API endpoints
- Data APIs for YouTube transcripts, search, autocomplete, maps, places, news, and reviews
- Web scraping with support for scraping, crawling, screenshots, and structured data extraction
- Document conversion tools for text extraction, PDF operations, video processing
- Extract data from documents, images, audio, and video
- AI capabilities including agent completions, knowledge base management, and image generation
- Developer tools for running JavaScript and Python code in a secure environment
- Automatic error handling and detailed response formatting

## Installation

### Installing via Smithery

To install mcp-server-dumplingai for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@Dumpling-AI/mcp-server-dumplingai):

```bash
npx -y @smithery/cli install @Dumpling-AI/mcp-server-dumplingai --client claude
```

### Running with npx

```bash
env DUMPLING_API_KEY=your_api_key npx -y mcp-server-dumplingai
```

### Manual Installation

```bash
npm install -g mcp-server-dumplingai
```

### Running on Cursor

Configuring Cursor 🖥️ Note: Requires Cursor version 0.45.6+

To configure Dumpling AI MCP in Cursor:

1. Open Cursor Settings
2. Go to Features > MCP Servers
3. Click "+ Add New MCP Server"
4. Enter the following:

```
{
  "mcpServers": {
    "dumplingai": {
      "command": "npx",
      "args": ["-y", "mcp-server-dumplingai"],
      "env": {
        "DUMPLING_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

> If you are using Windows and are running into issues, try `cmd /c "set DUMPLING_API_KEY=your-api-key && npx -y mcp-server-dumplingai"`

Replace `your-api-key` with your Dumpling AI API key.

## Configuration

### Environment Variables

- `DUMPLING_API_KEY`: Your Dumpling AI API key (required)

## Available Tools

### Data APIs

#### 1. Get YouTube Transcript (`get-youtube-transcript`)

Extract transcripts from YouTube videos with optional timestamps.

```json
{
  "name": "get-youtube-transcript",
  "arguments": {
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "includeTimestamps": true,
    "timestampsToCombine": 3,
    "preferredLanguage": "en"
  }
}
```

#### 2. Search (`search`)

Perform Google web searches and optionally scrape content from results.

```json
{
  "name": "search",
  "arguments": {
    "query": "machine learning basics",
    "country": "us",
    "language": "en",
    "dateRange": "pastMonth",
    "scrapeResults": true,
    "numResultsToScrape": 3,
    "scrapeOptions": {
      "format": "markdown",
      "cleaned": true
    }
  }
}
```

#### 3. Get Autocomplete (`get-autocomplete`)

Get Google search autocomplete suggestions for a query.

```json
{
  "name": "get-autocomplete",
  "arguments": {
    "query": "how to learn",
    "country": "us",
    "language": "en",
    "location": "New York"
  }
}
```

#### 4. Search Maps (`search-maps`)

Search Google Maps for locations and businesses.

```json
{
  "name": "search-maps",
  "arguments": {
    "query": "coffee shops",
    "gpsPositionZoom": "37.7749,-122.4194,14z",
    "language": "en",
    "page": 1
  }
}
```

#### 5. Search Places (`search-places`)

Search for places with more detailed information.

```json
{
  "name": "search-places",
  "arguments": {
    "query": "hotels in paris",
    "country": "fr",
    "language": "en",
    "page": 1
  }
}
```

#### 6. Search News (`search-news`)

Search for news articles with customizable parameters.

```json
{
  "name": "search-news",
  "arguments": {
    "query": "climate change",
    "country": "us",
    "language": "en",
    "dateRange": "pastWeek"
  }
}
```

#### 7. Get Google Reviews (`get-google-reviews`)

Retrieve Google reviews for businesses or places.

```json
{
  "name": "get-google-reviews",
  "arguments": {
    "businessName": "Eiffel Tower",
    "location": "Paris, France",
    "limit": 10,
    "sortBy": "relevance"
  }
}
```

### Web Scraping

#### 8. Scrape (`scrape`)

Extract content from a web page with formatting options.

```json
{
  "name": "scrape",
  "arguments": {
    "url": "https://example.com",
    "format": "markdown",
    "cleaned": true,
    "renderJs": true
  }
}
```

#### 9. Crawl (`crawl`)

Recursively crawl websites and extract content with customizable parameters.

```json
{
  "name": "crawl",
  "arguments": {
    "baseUrl": "https://example.com",
    "maxPages": 10,
    "crawlBeyondBaseUrl": false,
    "depth": 2,
    "scrapeOptions": {
      "format": "markdown",
      "cleaned": true,
      "renderJs": true
    }
  }
}
```

#### 10. Screenshot (`screenshot`)

Capture screenshots of web pages with customizable viewport and format options.

```json
{
  "name": "screenshot",
  "arguments": {
    "url": "https://example.com",
    "width": 1280,
    "height": 800,
    "fullPage": true,
    "format": "png",
    "waitFor": 1000
  }
}
```

#### 11. Extract (`extract`)

Extract structured data from web pages using AI-powered instructions.

```json
{
  "name": "extract",
  "arguments": {
    "url": "https://example.com/products",
    "instructions": "Extract all product names, prices, and descriptions from this page",
    "schema": {
      "products": [
        {
          "name": "string",
          "price": "number",
          "description": "string"
        }
      ]
    },
    "renderJs": true
  }
}
```

### Document Conversion

#### 12. Doc to Text (`doc-to-text`)

Convert documents to plaintext with optional OCR.

```json
{
  "name": "doc-to-text",
  "arguments": {
    "url": "https://example.com/document.pdf",
    "options": {
      "ocr": true,
      "language": "en"
    }
  }
}
```

#### 13. Convert to PDF (`convert-to-pdf`)

Convert various file formats to PDF.

```json
{
  "name": "convert-to-pdf",
  "arguments": {
    "url": "https://example.com/document.docx",
    "format": "docx",
    "options": {
      "quality": 90,
      "pageSize": "A4",
      "margin": 10
    }
  }
}
```

#### 14. Merge PDFs (`merge-pdfs`)

Combine multiple PDFs into a single document.

```json
{
  "name": "merge-pdfs",
  "arguments": {
    "urls": ["https://example.com/doc1.pdf", "https://example.com/doc2.pdf"],
    "options": {
      "addPageNumbers": true,
      "addTableOfContents": true
    }
  }
}
```

#### 15. Trim Video (`trim-video`)

Extract a specific clip from a video.

```json
{
  "name": "trim-video",
  "arguments": {
    "url": "https://example.com/video.mp4",
    "startTime": 30,
    "endTime": 60,
    "output": "mp4",
    "options": {
      "quality": 720,
      "fps": 30
    }
  }
}
```

#### 16. Extract Document (`extract-document`)

Extract specific content from documents in various formats.

```json
{
  "name": "extract-document",
  "arguments": {
    "url": "https://example.com/document.pdf",
    "format": "structured",
    "options": {
      "ocr": true,
      "language": "en",
      "includeMetadata": true
    }
  }
}
```

#### 17. Extract Image (`extract-image`)

Extract text and information from images.

```json
{
  "name": "extract-image",
  "arguments": {
    "url": "https://example.com/image.jpg",
    "extractionType": "text",
    "options": {
      "language": "en",
      "detectOrientation": true
    }
  }
}
```

#### 18. Extract Audio (`extract-audio`)

Transcribe and extract information from audio files.

```json
{
  "name": "extract-audio",
  "arguments": {
    "url": "https://example.com/audio.mp3",
    "language": "en",
    "options": {
      "model": "enhanced",
      "speakerDiarization": true,
      "wordTimestamps": true
    }
  }
}
```

#### 19. Extract Video (`extract-video`)

Extract content from videos including transcripts, scenes, and objects.

```json
{
  "name": "extract-video",
  "arguments": {
    "url": "https://example.com/video.mp4",
    "extractionType": "transcript",
    "options": {
      "language": "en",
      "speakerDiarization": true
    }
  }
}
```

#### 20. Read PDF Metadata (`read-pdf-metadata`)

Extract metadata from PDF files.

```json
{
  "name": "read-pdf-metadata",
  "arguments": {
    "url": "https://example.com/document.pdf",
    "includeExtended": true
  }
}
```

#### 21. Write PDF Metadata (`write-pdf-metadata`)

Update metadata in PDF files.

```json
{
  "name": "write-pdf-metadata",
  "arguments": {
    "url": "https://example.com/document.pdf",
    "metadata": {
      "title": "New Title",
      "author": "John Doe",
      "keywords": ["keyword1", "keyword2"]
    }
  }
}
```

### AI

#### 22. Generate Agent Completion (`generate-agent-completion`)

Get AI agent completions with optional tool definitions.

```json
{
  "name": "generate-agent-completion",
  "arguments": {
    "prompt": "How can I improve my website's SEO?",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 500,
    "context": ["The website is an e-commerce store selling handmade crafts."]
  }
}
```

#### 23. Search Knowledge Base (`search-knowledge-base`)

Search a knowledge base for relevant information.

```json
{
  "name": "search-knowledge-base",
  "arguments": {
    "kbId": "kb_12345",
    "query": "How to optimize database performance",
    "limit": 5,
    "similarityThreshold": 0.7
  }
}
```

#### 24. Add to Knowledge Base (`add-to-knowledge-base`)

Add entries to a knowledge base.

```json
{
  "name": "add-to-knowledge-base",
  "arguments": {
    "kbId": "kb_12345",
    "entries": [
      {
        "text": "MongoDB is a document-based NoSQL database.",
        "metadata": {
          "source": "MongoDB documentation",
          "category": "databases"
        }
      }
    ],
    "upsert": true
  }
}
```

#### 25. Generate AI Image (`generate-ai-image`)

Generate images using AI models.

```json
{
  "name": "generate-ai-image",
  "arguments": {
    "prompt": "A futuristic city with flying cars and neon lights",
    "width": 1024,
    "height": 1024,
    "numImages": 1,
    "quality": "hd",
    "style": "photorealistic"
  }
}
```

#### 26. Generate Image (`generate-image`)

Generate images using various AI providers.

```json
{
  "name": "generate-image",
  "arguments": {
    "prompt": "A golden retriever in a meadow of wildflowers",
    "provider": "dalle",
    "width": 1024,
    "height": 1024,
    "numImages": 1
  }
}
```

### Developer Tools

#### 27. Run JavaScript Code (`run-js-code`)

Execute JavaScript code with optional dependencies.

```json
{
  "name": "run-js-code",
  "arguments": {
    "code": "const result = [1, 2, 3, 4].reduce((sum, num) => sum + num, 0); console.log(`Sum: ${result}`); return result;",
    "dependencies": {
      "lodash": "^4.17.21"
    },
    "timeout": 5000
  }
}
```

#### 28. Run Python Code (`run-python-code`)

Execute Python code with optional dependencies.

```json
{
  "name": "run-python-code",
  "arguments": {
    "code": "import numpy as np\narr = np.array([1, 2, 3, 4, 5])\nmean = np.mean(arr)\nprint(f'Mean: {mean}')\nreturn mean",
    "dependencies": ["numpy", "pandas"],
    "timeout": 10000,
    "saveOutputFiles": true
  }
}
```

## Error Handling

The server provides robust error handling:

- Detailed error messages with HTTP status codes
- API key validation
- Input validation using Zod schemas
- Network error handling with descriptive messages

Example error response:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Failed to fetch YouTube transcript: 404 Not Found"
    }
  ],
  "isError": true
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

```

## License

MIT License - see LICENSE file for details
