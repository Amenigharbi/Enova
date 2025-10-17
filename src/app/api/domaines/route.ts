import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

// Créer une instance Prisma
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';

    console.log('🔍 Fetching domains from database...');

    // Récupérer les domaines avec le count des robots
    const domains = await prisma.domain.findMany({
      include: {
        _count: {
          select: { robots: true }
        }
      },
      orderBy: sortBy === 'robotCount' 
        ? { robots: { _count: 'desc' } }
        : sortBy === 'createdAt'
        ? { createdAt: 'desc' }
        : { name: 'asc' }
    });

    console.log(`✅ Found ${domains.length} domains`);

    // Fonction helper pour les icônes
    const getDomainIcon = (domainName: string): string => {
      const icons: { [key: string]: string } = {
        'industrie': '🏭',
        'indoor': '🏢',
        'Outdoor': '🌳',
        '4.0': '🏭'
      };
      
      const lowerName = domainName.toLowerCase();
      for (const [key, icon] of Object.entries(icons)) {
        if (lowerName.includes(key)) {
          return icon;
        }
      }
      
      return '🔧';
    };

    // Transformer les données pour inclure robotCount
    const domainsWithCount = domains.map(domain => ({
      id: domain.id,
      name: domain.name,
      description: domain.description || '',
      slug: domain.slug,
      icon: getDomainIcon(domain.name),
      robotCount: domain._count.robots,
      createdAt: domain.createdAt
    }));

    return NextResponse.json(domainsWithCount);

  } catch (error) {
    console.error('❌ Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}