import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Début du seeding...');

  await prisma.robot.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Création de l\'utilisateur...');
  const hashedPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.create({
    data: {
      username: 'user',
      password: hashedPassword,
      email: 'user@enova.com',
      name: 'Utilisateur Test',
      role: 'ADMIN'
    }
  });
  console.log('✅ Utilisateur créé:', user.username);

  console.log('🏷️ Création des domaines...');
  const domains = await prisma.domain.createMany({
    data: [
      {
        name: 'Industrie 4.0',
        slug: 'industrie-4-0',
        description: 'Robots pour l\'automatisation industrielle et les usines intelligentes'
      },
      {
        name: 'Indoor',
        slug: 'indoor',
        description: 'Robots conçus pour les environnements intérieurs et contrôlés'
      },
      {
        name: 'Outdoor',
        slug: 'outdoor',
        description: 'Robots adaptés aux environnements extérieurs et conditions variables'
      }
    ]
  });

  console.log('✅ Domaines créés');

  const allDomains = await prisma.domain.findMany();
  const domainMap = new Map();
  allDomains.forEach(domain => {
    domainMap.set(domain.slug, domain.id);
  });

  const robotsData = [
    {
      name: 'Robot Industriel AX-200',
      slug: 'robot-industriel-ax-200',
      description: 'Robot articulé 6 axes pour l\'assemblage industriel',
      githubRepo: 'enovarobotics/ax-200-software',
      domainId: domainMap.get('industrie-4-0'),
      cpu: 'Intel Core i7-1185G7',
      gpu: 'NVIDIA RTX A2000',
      ram: '32GB DDR4',
      storage: '1TB NVMe SSD',
      os: 'Ubuntu 20.04 LTS',
      connectivity: 'Ethernet, WiFi 6, Bluetooth 5.2',
      power: '48V DC, 500W',
      weight: '45kg',
      dimensions: '800x600x400mm'
    },
    {
      name: 'Automate CNC Pro',
      slug: 'automate-cnc-pro',
      description: 'Système automatisé pour usinage de précision',
      githubRepo: 'enovarobotics/cnc-pro-firmware',
      domainId: domainMap.get('industrie-4-0'),
      cpu: 'AMD Ryzen 7 5700G',
      gpu: 'Integrated Radeon Graphics',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      os: 'Windows 10 IoT',
      connectivity: 'Ethernet, RS-232, USB 3.0',
      power: '220V AC, 750W',
      weight: '28kg',
      dimensions: '600x500x300mm'
    },
    {
      name: 'Assistant Domestique HomeBot',
      slug: 'assistant-domestique-homebot',
      description: 'Robot assistant pour tâches ménagères et surveillance',
      githubRepo: 'enovarobotics/homebot-ai',
      domainId: domainMap.get('indoor'),
      cpu: 'ARM Cortex-A78',
      gpu: 'Mali-G78',
      ram: '8GB LPDDR5',
      storage: '128GB eMMC',
      os: 'Android 12',
      connectivity: 'WiFi 6, Bluetooth 5.1, Zigbee',
      power: 'Li-ion 24V, 6Ah',
      weight: '8.5kg',
      dimensions: '400x300x200mm'
    },
    {
      name: 'Drone Agricole AgroDrone',
      slug: 'drone-agricole-agrodrone',
      description: 'Drone autonome pour l\'agriculture de précision',
      githubRepo: 'enovarobotics/agrodrone-firmware',
      domainId: domainMap.get('outdoor')
    },
    {
      name: 'Robot d\'Inspection TerraBot',
      slug: 'robot-inspection-terrabot',
      description: 'Robot tout-terrain pour l\'inspection d\'infrastructures',
      githubRepo: 'enovarobotics/terrabot-control',
      domainId: domainMap.get('outdoor')
    },
  ];

  // Filtrer et valider les robots
  const validRobots = robotsData.filter(robot => {
    if (!robot.domainId) {
      console.warn(`⚠️ Robot "${robot.name}" ignoré - domaine non trouvé`);
      return false;
    }
    return true;
  });

  if (validRobots.length > 0) {
    await prisma.robot.createMany({
      data: validRobots as any
    });
    console.log(`✅ ${validRobots.length} robots créés`);
  } else {
    console.log('❌ Aucun robot valide à créer');
  }

  // Afficher un résumé
  const domainCount = await prisma.domain.count();
  const robotCount = await prisma.robot.count();
  const userCount = await prisma.user.count();

  console.log(`\n📊 Résumé final :`);
  console.log(`   - ${userCount} utilisateur créé`);
  console.log(`   - ${domainCount} domaines créés`);
  console.log(`   - ${robotCount} robots créés`);

  // Afficher les détails
  const domainsWithRobots = await prisma.domain.findMany({
    include: {
      _count: {
        select: { robots: true }
      },
      robots: {
        select: {
          name: true,
          slug: true
        }
      }
    }
  });

  console.log('\n📁 Domaines créés :');
  domainsWithRobots.forEach(domain => {
    console.log(`\n   ${domain.name} (${domain._count.robots} robots)`);
    domain.robots.forEach(robot => {
      console.log(`      🤖 ${robot.name}`);
    });
  });

  console.log('\n🔐 Informations de connexion :');
  console.log('   👤 Username: user');
  console.log('   🔑 Password: user123');
  console.log('   📧 Email: user@enova.com');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });