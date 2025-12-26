import React from "react";
function Footer() {
  return (
    <footer className="text-gray-300 py-4">
      <div className="container flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="font-semibold text-white">
            Intelligent Data Analysis Tool
          </h2>
          <p className="text-gray-400">
            Analyze multiple database formats with AI-powered insights
          </p>
        </div>
        <div className="text-center md:text-right text-gray-400">
          Supports CSV, SQL, Excel, and XML formats
        </div>
      </div>
    </footer>
  );
};
export default Footer;
