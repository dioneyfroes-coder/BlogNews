import dbConnect from '@/lib/mongodb';
import About from '@/models/About';
import { SanitizationService } from '@/lib/sanitization';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const about = await About.findOne({});
    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const {
      title = '',
      text = '',
      imageURL = '',
      phone = '',
      whatsapp = '',
      address = '',
      email = '',
      socialLinks = [],
    } = body;

    const sanitizedData = SanitizationService.sanitizeUserData({
      title,
      text,
      imageURL,
      phone,
      whatsapp,
      address,
      email,
      socialLinks: socialLinks.map((link: any) => (typeof link === 'string' ? link.trim() : ''))
    });

    // Validação adicional de URL de imagem
    if (sanitizedData.imageURL) {
      sanitizedData.imageURL = SanitizationService.sanitizeUrl(sanitizedData.imageURL) || '';
    }

    // Sanitização específica para links sociais
    sanitizedData.socialLinks = sanitizedData.socialLinks
      .map((link: string) => SanitizationService.sanitizeUrl(link))
      .filter((link: string | null) => link !== null);

    const result = await About.create(sanitizedData);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Failed to save data:', error);
    return NextResponse.json({ success: false, message: 'Failed to save data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const {
      title = '',
      text = '',
      imageURL = '',
      phone = '',
      whatsapp = '',
      address = '',
      email = '',
      socialLinks = [],
    } = body;

    const sanitizedData = SanitizationService.sanitizeUserData({
      title,
      text,
      imageURL,
      phone,
      whatsapp,
      address,
      email,
      socialLinks: socialLinks.map((link: any) => (typeof link === 'string' ? link.trim() : ''))
    });

    // Validação adicional de URL de imagem
    if (sanitizedData.imageURL) {
      sanitizedData.imageURL = SanitizationService.sanitizeUrl(sanitizedData.imageURL) || '';
    }

    // Sanitização específica para links sociais
    sanitizedData.socialLinks = sanitizedData.socialLinks
      .map((link: string) => SanitizationService.sanitizeUrl(link))
      .filter((link: string | null) => link !== null);

    const result = await About.findOneAndUpdate({}, sanitizedData, { new: true, upsert: true });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to save data:', error);
    return NextResponse.json({ success: false, message: 'Failed to save data' }, { status: 500 });
  }
}
