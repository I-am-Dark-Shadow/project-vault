import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';

export function ConfirmDeleteDialog({ isOpen, onOpenChange, project }) {
  const { deleteProject, isDeleting } = useProjects();

  const handleDelete = async () => {
    if (!project) return;

    const promise = deleteProject(project._id);

    toast.promise(promise, {
      loading: `Deleting ${project.name}...`,
      success: (data) => {
        onOpenChange(false); // Close modal on success
        return data.message || 'Project deleted successfully.';
      },
      error: (err) => {
        return err.message || 'Failed to delete project.';
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="h-11 w-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <TriangleAlert className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <DialogTitle className="text-lg">Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </div>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-white/70">
            This will permanently delete the project <strong className="font-semibold text-white/90">"{project?.name}"</strong> and remove its associated files from storage.
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/80 hover:bg-red-500/100 border border-red-400/20 hover:border-red-400/40 text-red-50"
          >
            {isDeleting && <LoaderCircle className="w-4.5 h-4.5 mr-2 animate-spin" />}
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}