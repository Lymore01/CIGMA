import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt", ".text"];

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType =
      allowedTypes.includes(file.type) ||
      allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, Word, and Text files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // TODO: Here you would typically:
    // 1. Save the file to storage (local filesystem, S3, etc.)
    // 2. Extract text from the file using extract.service.ts
    // 3. Chunk the text using chunking.service.ts
    // 4. Generate embeddings using embedding.service.ts
    // 5. Store in MongoDB using document.service.ts

    // For now, return a success response with a mock document ID
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
