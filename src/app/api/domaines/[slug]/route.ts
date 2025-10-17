import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = params;

    console.log(`🔍 Fetching domain with slug: ${slug}`);

    // Récupérer le domaine avec ses robots
    const domain = await prisma.domain.findUnique({
      where: { slug },
      include: {
        robots: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: { robots: true }
        }
      }
    });

    if (!domain) {
      return NextResponse.json(
        { error: 'Domaine non trouvé' },
        { status: 404 }
      );
    }

    // Fonction helper pour les icônes
    const getDomainIcon = (domainName: string): string => {
      const icons: { [key: string]: string } = {
        'industrie': '🏭',
        'indoor': '🏢',
        'outdoor': '🌳',
        'medical': '🏥',
        'logistique': '🚚',
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

    // Transformer les données
    const domainWithRobots = {
      id: domain.id,
      name: domain.name,
      description: domain.description || '',
      slug: domain.slug,
      icon: getDomainIcon(domain.name),
      robotCount: domain._count.robots,
      createdAt: domain.createdAt,
      robots: domain.robots.map(robot => ({
        id: robot.id,
        name: robot.name,
        description: robot.description || '',
        slug: robot.slug,
        githubRepo: robot.githubRepo,
        createdAt: robot.createdAt
      }))
    };

    return NextResponse.json(domainWithRobots);

  } catch (error) {
    console.error('❌ Error fetching domain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}