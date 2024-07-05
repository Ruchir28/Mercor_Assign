import React, { useState } from 'react';
import mercorlogo from '../../public/mercor.png' // Adjust the path as needed

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  skills: string;
  experience: string;
  salaryRange: string;
}

const Header: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    skills: '',
    experience: '',
    salaryRange: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container py-4 flex items-center justify-between">
        <img src={mercorlogo} alt="Company Logo" className="h-20 w-20" />
        <div className="flex space-x-4">
          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={filters.skills}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
          <select
            name="experience"
            value={filters.experience}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
          <select
            name="salaryRange"
            value={filters.salaryRange}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Salary Range</option>
            <option value="0-50000">$0 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000+">$100,000+</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;