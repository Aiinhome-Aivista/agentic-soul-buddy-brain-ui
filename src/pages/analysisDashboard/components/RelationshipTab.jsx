import React, { useContext } from "react";
import { Link2 } from "lucide-react";
import { Context } from "../../../common/helper/Context";

const RelationshipsTab = () => {
  const { relationships, activeSession, sessionData } = useContext(Context);

  // Fetch relationships for the active session
  const sessionRelationships =
    (activeSession && sessionData[activeSession]?.relationships) || [];

  if (!sessionRelationships || !sessionRelationships.candidates || sessionRelationships.candidates.length === 0) {
    return <div className="text-white">No relationships detected yet.</div>;
  }

  const { candidates } = sessionRelationships;

  const getBadgeColor = (similarity) => {
    const percent = similarity * 100;
    if (percent === 100) return "bg-green-600 text-white";
    if (percent >= 70) return "bg-yellow-500 text-black";
    return "bg-red-600 text-white";
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 shadow rounded-2xl border-slate-700">
        <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h5 className="font-semibold">Column Relationships</h5>
        </div>
        <div className="p-4 space-y-4">
          {candidates.map((rel, index) => (
            <div
              key={index}
              className="bg-slate-700 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div className="flex flex-col">
                <p className="text-gray-200 font-semibold">
                  {rel.file_a}.{rel.col_a} ⟷ {rel.file_b}.{rel.col_b}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Suggested relationship between columns
                </p>

                <p className="text-blue-400 text-sm font-medium mt-1">
                  Join Type: <span className="text-gray-300">{rel.join_type}</span>
                </p>
              </div>

              <div>
                <span
                  className={`${getBadgeColor(rel.name_similarity)} text-xs px-3 py-1 rounded-full font-medium`}
                >
                  {(rel.name_similarity * 100).toFixed(1)}% match
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelationshipsTab;
