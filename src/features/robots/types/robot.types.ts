export interface Robot {
  id: string;
  name: string;
  description: string;
  slug: string;
  githubRepo: string;
  domainId: string;
  
  // Spécifications techniques
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  os?: string;
  connectivity?: string;
  power?: string;
  weight?: string;
  dimensions?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface RobotWithDomain extends Robot {
  domain: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}