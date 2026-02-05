import React from "react";

import {
  BookIcon,
  CreditIcon,
  ExpiryIcon,
  PremiumIcon,
  UserIcon,
} from "./SVG/DashboardIcon";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const cardData = [
    {
      icon: <PremiumIcon />,
      title: "343",
      subtitle: "Premium active",
      bgColor: "#EFF5FF",
      linkText: "View all",
    },
    {
      icon: <UserIcon />,
      title: "1504",
      subtitle: "Users Created",
      bgColor: "#C5EEFF",
      linkText: "View all",
    },
    {
      icon: <BookIcon />,
      title: "11999",
      subtitle: "Mock Tests",
      bgColor: "#DAFFC9",
      badge: {
        text: "Completed",
        color: "#000",
      },
    },
  ];

  const sideCards = [
    {
      icon: <ExpiryIcon />,
      title: "56",
      subtitle: "Accounts Approaching Expiry",
      bgColor: "#2741E0",
    },
    {
      icon: <ExpiryIcon />,
      title: "980",
      subtitle: "Users Logged In",
      bgColor: "#EF4444",
    },
  ];

  return (
    <div className=" ">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-[70%_30%] gap-4 sm:gap-6">
        {/* Left Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {cardData.map((card, index) => (
              <DashboardCard
                key={index}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                bgColor={card.bgColor}
                badge={card.badge}
                linkText={index < 2 ? card.linkText : undefined}
              />
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Mock Tests Completed
            </h2>
            <div className="h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                Chart will be displayed here
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Premium Credit Card */}
          <div className="bg-white rounded-xl border border-[#0000001A] p-4 w-full max-w-[296px] mx-auto xl:mx-0 h-auto min-h-[111px]">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FFE4E3] rounded-[11px] flex items-center justify-center flex-shrink-0">
                <CreditIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                  249
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Premium Credit
                  <span className="font-medium text-[#E23E57]">
                    {" "}
                    (Remaining)
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  (Branch - 216)
                </p>
              </div>
            </div>
          </div>

          {/* Side Cards */}
          {sideCards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-[#0000001A] rounded-xl p-4  w-full max-w-[296px] mx-auto xl:mx-0 h-auto min-h-[180px] sm:min-h-[192px]"
            >
              <div className="flex justify-end mb-3 ">
                <button className="text-xs sm:text-sm bg-[#F1F5F9] rounded px-3 py-1 text-[#000000] underline transition-colors hover:bg-gray-300">
                  View all
                </button>
              </div>
              <div className="text-center">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  style={{ backgroundColor: card.bgColor }}
                >
                  {card.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-none">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
