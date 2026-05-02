import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-sand-50">
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-serif text-forest-950 font-bold mb-4">{title}</h1>
      <p className="text-stone-600">Coming soon.</p>
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
        {/* Auth Routes (Standalone without global Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/resorts" element={<PlaceholderPage title="Our Resorts" />} />
          <Route path="/experiences" element={<PlaceholderPage title="Experiences" />} />
          <Route path="/about" element={<PlaceholderPage title="Our Story" />} />
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
