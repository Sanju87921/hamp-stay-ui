import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrivacyClient } from "./PrivacyClient";
export const metadata = { title: "Privacy Policy — HampiStays" };
export default function PrivacyPage() {
  return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><PrivacyClient /></main><Footer /></div>;
}
