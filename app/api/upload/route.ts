import { supabase } from '@/lib/supabase';
import { addDocumentRecord } from '@/lib/supabase-insert';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File;
  const service = form.get('service') as string;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Invalid file upload' }, { status: 400 });
  }

  const filePath = `uploads/${Date.now()}-${file.name}`;

  const { data: supabaseData, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('SUPABASE ERROR:', error);
    return NextResponse.json({ error }, { status: 500 });
  }

  const concatPath = `https://kklnyiejpkwoqozxgzlu.supabase.co/storage/v1/object/public/documents/${supabaseData.path}`;

  const { data, error: insertError } = await addDocumentRecord({
    fileName: file.name,
    filePath: concatPath,
    fileType: file.type,
    fileSize: file.size.toString(),
    service,
  });

  if (insertError) {
    console.error('SUPABASE INSERT ERROR:', error);
    return NextResponse.json({ insertError }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
