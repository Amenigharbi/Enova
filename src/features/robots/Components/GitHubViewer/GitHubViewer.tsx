"use client";

interface GitHubViewerProps {
  githubRepo: string;
  robotName: string;
}

export const GitHubViewer = ({ githubRepo, robotName }: GitHubViewerProps) => {
  const githubUrl = `https://github.com/${githubRepo}`;

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h3 className="font-semibold text-gray-900 mb-4">Documentation GitHub</h3>
      
      <div className="flex items-center justify-between">
        <div>
          <code className="bg-gray-100 px-3 py-2 rounded border text-sm">
            {githubRepo}
          </code>
        </div>
        
        <a 
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Accéder à GitHub
        </a>
      </div>
    </div>
  );
};