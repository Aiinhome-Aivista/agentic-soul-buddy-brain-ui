// import React, { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";

// const API_URL = "http://122.163.121.176:3004/rag_chat";
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     console.error("ErrorBoundary caught an error:", error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500">Something went wrong.</div>;
//     }
//     return this.props.children;
//   }
// }

// export default function VectorInsightsTab() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef(null);
//   const hasFetchedRef = useRef(false); // Prevent double API call

//   const sessionId = localStorage.getItem("session_id");

//   // Auto-scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     console.log('session id',sessionId,hasFetchedRef)
//     if (sessionId && !hasFetchedRef.current) {
//       fetchInsights(""); // Initial query blank
//       hasFetchedRef.current = true;
//     }
//   }, [sessionId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

// const fetchInsights = async (query) => {
//   setLoading(true);
//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ session_id: sessionId, query }),
//     });

//     const data = await response.json();

//     // Safely handle answer: string, array, or object, and show only values
//     let botMessage = "No insights found.";

//     if (data.answer) {
//       if (Array.isArray(data.answer)) {
//         // Extract values from array of objects or strings
//         botMessage = data.answer
//           .map(item => {
//             if (typeof item === "object" && item !== null) {
//               return Object.values(item).join(", "); // Only values
//             }
//             return item; // String or number
//           })
//           .join("\n");
//       } else if (typeof data.answer === "object" && data.answer !== null) {
//         botMessage = Object.values(data.answer).join(", ");
//       } else {
//         botMessage = data.answer; // Already a string
//       }
//     } else if (data.message) {
//       botMessage = data.message;
//     }

//     // Update session_id if API returns a new one
//     if (data.session_id && data.session_id !== sessionId) {
//       localStorage.setItem("session_id", data.session_id);
//     }

//     setMessages((prev) => [
//       ...prev,
//       { sender: "bot", text: botMessage },
//     ]);
//   } catch (err) {
//     console.error(err);
//     setMessages((prev) => [
//       ...prev,
//       { sender: "bot", text: "⚠️ Error fetching insights." },
//     ]);
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleSend = () => {
//     if (!input.trim()) return;

//     setMessages((prev) => [
//       ...prev,
//       { sender: "user", text: input.trim() },
//     ]);

//     fetchInsights(input.trim());
//     setInput("");
//   };

//   return (
//     <ErrorBoundary>
//       <div className="flex flex-col h-[75vh] bg-slate-800 rounded-xl p-4">
//         {/* Chat area */}
//         <div className="flex-1 overflow-y-auto space-y-4 p-2 border border-slate-700 rounded-md bg-slate-900">
//           {Array.isArray(messages) &&
//             messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
//                     msg.sender === "user"
//                       ? "bg-[#795EFF] text-white"
//                       : "bg-slate-700 text-slate-100"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//           {loading && (
//             <div className="text-center text-slate-400 text-sm">Loading insights...</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input area */}
//         <div className="mt-4 flex items-center gap-2">
//           <input
//             type="text"
//             value={input}
//             placeholder="Type your question..."
//             onChange={(e) => setInput(e.target.value)}
//             className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#795EFF]"
//             onKeyDown={(e) => {
//               if (e.key === "Enter") handleSend();
//             }}
//           />
//           <button
//             onClick={handleSend}
//             disabled={loading}
//             className="p-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white flex items-center justify-center"
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

// ✅ NOTE: Ensure this URL matches your backend setup
const API_URL = "http://122.163.121.176:3004/rag_chat";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("ErrorBoundary caught an error:", error, info); }
  render() {
    if (this.state.hasError) return <div className="text-red-500">Something went wrong.</div>;
    return this.props.children;
  }
}

export default function VectorInsightsTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const hasFetchedRef = useRef(false);

  // ✅ Retrieve IDs from Local Storage
  const sessionId = localStorage.getItem("session_id");
  const userId = localStorage.getItem("user_id") || "1"; // Default to "1" if not set

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log('Current Session ID:', sessionId);
    if (sessionId && !hasFetchedRef.current) {
      fetchInsights(""); // Initial generic insight
      hasFetchedRef.current = true;
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInsights = async (query) => {
    setLoading(true);
    try {
      // 🆕 Retrieve active sessions from local storage
      const activeSessionsRaw = localStorage.getItem("active_multi_sessions");
      const activeSessions = activeSessionsRaw ? JSON.parse(activeSessionsRaw) : [];

      // 🆕 Construct the payload dynamically
      const payload = {
          user_id: userId,
          query: query,
          active_sessions: activeSessions, // List of session names e.g. ["Math", "Physics"]
          session_id: sessionId            // Fallback for single session logic
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      let botMessage = "No insights found.";

      if (data.answer) {
        if (Array.isArray(data.answer)) {
          botMessage = data.answer.map(item => {
              if (typeof item === "object" && item !== null) {
                return Object.values(item).join(", ");
              }
              return item;
            }).join("\n");
        } else if (typeof data.answer === "object" && data.answer !== null) {
          botMessage = Object.values(data.answer).join(", ");
        } else {
          botMessage = data.answer;
        }
      } else if (data.message) {
        botMessage = data.message;
      }

      // Update session_id if API returns a new one
      if (data.session_id && data.session_id !== sessionId) {
        localStorage.setItem("session_id", data.session_id);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botMessage },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error fetching insights." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);
    fetchInsights(input.trim());
    setInput("");
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-[75vh] bg-slate-800 rounded-xl p-4">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2 border border-slate-700 rounded-md bg-slate-900">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === "user" ? "bg-[#795EFF] text-white" : "bg-slate-700 text-slate-100"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          {loading && <div className="text-center text-slate-400 text-sm">Loading insights...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={input}
            placeholder="Type your question..."
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#795EFF]"
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button onClick={handleSend} disabled={loading} className="p-2 bg-[#795EFF] hover:bg-[#6a4be8] rounded-lg text-white flex items-center justify-center">
            <Send size={18} />
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}