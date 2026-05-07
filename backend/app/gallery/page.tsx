import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GalleryClient } from "./GalleryClient";
export const metadata = { title: "Gallery — HampiStays" };
export default function GalleryPage() {
  return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><GalleryClient /></main><Footer /></div>;
}
