// import { createContext, useState } from 'react'
// export const Context = createContext();

// export function ContextProvider({ children }) {
//     const [files, setFiles] = useState([]);
//     const [patterns, setPatterns] = useState([]);
//     const [relationships, setRelationships] = useState([]);
//     const [dataTypes, setDataTypes] = useState([])
//     const [insights, setInsights] = useState([]);
//     const [graphUrl, setGraphUrl] = useState([]);
//     const [loadingView, setLoadingView] = useState(false);

//     return (
//         <Context.Provider value={{
//             files, setFiles,
//             patterns, setPatterns,
//             relationships, setRelationships,
//             dataTypes, setDataTypes,
//             insights, setInsights,
//             graphUrl, setGraphUrl,
//             loadingView, setLoadingView,
//         }}>
//             {children}
//         </Context.Provider>
//     )
// }


import { createContext, useState } from 'react';

export const Context = createContext();

export function ContextProvider({ children }) {
  const [files, setFiles] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [insights, setInsights] = useState([]);
  const [graphUrl, setGraphUrl] = useState([]);
  const [loadingView, setLoadingView] = useState(false);

  // 🔹 New: store session-wise data
  const [sessionData, setSessionData] = useState({});
  const [activeSession, setActiveSession] = useState(null);

  // 🔹 New: store table tracker data globally
  const [trackerData, setTrackerData] = useState(null);
  const [isTrackerDataLoading, setIsTrackerDataLoading] = useState(false);
  const [hasStructuredData, setHasStructuredData] = useState(false);
  const [unstructuredFilesCount, setUnStructuredFilesCount] = useState(0)

  // 🔹 Helper to update session data
  const updateSessionData = (sessionName, newData) => {
    setSessionData(prev => ({
      ...prev,
      [sessionName]: {
        ...prev[sessionName],
        ...newData
      }
    }));
    setActiveSession(sessionName); // set the clicked session as active
  };

  return (
    <Context.Provider
      value={{
        files, setFiles,
        patterns, setPatterns,
        relationships, setRelationships,
        dataTypes, setDataTypes,
        insights, setInsights,
        graphUrl, setGraphUrl,
        loadingView, setLoadingView,
        sessionData, setSessionData,
        activeSession, setActiveSession,
        updateSessionData, // ✅ provide helper
        trackerData, setTrackerData, // ✅ provide tracker data
        isTrackerDataLoading, setIsTrackerDataLoading,
        hasStructuredData, setHasStructuredData,
        unstructuredFilesCount, setUnStructuredFilesCount // ✅ provide shared loading state
      }}
    >
      {children}
    </Context.Provider>
  );
}
