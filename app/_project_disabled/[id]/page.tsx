"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProjectDetailHeader } from "@/app/_components/project/ProjectDetailHeader";
import { ProjectDetailInfo } from "@/app/_components/project/ProjectDetailInfo";
import { ProjectActionsCards } from "@/app/_components/project/ProjectActionsCards";
import { ProjectChatsSection } from "@/app/_components/project/ProjectChatsSection";
import { ProjectFilesDialog } from "@/app/_components/project/ProjectFilesDialog";
import { InstructionsDialog } from "@/app/_components/project/InstructionsDialog";
import ChatInput from "@/app/_components/chat/ChatInput";
import { useMobileHeader } from "@/app/_components/MobileHeaderContext";

// Mock data for chat
const mockChats = [
  {
    id: "1",
    title: "UI Design Review",
    description: "Analyzing color schemes and layout adjustments.",
    time: "1:00 PM",
    iconColor: "gray" as const,
  },
  {
    id: "2",
    title: "User Testing Feedback",
    description: "Gathering insights from recent usability tests.",
    time: "2:00 PM",
    iconColor: "green" as const,
  },
  {
    id: "3",
    title: "Accessibility Standards",
    description: "Reviewing WCAG compliance for the current project.",
    time: "3:15 PM",
    iconColor: "gray" as const,
  },
  {
    id: "4",
    title: "Marketing Strategies",
    description: "Discussing approaches for launch campaigns.",
    time: "4:00 PM",
    iconColor: "gray" as const,
  },
  {
    id: "5",
    title: "Feature Roadmap Planning",
    description: "Prioritizing features for the next quarter.",
    time: "5:30 PM",
    iconColor: "gray" as const,
  },
];

// Mock data for files
const mockFiles = [
  { id: "1", type: "excel" as const },
  { id: "2", type: "word" as const },
  { id: "3", type: "pdf" as const },
];

// Mock data - in a real app, this would come from an API/database
const MOCK_PROJECTS: Record<string, { title: string; description: string }> = {
  "1": {
    title: "Research & Analysis",
    description: "User research insights & data analysis",
  },
  "2": {
    title: "Web Search",
    description: "Search functionality and SEO optimization",
  },
  "3": {
    title: "API Documentation",
    description: "Rest API documentation and examples",
  },
  "4": {
    title: "Feature Overview",
    description: "Product feature planning and specifications",
  },
  "5": {
    title: "Knowledge Base",
    description: "Key tips for effective project management",
  },
  "6": {
    title: "User Guide",
    description: "User onboarding and guide creation",
  },
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const { setRightElement, setLeftElement } = useMobileHeader();
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false);
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = useState(false);

  const project = MOCK_PROJECTS[id] || {
    title: "Unknown Project",
    description: "Project not found",
  };

  // Set custom mobile header with "All projects" link and star/3-dot icons
  useEffect(() => {
    setLeftElement(
      <Link
        href="/project"
        className="flex items-center gap-2 text-[15px] font-normal leading-5 tracking-[-0.084px] text-[#5C5C5C] hover:text-[#171717] transition-colors"
      >
        <Image
          src="/project/arrow-left.svg"
          alt="Back to projects"
          width={14}
          height={9}
        />
        <span>All projects</span>
      </Link>
    );

    setRightElement(
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F7F7F7] transition-colors">
          <Image
            src="/project/star-icon.svg"
            alt="Star"
            width={20}
            height={20}
          />
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F7F7F7] transition-colors">
          <Image
            src="/project/three-dot-open.svg"
            alt="More options"
            width={3}
            height={13}
          />
        </button>
      </div>
    );

    return () => {
      setLeftElement(null);
      setRightElement(null);
    };
  }, [setLeftElement, setRightElement]);

  return (
    <>
      <main className="flex-1 flex flex-col h-full p-[6px] overflow-hidden max-sm:p-0">
        <div className="flex-1 bg-white rounded-[24px] border border-[#EBEBEB] flex flex-col overflow-hidden max-sm:bg-transparent max-sm:border-0 max-sm:rounded-none">
          {/* Header - All projects link */}
          <ProjectDetailHeader />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center pb-8">
              <div className="w-full max-w-[752px] flex flex-col gap-6">
                {/* Project Info - Icon, Title, Badge */}
                <ProjectDetailInfo title={project.title} />

                {/* Chat Input */}
                <div className="px-6">
                  <div className="w-full max-w-[700px] mx-auto">
                    <div className="relative z-10">
                      <ChatInput />
                    </div>
                    <div className="-mt-4">
                      <ProjectActionsCards
                        onProjectFilesClick={() => setIsFilesDialogOpen(true)}
                        onInstructionsClick={() => setIsInstructionsDialogOpen(true)}
                        hasChats={mockChats.length > 0}
                        files={mockFiles}
                        instructionsText="Respond in a friendly, professional, and co..."
                      />
                    </div>
                  </div>
                </div>

                {/* Chats in this project */}
                <ProjectChatsSection chats={mockChats} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Project Files Dialog */}
      <ProjectFilesDialog
        isOpen={isFilesDialogOpen}
        onClose={() => setIsFilesDialogOpen(false)}
        projectName={project.title}
        onSave={() => console.log("Save project files")}
      />

      {/* Instructions Dialog */}
      <InstructionsDialog
        isOpen={isInstructionsDialogOpen}
        onClose={() => setIsInstructionsDialogOpen(false)}
        onSave={(instructions) => console.log("Save instructions:", instructions)}
      />
    </>
  );
}
