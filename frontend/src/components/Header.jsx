import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User, Menu, FolderPlus } from 'lucide-react';

export function Header({ onAddProjectClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddProject = () => {
    setIsMenuOpen(false);
    onAddProjectClick();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0f1117]/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] group-hover:border-white/20 transition-all duration-300 ease-in-out">
              <img src="/logo.png" className="w-7 h-7 text-cyan-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight leading-none">Project Vault</span>
              <span className="text-[11px] text-white/50 leading-none mt-1">Secure. Simple. Fast.</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="gradient" onClick={onAddProjectClick}>
              <Plus className="w-4.5 h-4.5 mr-2" />
              Add Project
            </Button>
            {/* <Button variant="ghost" size="icon" className="ml-1 h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20">
              <User className="w-5 h-5 text-white/80" />
            </Button> */}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="gradient" size="icon" onClick={onAddProjectClick}>
              <Plus className="w-4.5 h-4.5" />
              <span className="sr-only">Add Project</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-white/80" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5">
          <div className="px-4 py-3 space-y-2 bg-[#0f1117]/80 backdrop-blur-xl">
            <Button
              variant="gradient"
              className="w-full justify-start gap-2"
              onClick={handleAddProject}
            >
              <FolderPlus className="w-4.5 h-4.5" />
              Add Project
            </Button>
            {/* <Button variant="outline" className="w-full justify-start gap-2">
              <User className="w-4.5 h-4.5" />
              Profile
            </Button> */}
          </div>
        </div>
      )}
    </header>
  );
}