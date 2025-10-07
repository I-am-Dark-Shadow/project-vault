import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderArchive, MoreHorizontal, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to format date strings
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// UPDATED helper to create a sanitized filename that ALWAYS ends with .zip
const sanitizeFilename = (name) => {
  if (!name) return 'download.zip';
  // Get the base name by removing the .zip extension if it exists
  const baseName = name.toLowerCase().endsWith('.zip') ? name.slice(0, -4) : name;
  // Sanitize, remove invalid characters, and limit length
  const sanitizedBase = baseName.replace(/[^\w._-]+/g, '_').slice(0, 64);
  // Return the sanitized name with the .zip extension guaranteed
  return `${sanitizedBase || 'project'}.zip`;
};

export function ProjectCard({ project, onDeleteClick }) {
  // A simple deterministic way to alternate icon colors
  const iconColor = project.name.length % 2 === 0 ? 'text-cyan-300' : 'text-violet-300';

  return (
    <article className="group relative rounded-2xl border border-white/8 bg-white/[0.035] hover:bg-white/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out overflow-hidden flex flex-col">
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(600px 180px at 0% 0%, rgba(0,180,216,0.06), transparent 60%), radial-gradient(600px 200px at 100% 0%, rgba(139,92,246,0.06), transparent 60%)'
        }}
      ></div>
      
      <div className="relative p-5 flex-grow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
              <FolderArchive className={cn("w-5 h-5", iconColor)} />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-base font-semibold tracking-tight truncate" title={project.name}>
                {project.name}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Uploaded <time dateTime={project.createdAt}>{formatDate(project.createdAt)}</time>
              </p>
            </div>
          </div>
          {/* <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20">
            <MoreHorizontal className="w-4.5 h-4.5 text-white/70" />
          </Button> */}
        </div>
        <p 
          className="text-[13px] text-white/70 mt-4 h-10"
          style={{
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="relative px-5 pb-5 mt-auto">
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <Button asChild variant="gradient" size="sm">
            <a href={project.fileUrl} download={sanitizeFilename(project.originalFileName)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-300 border-red-400/20 hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300"
            onClick={() => onDeleteClick(project)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}