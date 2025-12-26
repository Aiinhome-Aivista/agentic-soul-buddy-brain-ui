import { Routes, Route, Navigate } from "react-router-dom"
import DefaultLayout from "../layout/DefaultLayout"
import Dashboard from "../../pages/dashboard/Dashboard"
import UploadFiles from "../../pages/uploadFiles/UploadFiles"
import Analysis from "../../pages/analysis/Analysis"
import AnalysisDashboard from "../../pages/analysis/Analysis"

function Index() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
      {/* <Route path="/" element={<DefaultLayout><Dashboard /></DefaultLayout>} /> */}
      <Route path="/upload" element={<DefaultLayout><UploadFiles /></DefaultLayout>} />
      <Route path="/analysis" element={<DefaultLayout><Analysis /></DefaultLayout>} />
    </Routes>
  )
}

export default Index