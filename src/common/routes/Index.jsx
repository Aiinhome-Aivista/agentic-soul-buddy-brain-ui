import { Routes, Route, Navigate } from "react-router-dom"
import DefaultLayout from "../layout/DefaultLayout"
import Dashboard from "../../pages/dashboard/Dashboard"
import UploadFiles from "../../pages/uploadFiles/UploadFiles"
import Analysis from "../../pages/analysis/Analysis"
import AnalysisDashboard from "../../pages/analysis/Analysis"
import Expert from "../../pages/expert/Expert"
import ClientDetails from "../../pages/expert/ClientDetails"
import SessionDetails from "../../pages/expert/SessionDetails"
import Login from "../../pages/auth/Login"
import ProtectedRoute from "./ProtectedRoute"

function Index() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes with Role-Based Access */}
      {/* Home - Only super_admin */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute 
            element={<DefaultLayout><Dashboard /></DefaultLayout>} 
            allowedRoles={['super_admin']} 
          />
        } 
      />

      {/* Upload - super_admin and admin */}
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute 
            element={<DefaultLayout><UploadFiles /></DefaultLayout>} 
            allowedRoles={['super_admin', 'admin']} 
          />
        } 
      />

      {/* Analysis - Only super_admin */}
      <Route 
        path="/analysis" 
        element={
          <ProtectedRoute 
            element={<DefaultLayout><Analysis /></DefaultLayout>} 
            allowedRoles={['super_admin']} 
          />
        } 
      />

      {/* Expert Pages - super_admin and expert */}
      <Route 
        path="/expert" 
        element={
          <ProtectedRoute 
            element={<DefaultLayout><Expert /></DefaultLayout>} 
            allowedRoles={['super_admin', 'expert']} 
          />
        } 
      />
      <Route 
        path="/expert/client/:userId" 
        element={
          <ProtectedRoute 
            element={<DefaultLayout><ClientDetails /></DefaultLayout>} 
            allowedRoles={['super_admin', 'expert']} 
          />
        } 
      />
      <Route 
        path="/session/:sessionId" 
        element={
          <ProtectedRoute 
            element={<DefaultLayout><SessionDetails /></DefaultLayout>} 
            allowedRoles={['super_admin', 'expert']} 
          />
        } 
      />

      {/* Fallback - Redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default Index