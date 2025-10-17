import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, slug, githubRepo, domainId, cpu, gpu, ram, storage, os, connectivity, power, weight, dimensions } = body;

    // Vérifier si le robot existe
    const existingRobot = await prisma.robot.findUnique({
      where: { id }
    });

    if (!existingRobot) {
      return NextResponse.json(
        { error: 'Robot non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le slug est déjà utilisé par un autre robot
    if (slug !== existingRobot.slug) {
      const slugExists = await prisma.robot.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Un robot avec ce slug existe déjà' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le robot
    const updatedRobot = await prisma.robot.update({
      where: { id },
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

    return NextResponse.json(updatedRobot);

  } catch (error) {
    console.error('❌ Error updating robot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // Vérifier si le robot existe
    const existingRobot = await prisma.robot.findUnique({
      where: { id }
    });

    if (!existingRobot) {
      return NextResponse.json(
        { error: 'Robot non trouvé' },
        { status: 404 }
      );
    }

    await prisma.robot.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Robot supprimé avec succès' });

  } catch (error) {
    console.error('❌ Error deleting robot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}