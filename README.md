```
src/
 ├── app/
 │    ├── api/
 │    │     ├── upload/route.ts          <-- Upload API (Kelly)
 │    │     ├── chat/route.ts            <-- Chat API (Kelly)
 │    │     └── health/route.ts          <-- Optional ping endpoint (Kelly)
 │    │
 │    ├── admin/
 │    │      └── upload/page.tsx         <-- Admin UI for uploads but we will automate this in the final project (Kelly)
 │    │
 │    └── chat
 │          ├── page.tsx                 <-- main citizen chat UI (Elion)
 │          ├── result/page.tsx          <-- answer display (Elion)
 │          └── components/              <-- UI components (Elion)
 │
 ├── server/                              <-- ALL backend logic
 │    ├── db/
 │    │     ├── client.ts                <-- MongoDB client (Celine)
 │    │     ├── schema.ts                <-- Collections schemas (Celine)
 │    │     ├── indexes.ts               <-- Vector index setup (Celine)
 │    │     └── seed.ts                  <-- Optional: seed admin/user (Celine)
 │    │
 │    ├── services/
 │    │     ├── document.service.ts      <-- Upload → extract → chunk → embed (Clement / Kosir / Kelly)
 │    │     ├── chunking.service.ts      <-- Chunking logic (Clement/Kosir)
 │    │     ├── extract.service.ts       <-- PDF/doc text extraction (Clement/Kosir)
 │    │     ├── embedding.service.ts     <-- Embedding generator (Clement/Kosir)
 │    │     ├── query-embed.service.ts   <-- Embedding user queries (Clement/Kosir)
 │    │     ├── search.service.ts        <-- Vector search logic (Celine)
 │    │     ├── rag.service.ts           <-- Full RAG engine (Clement/Kosir)
 │    │     └── chat.service.ts          <-- LLM final answer logic (Kelly)
 │    │
 │    └── utils/
 │          ├── chunkText.ts             <-- Util for chunking (Clement/Kosir)
 │          ├── extractText.ts           <-- Util for PDF extraction (Clement/Kosir)
 │          ├── formatPrompt.ts          <-- Prompt formatting (Kelly)
 │          └── logger.ts                <-- Simple logging for QA (Kelly)
 │
 ├── lib/
 │    └── api.ts                         <-- fetch wrappers (Elion / Kelly)
 │
 └── types/                               <-- TS interfaces for teamwork safety (ALL)
       ├── document.ts                    <-- Uploaded docs, chunks
       ├── embedding.ts                   <-- Embedding responses
       ├── search.ts                      <-- Vector search output
       ├── chat.ts                        <-- Chat request/response types
       └── rag.ts                         <-- RAG pipeline types

```
