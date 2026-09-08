"use client";

import Image from "next/image";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";

export interface Project {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

interface ProjectListProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

type SortOption = "recent" | "name" | "oldest";

export function ProjectList({ projects, onProjectClick }: ProjectListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Recent activity" },
    { value: "name", label: "Name" },
    { value: "oldest", label: "Oldest first" },
  ];

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label;

  return (
    <div className="flex flex-col gap-4 w-full max-w-[700px]">
      <div className="flex items-center justify-between">
        <span className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3]">
          All projects ({projects.length})
        </span>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-[6px]"
          >
            <span className="text-[14px]  leading-5 tracking-[-0.084px] text-[#A3A3A3]">
              Sort by
            </span>
            <span className="text-[14px]  leading-5 tracking-[-0.084px] text-[#5C5C5C]">
              {currentSortLabel}
            </span>
            <Image
              src="/project/arrow-down.svg"
              alt="Sort"
              width={18}
              height={18}
              className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#EBEBEB] py-1 z-10 min-w-[150px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-[14px] font-medium leading-5 tracking-[-0.084px] hover:bg-[#F7F7F7] ${
                    sortBy === option.value ? "text-[#1DAF61]" : "text-[#5C5C5C]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 justify-items-center min-[750px]:grid-cols-2">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            updatedAt={project.updatedAt}
            onClick={() => onProjectClick?.(project)}
          />
        ))}
      </div>
    </div>
  );
}
