import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactClient } from "./ContactClient";
export const metadata = { title: "Contact Us — HampiStays" };
export default function ContactPage() {
  return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><ContactClient /></main><Footer /></div>;
}
