const LoadingProfile: React.FC = () => (
  <div className="bg-gray-100 min-h-screen">
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="p-8">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-300 h-32 w-32 mr-8"></div>
            <div>
              <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="mt-6 h-20 bg-gray-300 rounded"></div>
          <div className="mt-6 flex space-x-4">
            <div className="bg-gray-300 h-10 w-32 rounded-full"></div>
            <div className="bg-gray-300 h-10 w-32 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="h-8 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="flex flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-gray-300 rounded-full h-8 w-20 m-1"
                ></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-8 bg-gray-300 rounded w-40 mb-4"></div>
            <div className="space-y-4">
              <div className="h-16 bg-gray-300 rounded"></div>
              <div className="h-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default LoadingProfile;
