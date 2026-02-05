const Loader = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center  space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#1E2F96] rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-gray-200 border-t-[#1E2F96] rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">
          Loading course modules ...
        </p>
      </div>
    </div>
  );
};

export default Loader;
