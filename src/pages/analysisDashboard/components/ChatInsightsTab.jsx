import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatInsightsTab = () => {
  const [insights, setInsights] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // API call
  const fetchInsights = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.post("http://192.168.1.77:3031/insights_chat", {
        user_query: "",
        page: pageNum,
      });
      const data = response.data;

      if (data && data.insights) {
        setInsights((prev) =>
          pageNum === 1 ? data.insights : prev + "\n\n" + data.insights
        );
        setHasMore(data.has_more);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(1);
  }, []);

  const handleLoadMore = () => {
    fetchInsights(page + 1);
  };

  // --- Simple UI Components ---
  const Card = ({ children }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-md text-white w-full">
      {children}
    </div>
  );

  const CardContent = ({ children }) => (
    <div className="p-4">{children}</div>
  );

  const Button = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-xl text-white font-semibold transition-colors duration-200 ${
        disabled
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {children}
    </button>
  );

  // --- Main Render ---
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Chat Insights</h2>

      {loading && insights === "" ? (
        <p>Loading insights...</p>
      ) : (
        <Card>
          <CardContent>
            <ReactMarkdown className="prose prose-invert max-w-none">
              {insights}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading more..." : "Do you want more insights?"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInsightsTab;
