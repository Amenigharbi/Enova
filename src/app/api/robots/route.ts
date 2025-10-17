import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, slug, githubRepo, domainId, cpu, gpu, ram, storage, os, connectivity, power, weight, dimensions } = body;

    if (!name || !slug || !githubRepo || !domainId) {
      return NextResponse.json(
        { error: 'Nom, slug, repository GitHub et domaine sont obligatoires' },
        { status: 400 }
      );
    }

    const existingRobot = await prisma.robot.findUnique({
      where: { slug }
    });

    if (existingRobot) {
      return NextResponse.json(
        { error: 'Un robot avec ce slug existe déjà' },
        { status: 400 }
      );
    }

    const robot = await prisma.robot.create({
      data: {
        name,
        description,
        slug,
        githubRepo,
        domainId,
        cpu,
        gpu,
        ram,
        storage,
        os,
        connectivity,
        power,
        weight,
        dimensions
      },
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

    return NextResponse.json(robot, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating robot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}