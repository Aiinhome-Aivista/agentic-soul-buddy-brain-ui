import React from "react";

function SessionForm({ sessionName, setSessionName }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm mb-1">
        Analysis Session Name
      </label>
      <input
        type="text"
        placeholder="Enter a name for this analysis session"
        className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white text-sm"
        onChange={(e) => setSessionName(e.target.value)}
        value={sessionName}
      />
      <p className="text-xs text-slate-500 mt-1">
        Give your analysis session a descriptive name for easy identification
      </p>
    </div>
  );
}

export default SessionForm;