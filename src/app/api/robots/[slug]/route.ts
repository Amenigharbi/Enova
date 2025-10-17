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

    console.log(`🔍 Fetching robot with slug: ${slug}`);

    // Récupérer le robot avec son domaine ET toutes les nouvelles propriétés
    const robot = await prisma.robot.findUnique({
      where: { slug },
      include: {
        domain: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    if (!robot) {
      console.log(`❌ Robot not found with slug: ${slug}`);
      return NextResponse.json(
        { error: 'Robot non trouvé' },
        { status: 404 }
      );
    }

    console.log(`✅ Robot found: ${robot.name}`);

    // Transformer les données avec TOUTES les propriétés
    const robotWithDomain = {
      id: robot.id,
      name: robot.name,
      description: robot.description || '',
      slug: robot.slug,
      githubRepo: robot.githubRepo,
      domainId: robot.domainId,
      
      // Nouvelles propriétés techniques
      cpu: robot.cpu || null,
      gpu: robot.gpu || null,
      ram: robot.ram || null,
      storage: robot.storage || null,
      os: robot.os || null,
      connectivity: robot.connectivity || null,
      power: robot.power || null,
      weight: robot.weight || null,
      dimensions: robot.dimensions || null,
      
      createdAt: robot.createdAt,
      updatedAt: robot.updatedAt,
      domain: {
        id: robot.domain.id,
        name: robot.domain.name,
        slug: robot.domain.slug
      }
    };

    return NextResponse.json(robotWithDomain);

  } catch (error) {
    console.error('❌ Error fetching robot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}