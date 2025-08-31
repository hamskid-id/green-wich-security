import React from "react";

const filterOptions = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expired", label: "Expired" },
  { id: "revoked", label: "Revoked" },
];

interface Props {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterBar: React.FC<Props> = ({ activeFilter, setActiveFilter }) => (
  <div className="filter-swiper" role="tablist">
    <div className="filter-scroll-container">
      {filterOptions.map((filter) => (
        <button
          key={filter.id}
          role="tab"
          aria-selected={activeFilter === filter.id}
          className={`filter-button ${
            activeFilter === filter.id ? "filter-button-active" : ""
          }`}
          onClick={() => setActiveFilter(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
