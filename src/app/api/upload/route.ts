import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Žádný soubor nebyl nahrán' }, { status: 400 });
    }

    // Kontrola typu souboru
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Povolené jsou pouze obrázky' }, { status: 400 });
    }

    // Kontrola velikosti souboru (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Soubor je příliš velký. Maximální velikost je 5MB' }, { status: 400 });
    }

    // Vytvoření unikátního názvu souboru
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const fileName = `uploaded_${timestamp}${extension}`;
    
    // Cesta k složce public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    
    // Vytvoření složky, pokud neexistuje
    await mkdir(uploadDir, { recursive: true });
    
    // Uložení souboru
    await writeFile(filePath, buffer);
    
    // Vrácení URL k nahránému souboru
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName 
    });
    
  } catch (error) {
    console.error('Chyba při nahrávání souboru:', error);
    return NextResponse.json({ error: 'Chyba při nahrávání souboru' }, { status: 500 });
  }
} 