import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileArchive, UploadCloud, LoaderCircle, ArrowUpCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';

export function AddProjectModal({ isOpen, onOpenChange }) {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const { addProject, isAdding } = useProjects();

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setFileError('');
    if (fileRejections.length > 0) {
      setFile(null);
      setFileError(fileRejections[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] },
    maxSize: 200 * 1024 * 1024, // 200 MB
    multiple: false,
  });

  const resetForm = () => {
    setProjectName('');
    setProjectDesc('');
    setFile(null);
    setFileError('');
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFileError('Please select a .zip file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('name', projectName.trim() || 'Untitled Project');
    formData.append('description', projectDesc.trim());
    formData.append('projectFile', file);

    const promise = addProject(formData);

    toast.promise(promise, {
      loading: 'Uploading your project...',
      success: (data) => {
        handleOpenChange(false); // Close modal on success
        return `${data.name} has been added to the vault.`;
      },
      error: (err) => {
        return err.message || 'An unexpected error occurred.';
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="h-11 w-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0">
              <FileArchive className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <DialogTitle className="text-lg">Add New Project</DialogTitle>
            <DialogDescription>Upload a .zip archive with its details.</DialogDescription>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label htmlFor="projectName" className="block text-sm text-white/70 mb-1.5">Project name</label>
            <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Your project name" />
          </div>
          <div>
            <label htmlFor="projectDesc" className="block text-sm text-white/70 mb-1.5">Description</label>
            <Input
              id="projectDesc"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="A short summary of the project (max 2 lines on cards)"
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/20 outline-none px-3.5 py-2.5 text-sm placeholder:text-white/30 transition-all duration-300 ease-in-out"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Upload .zip</label>
            <div {...getRootProps()} className={`group relative rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-400/40 bg-white/[0.03] p-5 transition-all duration-300 ease-in-out text-center cursor-pointer ${isDragActive ? 'border-cyan-400/40 bg-cyan-400/5' : ''}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2 text-white/80">
                <div className="h-12 w-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:border-cyan-400/30 group-hover:bg-cyan-400/5 transition-all">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {isDragActive ?
                  <p>Drop the file here ...</p> :
                  <p className="text-sm">Drag & drop a .zip file here, or click to select</p>
                }
                <p className="text-xs text-white/50">Max file size: 200MB</p>
              </div>
            </div>
            {file && <p id="fileName" className="text-xs text-white/70 mt-2 text-center">{file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB</p>}
            {fileError && <p className="text-sm text-red-400 mt-2 text-center">{fileError}</p>}
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="gradient" disabled={isAdding || !file}>
              {isAdding ? (
                <>
                  <LoaderCircle className="w-4.5 h-4.5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4.5 h-4.5 mr-2" />
                  Upload Project
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}