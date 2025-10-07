import React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox, Plus } from 'lucide-react';

export function EmptyState({ onAddProjectClick }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
        <Inbox className="w-7 h-7 text-white/70" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">No projects Available</h3>
      <p className="text-white/60 text-sm mt-1.5">Get started by uploading your first project.</p>
      {/* <Button
        variant="gradient"
        className="mt-6"
        onClick={onAddProjectClick}
      >
        <Plus className="w-4.5 h-4.5 mr-2" />
        Add Project
      </Button> */}
    </div>
  );
}