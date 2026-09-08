"use client";

// App Icons
const GoogleDriveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 3.33333L1.66667 11.6667H6.66667L11.6667 3.33333H6.66667Z" fill="#0066DA"/>
    <path d="M11.6667 3.33333L6.66667 11.6667H1.66667L3.33333 14.1667L8.33333 14.1667L13.3333 5.83333L11.6667 3.33333Z" fill="#00AC47"/>
    <path d="M8.33333 14.1667L6.66667 16.6667H16.6667L18.3333 14.1667H8.33333Z" fill="#EA4335"/>
    <path d="M13.3333 5.83333L8.33333 14.1667H18.3333L13.3333 5.83333Z" fill="#FFBA00"/>
  </svg>
);

const SlackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.58333 12.5C4.58333 13.4205 3.83714 14.1667 2.91667 14.1667C1.99619 14.1667 1.25 13.4205 1.25 12.5C1.25 11.5795 1.99619 10.8333 2.91667 10.8333H4.58333V12.5Z" fill="#E01E5A"/>
    <path d="M5.41667 12.5C5.41667 11.5795 6.16286 10.8333 7.08333 10.8333C8.00381 10.8333 8.75 11.5795 8.75 12.5V17.0833C8.75 18.0038 8.00381 18.75 7.08333 18.75C6.16286 18.75 5.41667 18.0038 5.41667 17.0833V12.5Z" fill="#E01E5A"/>
    <path d="M7.08333 4.58333C6.16286 4.58333 5.41667 3.83714 5.41667 2.91667C5.41667 1.99619 6.16286 1.25 7.08333 1.25C8.00381 1.25 8.75 1.99619 8.75 2.91667V4.58333H7.08333Z" fill="#36C5F0"/>
    <path d="M7.08333 5.41667C8.00381 5.41667 8.75 6.16286 8.75 7.08333C8.75 8.00381 8.00381 8.75 7.08333 8.75H2.91667C1.99619 8.75 1.25 8.00381 1.25 7.08333C1.25 6.16286 1.99619 5.41667 2.91667 5.41667H7.08333Z" fill="#36C5F0"/>
    <path d="M15.4167 7.08333C15.4167 6.16286 16.1629 5.41667 17.0833 5.41667C18.0038 5.41667 18.75 6.16286 18.75 7.08333C18.75 8.00381 18.0038 8.75 17.0833 8.75H15.4167V7.08333Z" fill="#2EB67D"/>
    <path d="M14.5833 7.08333C14.5833 8.00381 13.8371 8.75 12.9167 8.75C11.9962 8.75 11.25 8.00381 11.25 7.08333V2.91667C11.25 1.99619 11.9962 1.25 12.9167 1.25C13.8371 1.25 14.5833 1.99619 14.5833 2.91667V7.08333Z" fill="#2EB67D"/>
    <path d="M12.9167 15.4167C13.8371 15.4167 14.5833 16.1629 14.5833 17.0833C14.5833 18.0038 13.8371 18.75 12.9167 18.75C11.9962 18.75 11.25 18.0038 11.25 17.0833V15.4167H12.9167Z" fill="#ECB22E"/>
    <path d="M12.9167 14.5833C11.9962 14.5833 11.25 13.8371 11.25 12.9167C11.25 11.9962 11.9962 11.25 12.9167 11.25H17.0833C18.0038 11.25 18.75 11.9962 18.75 12.9167C18.75 13.8371 18.0038 14.5833 17.0833 14.5833H12.9167Z" fill="#ECB22E"/>
  </svg>
);

const NotionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" fill="white" stroke="#171717" strokeWidth="1.5"/>
    <path d="M5.83333 5.83333H10L14.1667 14.1667H10L5.83333 5.83333Z" fill="#171717"/>
    <path d="M5.83333 14.1667V5.83333" stroke="#171717" strokeWidth="1.5"/>
  </svg>
);

const DropboxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.25 2.5L1.66667 5.83333L6.25 9.16667L10 5.83333L6.25 2.5Z" fill="#0061FF"/>
    <path d="M13.75 2.5L10 5.83333L13.75 9.16667L18.3333 5.83333L13.75 2.5Z" fill="#0061FF"/>
    <path d="M1.66667 12.5L6.25 15.8333L10 12.5L6.25 9.16667L1.66667 12.5Z" fill="#0061FF"/>
    <path d="M10 12.5L13.75 15.8333L18.3333 12.5L13.75 9.16667L10 12.5Z" fill="#0061FF"/>
    <path d="M6.25 16.6667L10 13.3333L13.75 16.6667L10 10L6.25 16.6667Z" fill="#0061FF"/>
  </svg>
);

const TrelloIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" fill="#0079BF"/>
    <rect x="4.58333" y="4.58333" width="4.16667" height="10" rx="1" fill="white"/>
    <rect x="11.25" y="4.58333" width="4.16667" height="6.66667" rx="1" fill="white"/>
  </svg>
);

// Copy Icon
const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 6.66667H15C15.9205 6.66667 16.6667 7.41286 16.6667 8.33333V15C16.6667 15.9205 15.9205 16.6667 15 16.6667H8.33333C7.41286 16.6667 6.66667 15.9205 6.66667 15V13.3333M5 13.3333H11.6667C12.5871 13.3333 13.3333 12.5871 13.3333 11.6667V5C13.3333 4.07953 12.5871 3.33333 11.6667 3.33333H5C4.07953 3.33333 3.33333 4.07953 3.33333 5V11.6667C3.33333 12.5871 4.07953 13.3333 5 13.3333Z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Access and sync your files",
    icon: <GoogleDriveIcon />,
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send messages & notifications",
    icon: <SlackIcon />,
    connected: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Create and update pages",
    icon: <NotionIcon />,
    connected: false,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Create and update pages",
    icon: <DropboxIcon />,
    connected: false,
  },
  {
    id: "trello",
    name: "Trello",
    description: "Create and update pages",
    icon: <TrelloIcon />,
    connected: false,
  },
];

interface IntegrationRowProps {
  integration: Integration;
}

function IntegrationRow({ integration }: IntegrationRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-[2px]">
      {/* Icon and Name */}
      <div className="flex items-center justify-between sm:justify-start gap-1 sm:flex-[0.9]">
        <div className="flex items-center gap-1.5">
          {/* Icon */}
          <div className="shrink-0">
            {integration.icon}
          </div>

          {/* Name */}
          <span className="sm:w-[100px] text-[13.5px] text-[#171717] tracking-[-0.084px]">
            {integration.name}
          </span>
        </div>

        {/* Status Button - Mobile */}
        <div className="sm:hidden">
          {integration.connected ? (
            <span className="flex items-center justify-center px-3 py-1 rounded-[10px] bg-[#dcfce7] text-[13.5px] text-[#1DAF61] tracking-[-0.084px]">
              Connected
            </span>
          ) : (
            <button
              className="flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-[#FAFAFA] text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f2f2f2] transition-colors"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
              }}
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <span className="hidden sm:block flex-[1.1] text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
        {integration.description}
      </span>

      {/* Status Button - Desktop */}
      <div className="hidden sm:block">
        {integration.connected ? (
          <span className="flex items-center justify-center px-3 py-1 rounded-[10px] bg-[#dcfce7] text-[13.5px] text-[#1DAF61] tracking-[-0.084px]">
            Connected
          </span>
        ) : (
          <button
            className="flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-[#FAFAFA] text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f2f2f2] transition-colors"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
            }}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

interface ButtonRowProps {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

function ButtonRow({ title, description, buttonText, onClick }: ButtonRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
          {title}
        </span>
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {description}
        </span>
      </div>
      <button
        onClick={onClick}
        className="w-full sm:w-auto flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
        style={{
          boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export function IntegrationsContent() {
  const apiKey = "sk-ant-api03-*************************-abc123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Connected Apps Section */}
      <Section title="Connected apps" description="Manage third-party app connections.">
        <div className="flex flex-col gap-4 md:gap-5">
          {INTEGRATIONS.map((integration) => (
            <IntegrationRow key={integration.id} integration={integration} />
          ))}
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* API Access Section */}
      <Section title="API Access" description="Developer tools and API settings.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* API Key Row */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
                  API Key
                </span>
                <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
                  Your personal API key for external integrations
                </span>
              </div>
              <button
                className="w-full sm:w-auto flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
                style={{
                  boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
                }}
              >
                Generate key
              </button>
            </div>

            {/* API Key Display */}
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-[10px] overflow-x-auto"
              style={{
                backgroundColor: "#FAFAFA",
                boxShadow: "0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
              }}
            >
              <span className="text-[13.5px] text-[#171717] tracking-[-0.084px] truncate">
                {apiKey}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-0.5 rounded hover:bg-[#f7f7f7] transition-colors shrink-0 ml-2"
              >
                <CopyIcon />
              </button>
            </div>
          </div>

          {/* Divider above Webhooks (spacing only on this section) */}
          <div className="h-px bg-[#ebebeb] mt-1 mb-1" />

          {/* Webhooks Row */}
          <ButtonRow
            title="Webhooks"
            description="Configure webhook endpoints for real-time updates"
            buttonText="Manage"
          />
        </div>
      </Section>
    </div>
  );
}
