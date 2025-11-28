# ---------------------------
# Create project backend structure
# ---------------------------

Write-Host "Creating backend folders and files..." -ForegroundColor Cyan

# Server root
New-Item -ItemType Directory -Force -Path "server" | Out-Null

# DB folder
New-Item -ItemType Directory -Force -Path "server/db" | Out-Null
New-Item -ItemType File -Force -Path "server/db/client.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/db/schema.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/db/indexes.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/db/seed.ts" | Out-Null

# Services folder
New-Item -ItemType Directory -Force -Path "server/services" | Out-Null
New-Item -ItemType File -Force -Path "server/services/document.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/chunking.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/extract.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/embedding.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/query-embed.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/search.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/rag.service.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/services/chat.service.ts" | Out-Null

# Utils folder
New-Item -ItemType Directory -Force -Path "server/utils" | Out-Null
New-Item -ItemType File -Force -Path "server/utils/chunkText.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/utils/extractText.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/utils/formatPrompt.ts" | Out-Null
New-Item -ItemType File -Force -Path "server/utils/logger.ts" | Out-Null

# lib folder
New-Item -ItemType Directory -Force -Path "lib" | Out-Null
New-Item -ItemType File -Force -Path "lib/api.ts" | Out-Null

# types folder
New-Item -ItemType Directory -Force -Path "types" | Out-Null
New-Item -ItemType File -Force -Path "types/document.ts" | Out-Null
New-Item -ItemType File -Force -Path "types/embedding.ts" | Out-Null
New-Item -ItemType File -Force -Path "types/search.ts" | Out-Null
New-Item -ItemType File -Force -Path "types/chat.ts" | Out-Null
New-Item -ItemType File -Force -Path "types/rag.ts" | Out-Null

Write-Host "Project structure created successfully!" -ForegroundColor Green
