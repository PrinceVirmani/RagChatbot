"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProjectHeader } from "../_components/project/ProjectHeader";
import { ProjectSearchBar } from "../_components/project/ProjectSearchBar";
import { ProjectList, Project } from "../_components/project/ProjectList";
import { CreateProjectDialog } from "../_components/project/CreateProjectDialog";
import { useMobileHeader } from "../_components/MobileHeaderContext";

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Research & Analysis",
    description: "User research insights & data analysis",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "2",
    title: "Web Search",
    description: "Search functionality and SEO optimization",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "3",
    title: "API Documentation",
    description: "Rest API documentation and examples",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "4",
    title: "Feature Overview",
    description: "Product feature planning and specifications",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "5",
    title: "Knowledge Base",
    description: "Key tips for effective project management",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "6",
    title: "User Guide",
    description: "User onboarding and guide creation",
    updatedAt: "Updated 12 days ago",
  },
];

export default function ProjectPage() {
  const router = useRouter();
  const { setRightElement } = useMobileHeader();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredProjects = MOCK_PROJECTS.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateProjectSubmit = (projectName: string) => {
    console.log("Creating project:", projectName);
    // TODO: Add project creation logic
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/project/${project.id}`);
  };

  useEffect(() => {
    setRightElement(
      <button
        onClick={handleCreateProject}
        className="flex items-center gap-[2px] px-3 py-1.5 rounded-[10px] bg-[#262626] hover:bg-[#333333] transition-colors text-white text-sm font-medium"
      >
        <Image src="/project/add-icon.svg" alt="Add" width={16} height={16} />
        <span>Create project</span>
      </button>
    );

    return () => setRightElement(null);
  }, [handleCreateProject, setRightElement]);

  return (
    <>
      <main className="flex-1 p-[6px] overflow-hidden h-full">
        <div className="h-full bg-white rounded-[24px] border border-[#EBEBEB] overflow-auto max-sm:bg-transparent max-sm:border-0 max-sm:rounded-none">
          <div className="flex flex-col items-center px-8 py-16 max-sm:px-4 max-sm:py-8">
            <div className="w-full max-w-[700px] flex flex-col gap-6 max-sm:max-w-none">
              <ProjectHeader onCreateProject={handleCreateProject} />
              <ProjectSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <ProjectList
                projects={filteredProjects}
                onProjectClick={handleProjectClick}
              />
            </div>
          </div>
        </div>
      </main>

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateProject={handleCreateProjectSubmit}
      />
    </>
  );
}
