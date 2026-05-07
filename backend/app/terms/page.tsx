import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TermsClient } from "./TermsClient";
export const metadata = { title: "Terms of Service — HampiStays" };
export default function TermsPage() {
  return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><TermsClient /></main><Footer /></div>;
}
