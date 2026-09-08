"use client";
import { useAuth } from "../providers/AuthProvider";

interface UsageBarProps {
  percentage: number;
  color: "purple" | "green" | "yellow";
  totalBars?: number;
  mobileBars?: number;
}

function UsageBar({ percentage, color, totalBars = 38, mobileBars = 24 }: UsageBarProps) {
  const colorMap = {
    purple: "#7d52f4",
    green: "#22d3bb",
    yellow: "#f6b51e",
  };

  const activeColor = colorMap[color];
  return (
    <>
      {/* Desktop version */}
      <div className="hidden md:flex gap-[3px] items-center">
        {Array.from({ length: totalBars }).map((_, idx) => (
          <div
            key={idx}
            className="h-3 w-1 rounded-[0.8px]"
            style={{
              backgroundColor: idx < Math.round((percentage / 100) * totalBars) ? activeColor : "#ebebeb"
            }}
          />
        ))}
      </div>
      {/* Mobile version - fewer bars */}
      <div className="flex md:hidden gap-[3px] items-center flex-1">
        {Array.from({ length: mobileBars }).map((_, idx) => (
          <div
            key={idx}
            className="h-3 w-1 rounded-[0.8px]"
            style={{
              backgroundColor: idx < Math.round((percentage / 100) * mobileBars) ? activeColor : "#ebebeb"
            }}
          />
        ))}
      </div>
    </>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="flex items-center justify-between md:justify-start gap-3">
      <span className="md:w-[200px] text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
        {label}
      </span>
      <span className="md:flex-1 text-[13.5px] text-[#171717] tracking-[-0.084px]">
        {value}
      </span>
    </div>
  );
}

interface ActivityItemProps {
  label: string;
  value: string;
}

function ActivityItem({ label, value }: ActivityItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
        {label}
      </span>
      <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
        {value}
      </span>
    </div>
  );
}

interface UsageItemProps {
  label: string;
  percentage: number;
  color: "purple" | "green" | "yellow";
}

function UsageItem({ label, percentage, color }: UsageItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[100px] md:w-[200px] shrink-0 text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
        {label}
      </span>
      <UsageBar percentage={percentage} color={color} />
      <span className="shrink-0 text-xs text-[#a3a3a3]">
        {percentage}%
      </span>
    </div>
  );
}

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-start">
      <div className="flex flex-col gap-1 md:w-[300px] shrink-0">
        <span className="text-[13.5px] font-medium text-[#171717] tracking-[-0.084px]">
          {title}
        </span>
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {description}
        </span>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export function WorkspaceOverview() {
    const {user} = useAuth();
  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Overview Section */}
      <Section title="Overview" description="Workspace summary and details.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Profile Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Avatar and Info */}
            <div className="flex items-center gap-3 flex-1">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ebebeb]">
                <span className="text-base text-[#171717] tracking-[-0.176px]">JB</span>
              </div>
              {/* Name & Email */}
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="text-[13.5px] font-medium text-[#171717] tracking-[-0.084px]">
                    {user?.name || "James Brown"}
                  </span>
                  <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
                    ({user?.email || "james@gmail.com"})
                  </span>
                </div>
                <span className="text-xs text-[#a3a3a3]">
                  Member since <span className="text-[#5c5c5c]">May 16, 2025</span>
                </span>
              </div>
            </div>
            {/* Manage Button */}
            <button
              className="flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors w-[300px] sm:w-auto self-end sm:self-auto"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
              }}
            >
              <span className="px-1">Manage</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Details */}
          <div className="flex flex-col gap-3 md:gap-3.5">
            <DetailItem label="Workspace" value="Spectrum™" />
            <DetailItem label="Your role" value="Admin" />
            <DetailItem label="Team members" value="3/10 seats" />
            <DetailItem label="Plan renewal" value="June 20, 2025" />
          </div>
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Activity Section */}
      <Section title="Activity" description="Usage analytics and metrics.">
        <div className="grid grid-cols-2  gap-y-3 max-w-[420px]">
          <ActivityItem label="Conversations" value="2,847" />
          <ActivityItem label="Active projects" value="%59" />
          <ActivityItem label="File uploaded" value="156" />
          <ActivityItem label="Storage used" value="%24" />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Plan Usage Section */}
      <Section title="Plan usage" description="Subscription limits and usage.">
        <div className="flex flex-col gap-3 md:gap-3.5">
          <UsageItem label="Team seats" percentage={60} color="purple" />
          <UsageItem label="Storage" percentage={8} color="green" />
          <UsageItem label="API" percentage={25} color="yellow" />
        </div>
      </Section>
    </div>
  );
}
