import  { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import companyLogo from '../../public/mercor.png';
import { useRecoilState } from 'recoil';
import { filtersState } from '../recoilstate';
import { config } from '../config';

export interface FilterState {
  skills: string[];
  companies: string[];
  educational_institutes: string[];
  major: string[];
}

const Header = () => {
  const [searchString, setSearchString] = useState('');
  const [, setFilters] = useRecoilState(filtersState);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://${config.SERVER_URL}/api/extract-filters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchString }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract filters');
      }

      const extractedFilters: FilterState = await response.json();
      setFilters({
        companies: extractedFilters.companies || [],
        educational_institutes: extractedFilters.educational_institutes || [],
        major: extractedFilters.major || [],
        skills: extractedFilters.skills || []
      });
    } catch (error) {
      console.error('Error extracting filters:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-full sm:w-32 mb-4 sm:mb-0 sm:mr-8 flex justify-center sm:justify-start">
            <img src={companyLogo} alt="Company Logo" className="h-16 sm:h-20 w-auto" />
          </div>
          <div className="flex-grow w-full">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center bg-white rounded-lg p-4">
              <div className="flex-grow mr-0 sm:mr-4 mb-4 sm:mb-0">
                <input
                  type="text"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter skills, companies, institutes, or majors"
                  className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                className={`w-full sm:w-auto bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;