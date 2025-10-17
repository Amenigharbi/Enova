import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    console.log(`🔍 Fetching robot with ID: ${id}`);

    const robot = await prisma.robot.findUnique({
      where: { id },
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
      return NextResponse.json(
        { error: 'Robot non trouvé' },
        { status: 404 }
      );
    }

    const robotWithDomain = {
      id: robot.id,
      name: robot.name,
      description: robot.description || '',
      slug: robot.slug,
      githubRepo: robot.githubRepo,
      domainId: robot.domainId,
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
    console.error('❌ Error fetching robot by ID:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}