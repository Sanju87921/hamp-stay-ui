import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Resorts } from "./pages/Resorts";
import { ResortDetail } from "./pages/ResortDetail";
import { ResortCompare } from "./pages/ResortCompare";
import { ForgotPassword } from "./pages/ForgotPassword";

// Placeholder Pages (for routes not yet built)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-sand-50">
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-serif text-navy-950 font-bold mb-4">{title}</h1>
      <p className="text-navy-950/60">Coming soon.</p>
    </div>
  </div>
);

// Layout with Navbar and Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (Standalone — no Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Routes (with Navbar + Footer) */}
        <Route element={<MainLayout />}>
          {/* Phase 1 */}
          <Route path="/" element={<Home />} />

          {/* Phase 2 — Search & Discovery */}
          <Route path="/resorts" element={<Resorts />} />
          <Route path="/resorts/compare" element={<ResortCompare />} />
          <Route path="/resorts/:slug" element={<ResortDetail />} />

          {/* Placeholder routes (future phases) */}
          <Route path="/experiences" element={<PlaceholderPage title="Experiences" />} />
          <Route path="/about" element={<PlaceholderPage title="Our Story" />} />

          {/* 404 */}
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

