import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutClient } from "./AboutClient";
export const metadata = { title: "Our Story — HampiStays" };
export default function AboutPage() {
  return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><AboutClient /></main><Footer /></div>;
}
