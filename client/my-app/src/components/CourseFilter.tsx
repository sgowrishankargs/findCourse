import React, { useState, useEffect } from "react";

export interface FilterState {
  categories: string[];
}

interface CourseFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ onFilterChange }) => {
  const categories = [
    "Java",
    "Python",
    "Dotnet",
    "MERN Stack",
    "MEAN Stack",
    "Angular",
    "AI ML",
  ];

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    categories: [],
  });

  const handleToggle = (type: keyof FilterState, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[type];

      const updatedValues = currentValues.includes(value)
                            ? currentValues.filter((item) => item !== value)
                            : [...currentValues, value];

      return { ...prev, [type]: updatedValues };
    });
  };

  const handleReset = () => {
    setSelectedFilters({ categories: [] });
  };

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  return (
    <aside className="w-60 p-10 ">
      <h2 className="font-semibold text-xl mb-4">Course Filters</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Categories</h3>
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedFilters.categories.includes(cat)}
              onChange={() => handleToggle("categories", cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <button
        onClick={handleReset}
         className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-xl text-base  hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-95 transform"
      >
        Reset
      </button>
    </aside>
  );
};

export default CourseFilter;
