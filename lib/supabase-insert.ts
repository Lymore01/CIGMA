import { supabase } from './supabase';

export async function addDocumentRecord({
  fileName,
  filePath,
  fileType,
  fileSize,
  service,
}: {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: string;
  service: string;
}) {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      file_name: fileName,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      service: service,
    })
    .select()
    .single();

  if (error) {
    console.error('INSERT ERROR:', error);
    return { error };
  }

  return { data };
}
