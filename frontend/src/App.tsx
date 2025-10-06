import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
const App = () => (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<HomePage />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Index />} />
    <Route path="/signup" element={<SignUp />} />

    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
