'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file uploaded' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  // Sanitize filename to remove special characters
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
  const filename = `${Date.now()}-${sanitizedFilename}`;
  
  // Ensure uploads directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  try {
      await mkdir(uploadDir, { recursive: true });
  } catch (e) {
      // Directory might already exist
  }
  
  const filepath = join(uploadDir, filename);

  try {
    await writeFile(filepath, buffer);
    return { url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload image' };
  }
}
