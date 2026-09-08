"use client";

import { useState } from "react";
import Image from "next/image";

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5833 14.5833L17.5 17.5M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14.6667C4.31811 14.6667 1.33334 11.6819 1.33334 8C1.33334 4.3181 4.31811 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667ZM7.33534 10.6667L12.0493 5.95267L11.1067 5.01L7.33534 8.78133L5.44934 6.89533L4.50667 7.838L7.33534 10.6667Z" fill="#22C55E"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5.41667C10.4602 5.41667 10.8333 5.04357 10.8333 4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333C9.16667 5.04357 9.53976 5.41667 10 5.41667Z" fill="#A3A3A3"/>
    <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" fill="#A3A3A3"/>
    <path d="M10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167C10.8333 14.9564 10.4602 14.5833 10 14.5833C9.53976 14.5833 9.16667 14.9564 9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25Z" fill="#A3A3A3"/>
  </svg>
);

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

interface Invoice {
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

const INVOICES: Invoice[] = [
  { date: "April 15, 2024", amount: "$49", status: "Paid" },
  { date: "May 15, 2024", amount: "$49", status: "Paid" },
  { date: "Jun 15, 2024", amount: "$49", status: "Paid" },
  { date: "July 15, 2024", amount: "$49", status: "Paid" },
  { date: "Aug 15, 2024", amount: "$49", status: "Paid" },
];

interface InvoiceRowProps {
  invoice: Invoice;
}

function InvoiceRow({ invoice }: InvoiceRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Date */}
      <span className="w-[120px] sm:w-[200px] shrink-0 text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
        {invoice.date}
      </span>

      {/* Amount */}
      <span className="w-[50px] sm:w-[100px] shrink-0 text-[13.5px] text-[#171717] tracking-[-0.084px]">
        {invoice.amount}
      </span>

      {/* Status */}
      <div className="flex flex-1 items-center gap-1.5">
        <CheckCircleIcon />
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
          {invoice.status}
        </span>
      </div>

      {/* More Button */}
      <button className="p-0.5 rounded hover:bg-[#f7f7f7] transition-colors">
        <MoreIcon />
      </button>
    </div>
  );
}

export function BillingContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Current Plan Section */}
      <Section title="Current plan" description="Plan details and usage overview.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Plan Card Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Plan Icon, Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Plan Icon */}
              <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-[10px] bg-[#f0fdf4]">
                <Image src="/settings/professionalplan.svg" alt="Professional Plan" width={24} height={24} />
              </div>

              {/* Plan Info */}
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-medium text-[#171717] tracking-[-0.084px]">
                    Professional Plan
                  </span>
                  {/* Mobile price (desktop handled separately) */}
                  <div className="flex items-baseline gap-1 sm:hidden">
                    <span className="text-lg font-semibold text-[#171717]">$49</span>
                    <span className="text-[13.5px] text-[#a3a3a3]">/ month</span>
                  </div>
                </div>
                <span className="text-xs text-[#a3a3a3]">
                  Team plan for up to 10 members
                </span>
              </div>
            </div>

            {/* Mobile: Manage button full-width under plan */}
            <div className="sm:hidden mt-2">
              <button
                className="w-[300px] ml-10 flex items-center justify-center px-4 py-1.5 rounded-xl border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
                style={{
                  boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
                }}
              >
                Manage
              </button>
            </div>

            {/* Desktop: Price and Manage aligned on the right */}
            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-[#171717]">$49</span>
                <span className="text-[13.5px] text-[#a3a3a3]">/ month</span>
              </div>

              <button
                className="flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
                style={{
                  boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
                }}
              >
                Manage
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Plan Details */}
          <div className="flex flex-col  gap-3 md:gap-3.5 mr-8">
            <DetailItem label="Used seats" value="3/10 seats" />
            <DetailItem label="Plan renewal" value="June 20, 2025" />
            <DetailItem label="Status" value="Active" />
            <DetailItem label="Active today" value="3 members" />
          </div>
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Billing History Section */}
      <Section title="Billing history" description="Invoice history and payments.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Filter Row */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div
              className="flex flex-1 items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-white"
              style={{
                boxShadow: "0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[13.5px] text-[#171717] placeholder-[#a3a3a3] tracking-[-0.084px] outline-none"
              />
            </div>

            {/* Status Filter */}
            <button
              className="shrink-0 flex items-center justify-center gap-1 pl-3 pr-2 py-1.5 rounded-[10px] bg-white"
              style={{
                boxShadow: "0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
              }}
            >
              <span className="text-[13.5px] text-[#5c5c5c] tracking-[-0.084px]">
                {statusFilter}
              </span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Invoice List */}
          <div className="flex flex-col gap-4 md:gap-5">
            {INVOICES.map((invoice, idx) => (
              <InvoiceRow key={idx} invoice={invoice} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
