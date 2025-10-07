import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/EmptyState';
import { AddProjectModal } from '@/components/AddProjectModal';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { LoaderCircle, Filter, SortDesc, Vault } from 'lucide-react';

function App() {
    const { projects, isLoading, error } = useProjects();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <LoaderCircle className="w-8 h-8 text-white/70 animate-spin" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20 text-red-400">
                    <h3 className="text-lg font-semibold">Failed to load projects</h3>
                    <p className="text-sm text-red-400/80">{error.message}</p>
                </div>
            );
        }

        if (projects.length === 0) {
            return <EmptyState onAddProjectClick={() => setIsAddModalOpen(true)} />;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project._id}
                        project={project}
                        onDeleteClick={handleDeleteClick}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-[#f1f1f1] selection:bg-cyan-500/20 selection:text-cyan-200 antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Header onAddProjectClick={() => setIsAddModalOpen(true)} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page heading */}
                <section className="mb-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">My Projects</h1>
                                {/* <Vault className="w-8 h-8 text-cyan-300" /> */}
                            </div>
                            <p className="text-sm text-white/60 mt-1">Upload, manage, and download your archived projects.</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2 text-sm">
                                <SortDesc className="w-4 h-4" /> Sort
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-sm">
                                <Filter className="w-4 h-4" /> Filter
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Projects Grid or Empty State */}
                <section>
                    {renderContent()}
                </section>
            </main>

            {/* Modals */}
            <AddProjectModal
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
            />
            <ConfirmDeleteDialog
                isOpen={!!projectToDelete}
                onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}
                project={projectToDelete}
            />
        </div>
    );
}

export default App;