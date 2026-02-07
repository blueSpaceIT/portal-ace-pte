import React from "react";

interface ViewModuleContentProps {
  ModuleContentDetails: any;
  onClose: () => void;
}

const ViewMaterialContentDetails: React.FC<ViewModuleContentProps> = ({
  ModuleContentDetails,
  onClose,
}) => {
  if (!ModuleContentDetails) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">
        No module details available
      </div>
    );
  }

  return (
    <div className=" p-8 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-[#1E2F96] tracking-tight">
          {ModuleContentDetails.title}
        </h2>
      </div>
      <div className="flex gap-8 mb-8">
        <div className="flex flex-col items-center w-1/3">
          <img
            src={ModuleContentDetails.mediaUrl}
            alt={ModuleContentDetails.title}
            className="rounded-xl w-full h-48 object-cover border-2 border-[#1E2F96] shadow-md"
          />
          <div className="mt-4 flex flex-col gap-2 w-full">
            <span className="inline-block px-4 py-1 rounded-full bg-[#1E2F96] text-white text-xs font-semibold text-center">
              {ModuleContentDetails.type}
            </span>
            <span
              className={`inline-block px-4 py-1 rounded-full text-xs font-semibold text-center ${
                ModuleContentDetails.isPublished
                  ? "bg-[#34d399] text-white"
                  : "bg-[#fbbf24] text-white"
              }`}
            >
              {ModuleContentDetails.isPublished ? "Published" : "Draft"}
            </span>
            <span className="inline-block px-4 py-1 rounded-full bg-[#e0e7ff] text-[#1E2F96] text-xs font-semibold text-center">
              Order: {ModuleContentDetails.order}
            </span>
          </div>
        </div>
        <div className="w-2/3">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#1E2F96]">
              Description
            </h3>
            <p className="text-gray-700 bg-[#f3f4f6] rounded-lg p-3 border border-[#dbeafe]">
              {ModuleContentDetails.description}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#1E2F96]">
              Content
            </h3>
            <div
              className=" max-w-3xl"
              dangerouslySetInnerHTML={{ __html: ModuleContentDetails.content }}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Created:</span>
            <span className="text-xs bg-[#e0e7ff] text-[#1E2F96] px-2 py-1 rounded">
              {new Date(ModuleContentDetails.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Updated:</span>
            <span className="text-xs bg-[#e0e7ff] text-[#1E2F96] px-2 py-1 rounded">
              {new Date(ModuleContentDetails.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          ID: {ModuleContentDetails.id}
        </span>
      </div>
    </div>
  );
};

export default ViewMaterialContentDetails;
