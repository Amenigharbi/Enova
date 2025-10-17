import { NextResponse } from 'next/server';

interface Params {
  params: {
    repo: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { repo } = params;
    const decodedRepo = decodeURIComponent(repo);

    console.log(`🔍 Fetching GitHub repo: ${decodedRepo}`);

    if (!decodedRepo.includes('/')) {
      return NextResponse.json(
        { error: 'Format de repository invalide' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'EnovaRobotics-Platform',
    };

    // Ajouter le token d'authentification si disponible
    if (process.env.GITHUB_ACCESS_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
    }

    const githubUrl = `https://api.github.com/repos/${decodedRepo}/contents`;

    const response = await fetch(githubUrl, { headers });

    if (!response.ok) {
      // Gestion des erreurs spécifiques
      switch (response.status) {
        case 404:
          return NextResponse.json(
            { error: 'Repository GitHub non trouvé' },
            { status: 404 }
          );
        case 403:
          return NextResponse.json(
            { error: 'Accès refusé - Repository privé ou limite API dépassée' },
            { status: 403 }
          );
        case 401:
          return NextResponse.json(
            { error: 'Authentification requise' },
            { status: 401 }
          );
        default:
          throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    const data = await response.json();

    // Formater la réponse
    const files = Array.isArray(data) ? data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      download_url: item.download_url,
      size: item.size,
      html_url: item.html_url
    })) : [];

    console.log(`✅ Found ${files.length} files in repository`);

    return NextResponse.json(files);

  } catch (error) {
    console.error('❌ Error fetching GitHub repo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données GitHub' },
      { status: 500 }
    );
  }
}