
type DataRow = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit?: number;
  eps?: number; 
  operatingIncome?: number; 
};

export const Table = ({
  data,
  sortData,
}: {
  data: DataRow[];
  sortData: (key: keyof DataRow) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => sortData("date")}
            >
              Date
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => sortData("revenue")}
            >
              Revenue
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => sortData("netIncome")}
            >
              Net Income
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Gross Profit
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">EPS</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Operating Income
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.date || index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{row.date}</td>
              <td className="border border-gray-300 px-4 py-2">{row.revenue}</td>
              <td className="border border-gray-300 px-4 py-2">
                {row.netIncome}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {row.grossProfit ?? "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {row.eps ?? "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {row.operatingIncome ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
