"use client";
import { useState } from "react";
import PlanOne from "./PlanOne";
import PlanTwo from "./PlanTwo";
import PlanThree from "./PlanThree";
import { Button } from "@/components/ui/button";

import {
  HelpCircle,
  FileText,
  CheckCircle2,
  Play,
  Folder,
  BookOpen,
  Clock,
  BarChart3,
} from "lucide-react";
import CustomizeTable from "@/shared/CustomizeTable/CustomizeTable";

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState("plan1");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = [
    { id: "plan1", label: "Plan 1", component: PlanOne },
    { id: "plan2", label: "Plan 2", component: PlanTwo },
    { id: "plan3", label: "Plan 3", component: PlanThree },
  ];

  const features = [
    {
      icon: HelpCircle,
      title: "Practice Questions",
      description:
        "Practice the latest exam questions updated on a regular basis, with instant AI scoring",
    },
    {
      icon: FileText,
      title: "Mock Tests",
      description:
        "Unlimited access to both full & sectional mock tests with instant AI scoring",
    },
    {
      icon: CheckCircle2,
      title: "CYO Mock Tests",
      description:
        "Unlimited access to create your own mock tests with instant AI scoring",
    },
    {
      icon: Play,
      title: "Strategy Videos",
      description:
        "Option to add your own strategy videos for effective learning (Customizable)",
    },
    {
      icon: Folder,
      title: "Study Files",
      description:
        "Practice the latest exam questions updated on a regular basis, with instant AI scoring",
    },
    {
      icon: BookOpen,
      title: "Templates & Grammar",
      description:
        "Unlimited access to both full & sectional mock tests with instant AI scoring",
    },
    {
      icon: Clock,
      title: "Study Plan",
      description:
        "Unlimited access to create your own mock tests with instant AI scoring",
    },
    {
      icon: BarChart3,
      title: "Detailed Score Analytics",
      description:
        "Option to add your own strategy videos for effective learning (Customizable)",
    },
  ];

  const columns = [
    { key: "range", label: "Range", sortable: true },
    { key: "30days", label: "30-days (Price per account)", sortable: false },
    { key: "60days", label: "60-days (Price per account)", sortable: false },
    { key: "90days", label: "90-days (Price per account)", sortable: false },
    { key: "180days", label: "180-days (Price per account)", sortable: false },
    { key: "365days", label: "365-days (Price per account)", sortable: false },
  ];

  const pricingData = [
    {
      id: 1,
      range: "05 to 25 Accounts",
      "30days": "BDT 795",
      "60days": "BDT 1545",
      "90days": "BDT 2195",
      "180days": "BDT 3895",
      "365days": "BDT 6895",
    },
    {
      id: 2,
      range: "26 to 50 Accounts",
      "30days": "BDT 750",
      "60days": "BDT 1450",
      "90days": "BDT 2050",
      "180days": "BDT 3650",
      "365days": "BDT 6450",
    },
    {
      id: 3,
      range: "51 to 100 Accounts",
      "30days": "BDT 695",
      "60days": "BDT 1345",
      "90days": "BDT 1895",
      "180days": "BDT 3395",
      "365days": "BDT 5995",
    },
  ];

  const totalPages = Math.ceil(pricingData.length / itemsPerPage);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        <div className="mb-8 flex space-x-2">
          <h1 className="text-4xl font-bold mb-6">Buy</h1>

          {/* Custom Tabs */}
          <div className="">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 max-w-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full border-3 px-6 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600  text-white"
                      : "bg-[#FFFFFF] text-gray-700 "
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {/* Configuration and Pricing Card Section */}
              <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
                {/* Left Section - Active Plan Component */}
                <div className="lg:col-span-2">
                  {ActiveComponent && <ActiveComponent />}
                </div>

                {/* Right Section - Pricing Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
                  <div className="flex-1 space-y-6">
                    <div className="text-center">
                      {/* <div className="text-5xl mb-2">☀️</div> */}
                      <p className="text-2xl font-bold">255 per account</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Total: 520
                      </p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6">
                      Debit / Credit Card
                    </Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6">
                      Pay Online (SSL Commerz)
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      No expiry to Premium credits
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Table */}
              <CustomizeTable
                columns={columns}
                data={pricingData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                searchPlaceholder="Search pricing..."
              />

              {/* Features Section */}
              {/* <div>
                <h2 className="text-2xl font-bold mb-6">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col"
                      >
                        <Icon className="w-12 h-12 mb-4 text-blue-500" />
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
