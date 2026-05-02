import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-stone-300 pt-20 pb-10 border-t border-forest-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="w-10 h-10 rounded-full bg-terracotta-600 flex items-center justify-center text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-semibold text-white tracking-tight">
                HampiStays
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Experience the pinnacle of luxury eco-tourism in the heart of the ancient Vijayanagara empire.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="px-4 py-2 rounded-full bg-forest-900 hover:bg-terracotta-600 hover:text-white transition-colors text-sm font-medium"
              >
                Instagram
              </a>

              <a
                href="#"
                className="px-4 py-2 rounded-full bg-forest-900 hover:bg-terracotta-600 hover:text-white transition-colors text-sm font-medium"
              >
                Twitter
              </a>

              <a
                href="#"
                className="px-4 py-2 rounded-full bg-forest-900 hover:bg-terracotta-600 hover:text-white transition-colors text-sm font-medium"
              >
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/resorts" className="hover:text-terracotta-500 transition-colors">Our Resorts</Link></li>
              <li><Link to="/experiences" className="hover:text-terracotta-500 transition-colors">Experiences</Link></li>
              <li><Link to="/about" className="hover:text-terracotta-500 transition-colors">Our Story</Link></li>
              <li><Link to="/gallery" className="hover:text-terracotta-500 transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-terracotta-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-terracotta-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-terracotta-500 transition-colors">Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-terracotta-500 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                <span className="text-sm">123 Heritage Route, Kamalapura, Hampi, Karnataka 583239</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-terracotta-500 shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-terracotta-500 shrink-0" />
                <span className="text-sm">reservations@hampistays.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} HampiStays. All rights reserved.</p>
          <p>Designed for Luxury & Heritage</p>
        </div>
      </div>
    </footer>
  );
}
