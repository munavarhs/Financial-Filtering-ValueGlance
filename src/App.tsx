import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "./components/Table";
import "./App.css";

const API_URL =
  "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=N9Q2bpivdVDRT97qwJqtYmM4m0GIyuo2";

// Define the types
type Filters = {
  dateRange: { start: number; end: number };
  revenue: { min: number; max: number };
  netIncome: { min: number; max: number };
};

type DataRow = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit?: number;
  eps?: number; 
  operatingIncome?: number; 
};

function App() {
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: 2020, end: 2024 },
    revenue: { min: 0, max: Infinity },
    netIncome: { min: 0, max: Infinity },
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof DataRow; direction: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataRow[]>(API_URL);
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [category, field] = name.split(".");

    // Ensure category and field are valid keys
    if (
      category in filters &&
      ["start", "end", "min", "max"].includes(field)
    ) {
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category as keyof Filters],
          [field]: field === "min" || field === "max" ? parseFloat(value) : parseInt(value),
        },
      }));
    }
  };

  const applyFilters = () => {
    const { dateRange, revenue, netIncome } = filters;

    const filtered = data.filter((row) => {
      const date = parseInt(row.date.split("-")[0]);
      const withinDateRange = date >= dateRange.start && date <= dateRange.end;
      const withinRevenue = row.revenue >= revenue.min && row.revenue <= revenue.max;
      const withinNetIncome =
        row.netIncome >= netIncome.min && row.netIncome <= netIncome.max;
      return withinDateRange && withinRevenue && withinNetIncome;
    });

    setFilteredData(filtered);
  };

  const sortData = (key: keyof DataRow) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
  
    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a[key] ?? 0; 
      const valueB = b[key] ?? 0; 
  
      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  
    setFilteredData(sortedData);
    setSortConfig({ key, direction });
  };
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Financial Data Filtering Assignment - ValueGlance
      </h1>
      <div className="mb-4 space-y-2">
        <div>
          <label className="mr-2">Date Range:</label>
          <input
            type="number"
            name="dateRange.start"
            placeholder="Start Year"
            value={filters.dateRange.start}
            onChange={handleFilterChange}
            className="border px-2 py-1"
          />
          -
          <input
            type="number"
            name="dateRange.end"
            placeholder="End Year"
            value={filters.dateRange.end}
            onChange={handleFilterChange}
            className="border px-2 py-1 ml-2"
          />
        </div>
        <div>
          <label className="mr-2">Revenue Range:</label>
          <input
            type="number"
            name="revenue.min"
            placeholder="Min Revenue"
            value={filters.revenue.min}
            onChange={handleFilterChange}
            className="border px-2 py-1"
          />
          -
          <input
            type="number"
            name="revenue.max"
            placeholder="Max Revenue"
            value={filters.revenue.max}
            onChange={handleFilterChange}
            className="border px-2 py-1 ml-2"
          />
        </div>
        <div>
          <label className="mr-2">Net Income Range:</label>
          <input
            type="number"
            name="netIncome.min"
            placeholder="Min Net Income"
            value={filters.netIncome.min}
            onChange={handleFilterChange}
            className="border px-2 py-1"
          />
          -
          <input
            type="number"
            name="netIncome.max"
            placeholder="Max Net Income"
            value={filters.netIncome.max}
            onChange={handleFilterChange}
            className="border px-2 py-1 ml-2"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>
      <p>(Sort the columns in ascending and descending order just by clicking on them)</p>
      <Table data={filteredData} sortData={sortData} />
    </div>
  );
}

export default App;
