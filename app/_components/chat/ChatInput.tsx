"use client";
import React from "react";
import { Paperclip, X } from "lucide-react";

import Image from "next/image";

interface Attachment {
  type: 'image' | 'file';
  content: string;
  name: string;
  mime: string;
}

interface ChatInputProps {
  onSend?: (message: string, attachment?: Attachment) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedAttachment, setSelectedAttachment] = React.useState<Attachment | null>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleSend = () => {
    if ((inputValue.trim() || selectedAttachment) && onSend) {
      onSend(inputValue, selectedAttachment || undefined);
      setInputValue("");
      setSelectedAttachment(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const content = reader.result as string;
        const isImage = file.type.startsWith('image/');
        setSelectedAttachment({
          type: isImage ? 'image' : 'file',
          content,
          name: file.name,
          mime: file.type
        });
        setShowMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuClick = (option: typeof menuOptions[0]) => {
    if (option.label === "Upload image or file") {
      fileInputRef.current?.click();
    }
    // Close menu for other options or effectively close it after action
    if (option.label !== "Upload image or file") {
       // Optional: implement other actions
    }
    setShowMenu(false);
  };

  const menuOptions = [
    { icon: "/ChatBoxImages/Image.svg", label: "Generate image", type: "image" },
    { icon: Paperclip, label: "Upload image or file", type: "lucide" },
    { icon: "/ChatBoxImages/Deepsearch.svg", label: "Deep research", type: "image" },
    { icon: "/ChatBoxImages/Agent.svg", label: "Agent mode", type: "image" },
    { icon: "/ChatBoxImages/study.svg", label: "Study and learn", type: "image" },
  ];

  const hasContent = inputValue.trim().length > 0 || !!selectedAttachment;

  return (
    <div
      className="flex flex-col bg-[#F7F7F7] w-full max-w-[700px] min-h-[146px] rounded-[20px] pt-[10px] px-[1px] pb-[1px] gap-[10px]"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*, application/pdf"
        onChange={handleFileSelect}
      />
      {/* Premium Banner */}
      <div
        className="flex items-center w-full h-4 px-3 gap-1"
      >
        <Image
          src="/ChatBoxImages/flashlight-fill.svg"
          alt="flash"
          width={16}
          height={16}
        />
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            color: "#A3A3A3",
          }}
        >
          Access premium models & features
        </span>
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            color: "#A3A3A3",
          }}
        >
          ·
        </span>
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            color: "#5C5C5C",
            cursor: "pointer",
          }}
        >
          Upgrade
        </span>
      </div>

      {/* Input Box */}
      <div
        className="flex flex-col justify-between bg-white relative w-full min-h-[109px] rounded-[19px] gap-[10px] pt-[14px] px-[12px] pb-[12px]"
        style={{
          background: "#FFFFFF",
          boxShadow: `
            0px 0px 0px 1px rgba(0, 0, 0, 0.04),
            0px 1px 1px -0.5px rgba(0, 0, 0, 0.08),
            0px 3px 3px -1.5px rgba(0, 0, 0, 0.08),
            0px 6px 6px -3px rgba(0, 0, 0, 0.08),
            0px 10px 10px -5px rgba(0, 0, 0, 0.04)
          `,
        }}
      >
        {/* Menu Modal */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute bottom-[50px] left-0 z-50 flex flex-col"
            style={{
              width: "219px",
              height: "188px",
              borderRadius: "16px",
              padding: "6px",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              color:"#A3A3A3",
              boxShadow: `
                0px -1px 1px -0.5px rgba(0, 0, 0, 0.12) inset,
                0px 0px 0px 1px rgba(0, 0, 0, 0.16),
                0px 1px 1px -0.5px rgba(0, 0, 0, 0.08),
                0px 3px 3px -1.5px rgba(0, 0, 0, 0.08),
                0px 6px 6px -3px rgba(0, 0, 0, 0.08),
                0px 10px 10px -5px rgba(0, 0, 0, 0.08),
                0px 20px 20px -10px rgba(0, 0, 0, 0.08)
              `,
            }}
          >
            {menuOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleMenuClick(option)}
                className="group flex items-center gap-3 p-[6px] hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                {option.type === "lucide" ? (
                  // @ts-ignore
                  <option.icon
                    size={16}
                    color="currentColor"
                    className="text-[#A4A4A4] group-hover:text-[#171717]"
                  />
                ) : (
                  <Image
                    src={option.icon as string}
                    alt={option.label}
                    width={16}
                    height={16}
                    className="transition-[filter] duration-150 group-hover:brightness-75"
                  />
                )}
                <span
                  className="text-[#5C5C5C] group-hover:text-[#171717]"
                  style={{
                    fontFamily: "Inter",
                    // fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: "-0.006em",
                  }}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Selected Attachment Preview */}
        {selectedAttachment && (
          <div className="shrink-0">
            {selectedAttachment.type === 'image' ? (
              <div className="relative w-[96px] h-[96px] rounded-[16px] overflow-hidden group">
                <Image 
                  src={selectedAttachment.content} 
                  alt="Selected" 
                  fill
                  className="object-cover"
                />
                <button 
                  onClick={() => setSelectedAttachment(null)}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div
                className="relative inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {showTooltip && (
                  <div
                    className="absolute bottom-full left-0 mb-3 bg-gray-900 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none"
                    style={{
                      maxWidth: "300px",
                      transform: "translateY(-2px)",
                      marginRight: "16px",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      lineHeight: "1.4"
                    }}
                  >
                    {selectedAttachment.name}
                  </div>
                )}
                <div className="flex items-center box-border border border-gray-200 bg-white relative group"
                     style={{
                       width: "255px",
                       height: "60px",
                       borderRadius: "16px",
                       borderWidth: "1px",
                       paddingTop: "10px",
                       paddingRight: "16px",
                       paddingBottom: "10px",
                       paddingLeft: "12px",
                       gap: "12px"
                     }}
                >
                  <Image
                    src="/ChatBoxImages/pdfpin.svg"
                    alt="PDF"
                    width={40}
                    height={40}
                    className="shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden flex-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {selectedAttachment.name}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                      PDF
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAttachment(null)}
                    className="bg-black hover:bg-gray-800 rounded-full transition-colors shrink-0 flex items-start justify-center"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "9999px",
                      padding: "2px",
                      gap: "2px",
                      marginTop: "-12px"
                    }}
                  >
                    <X size={12} color="white" strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="How can I help you today?"
          className="w-full bg-transparent text-[#171717] outline-none placeholder-[#A3A3A3] flex-1"
          style={{
            fontWeight: 430,
            fontSize: "15px",
            lineHeight: "24px",
            letterSpacing: "-0.006em",
          }}
        />

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          {/* Left Action: GPT-4 Selector (Placeholder) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`flex items-center justify-center transition-colors ${
                showMenu ? "" : "hover:bg-[#E5E5E5]"
              }`}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "9px",
                padding: "4px",
                gap: "2px",
                backgroundColor: showMenu ? "#171717" : "#F7F7F7",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.25 9.25V4.75H10.75V9.25H15.25V10.75H10.75V15.25H9.25V10.75H4.75V9.25H9.25Z"
                  fill={showMenu ? "#FFFFFF" : "#A4A4A4"}
                />
              </svg>
            </button>
            <button
              className="hidden md:flex items-center transition-colors hover:bg-[#E5E5E5]"
              style={{
                width: "79px",
                height: "28px",
                borderRadius: "9px",
                padding: "4px 4px 4px 8px",
                gap: "4px",
                backgroundColor: "#F7F7F7",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "-0.006em",
                  color: "#5C5C5C",
                }}
              >
                GPT-4
              </span>
              <Image
                src="/sidebar/arrow-down-s-line.svg"
                alt="Arrow Down"
                width={18}
                height={18}
                className="text-[#5C5C5C]"
              />
            </button>
          </div>

          {/* Right Action: Send Button */}
          <button
            onClick={handleSend}
            className={`flex items-center justify-center transition-colors ${
              hasContent ? "" : "hover:bg-[#E5E5E5]"
            }`}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "9px",
              padding: "4px",
              gap: "2px",
              backgroundColor: hasContent ? "#171717" : "#F7F7F7",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5835 2.871V12H5.0835V2.871L1.0605 6.894L0 5.8335L5.8335 0L11.667 5.8335L10.6065 6.894L6.5835 2.871Z"
                fill={hasContent ? "#FFFFFF" : "#A4A4A4"}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
