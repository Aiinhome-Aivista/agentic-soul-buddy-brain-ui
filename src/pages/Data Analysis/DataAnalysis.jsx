import React from "react";

const customersCols = [
  {
    name: "City",
    inferred: ["unique_identifier", "unique_values", "no_missing_values"],
    confidence: "90.0%",
    unique: "50",
    missing: "0",
    sample: "West Rachelfurt, Martintown, Port Tiffany",
  },
  {
    name: "CustomerID",
    inferred: ["integer", "unique_values", "no_missing_values"],
    confidence: "100.0%",
    unique: "50",
    missing: "0",
    sample: "1, 2, 3",
  },
  {
    name: "Email",
    inferred: ["email", "unique_values", "no_missing_values"],
    confidence: "100.0%",
    unique: "50",
    missing: "0",
    sample: "ebony08@gmail.com, erichopkins@gmail.com, suewebb@hotmail.com",
  },
  {
    name: "Name",
    inferred: ["unique_identifier", "unique_values", "no_missing_values"],
    confidence: "90.0%",
    unique: "50",
    missing: "0",
    sample: "David Richards, Russell Wood, Heather Morgan",
  },
];

const ordersCols = [
  {
    name: "CustomerID",
    inferred: ["integer", "no_missing_values", "range: 1.00 to 50.00"],
    confidence: "100.0%",
    unique: "45",
    missing: "0",
    sample: "16, 47, 44",
  },
  {
    name: "OrderDate",
    inferred: [
      "integer",
      "no_missing_values",
      "range: 172506240000000000.00 to 175582080000000000.00",
    ],
    confidence: "100.0%",
    unique: "88",
    missing: "0",
    sample: "2024-10-05T00:00:00, 2025-01-12T00:00:00, 2025-07-22T00:00:00",
  },
  {
    name: "OrderID",
    inferred: ["integer", "unique_values", "no_missing_values"],
    confidence: "100.0%",
    unique: "100",
    missing: "0",
    sample: "1, 2, 3",
  },
  {
    name: "Product",
    inferred: [
      "categorical",
      "no_missing_values",
      "most_common: Phone (18 occurrences)",
    ],
    confidence: "90.0%",
    unique: "7",
    missing: "0",
    sample: "Phone, Phone, Laptop",
  },
  {
    name: "Quantity",
    inferred: ["integer", "no_missing_values", "range: 1.00 to 5.00"],
    confidence: "100.0%",
    unique: "5",
    missing: "0",
    sample: "4, 4, 2",
  },
];

const TabBar = () => (
  <nav className="flex border-b border-[#23273c] space-x-4 mb-6">
    {["Data Types", "Patterns", "Relationships", "Insights", "Visualization"].map((tab, idx) => (
      <div
        key={tab}
        className={`pb-2 px-6 text-lg font-medium cursor-pointer ${
          idx === 0
            ? "text-[#8664eb] border-b-2 border-[#8664eb]"
            : "text-[#99a1b8] hover:text-[#b4bbce]"
        }`}
      >
        {tab}
      </div>
    ))}
  </nav>
);

const FileCard = ({filename, columns, children}) => (
  <div className="bg-[#222539] rounded-xl p-6 mb-8 max-w-5xl mx-auto">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-[#23273c] px-3 py-1 rounded text-[#c6cbe0] font-semibold">
        {filename}
      </div>
      <div className="bg-[#252839] px-3 py-1 rounded text-[#99a1b8] text-sm font-medium">
        {columns} columns
      </div>
    </div>
    {children}
  </div>
);

const DataTable = ({cols}) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-[#b4bbce] border-b border-[#23273c]">
        <th className="py-2">Column</th>
        <th className="py-2">Inferred Type</th>
        <th className="py-2">Confidence</th>
        <th className="py-2">Unique Values</th>
        <th className="py-2">Missing</th>
        <th className="py-2">Sample Values</th>
      </tr>
    </thead>
    <tbody>
      {cols.map((col, i) => (
        <tr key={col.name} className="border-b border-[#23273c] text-white">
          <td className="py-2 font-medium">{col.name}</td>
          <td className="py-2">
            {col.inferred.map((tag, j) => (
              <span
                key={j}
                className="bg-[#7A6FF0] text-white px-2 py-1 rounded mr-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </td>
          <td className="py-2">
            <span className="bg-[#8664eb] px-2 py-1 rounded text-white text-xs font-semibold">
              {col.confidence}
            </span>
          </td>
          <td className="py-2 text-center">{col.unique}</td>
          <td className="py-2 text-center">{col.missing}</td>
          <td className="py-2 text-[#ee4eab]">{col.sample}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function DataTypesDashboard() {
  return (
    <div className="min-h-screen bg-[#181C2A] p-10">
      {/* Tabs */}
      <TabBar />
      {/* Customer File */}
      <FileCard filename="9_Customers_-_Copy.xlsx" columns={4}>
        <DataTable cols={customersCols} />
      </FileCard>
      {/* Orders File */}
      <FileCard filename="9_Orders.xlsx" columns={5}>
        <DataTable cols={ordersCols} />
      </FileCard>
    </div>
  );
}
