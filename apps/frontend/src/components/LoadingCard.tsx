import React from "react";

const LoadingCard: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden h-80 m-4 animate-pulse">
      <div className="flex h-full">
        <div className="w-1/3 bg-gray-300"></div>
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="flex flex-wrap">
              <div className="h-6 bg-gray-300 rounded w-16 mr-2 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-16 mr-2 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-16 mr-2 mb-2"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-8 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
