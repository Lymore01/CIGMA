import { supabase } from '@/lib/supabase';
import { addDocumentRecord } from '@/lib/supabase-insert';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File;
    const service = form.get('service') as string;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid file upload' },
        { status: 400 }
      );
    }

    if (!service || service.trim() === '') {
      return NextResponse.json(
        { error: 'Service name is required' },
        { status: 400 }
      );
    }

    // Sanitize filename for Supabase storage (only alphanumeric, dots, dashes, underscores)
    const sanitizeFileName = (fileName: string): string => {
      return fileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_+|_+$/g, '');
    };

    const safeFileName = sanitizeFileName(file.name);
    const filePath = `uploads/${Date.now()}-${safeFileName}`;

    const { data: supabaseData, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('SUPABASE STORAGE ERROR:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const concatPath = `${supabaseUrl}/storage/v1/object/public/documents/${supabaseData.path}`;

    const { data, error: insertError } = await addDocumentRecord({
      fileName: file.name,
      filePath: concatPath,
      fileType: file.type,
      fileSize: file.size.toString(),
      service,
    });

    if (insertError) {
      console.error('SUPABASE INSERT ERROR:', insertError);
      return NextResponse.json(
        { error: insertError.message || 'Failed to save document record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error('Unexpected error in upload route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
