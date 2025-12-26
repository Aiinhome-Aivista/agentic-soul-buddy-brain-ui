import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../../style/layout.css"
import { useLocation } from "react-router-dom";

const DefaultLayout = ({ children }) => {
  const location = useLocation();

  // Hide header for /analysis route
  const hideHeader = location.pathname === "/analysis";

  return (
    <div className='grid-container'>
      {!hideHeader && (
        <header className="header">
          <Header />
        </header>
      )}
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  )
}

export default DefaultLayout;
