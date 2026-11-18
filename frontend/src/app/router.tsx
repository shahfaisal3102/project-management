import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);