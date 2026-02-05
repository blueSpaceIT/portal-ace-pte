import React from "react";

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  badge?: {
    text: string;
    color: string;
  };
  linkText?: string;
  onLinkClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  subtitle,
  bgColor,
  badge,
  linkText,
  onLinkClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#0000001A] p-4 w-full max-w-[246px] h-auto min-h-[111px]">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-[11px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {subtitle}
            {badge && (
              <span className="font-medium" style={{ color: badge.color }}>
                {" "}
                ({badge.text})
              </span>
            )}
          </p>
          {linkText && (
            <button
              className="text-xs sm:text-sm text-[#000000] bg-[#F1F5F9] rounded-md w-[66px] h-[22px] underline hover:text-gray-900 transition-colors mt-2"
              onClick={onLinkClick}
            >
              {linkText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
