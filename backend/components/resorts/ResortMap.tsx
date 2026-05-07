"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Resort } from "@/types/resort";
import "leaflet/dist/leaflet.css";

interface ResortMapProps {
  resorts: Resort[];
  className?: string;
}

export function ResortMap({ resorts, className = "" }: ResortMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!mounted || !mapRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Custom terracotta pin icon
      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="
          background: #d44c30;
          color: white;
          border-radius: 50% 50% 50% 0;
          width: 36px;
          height: 36px;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(212,76,48,0.4);
          border: 3px solid white;
        ">
          <span style="transform: rotate(45deg); font-size: 14px;">🏨</span>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -40],
      });

      // Center on Hampi
      const center: [number, number] =
        resorts.length > 0
          ? [resorts[0].location.lat, resorts[0].location.lng]
          : [15.335, 76.46];

      const map = L.map(mapRef.current, {
        center,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      resorts.forEach((resort) => {
        const marker = L.marker([resort.location.lat, resort.location.lng], {
          icon: pinIcon,
        }).addTo(map);

        marker
          .bindPopup(
            `<div style="font-family: Inter, sans-serif; min-width: 200px;">
              <img src="${resort.images[0]}" alt="${resort.name}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />
              <div style="font-weight: 700; font-size: 14px; color: #072b1d; margin-bottom: 4px;">${resort.name}</div>
              <div style="color: #78716c; font-size: 12px; margin-bottom: 6px;">${resort.location.area}, Hampi</div>
              <div style="color: #d44c30; font-weight: 700; font-size: 14px;">₹${resort.pricePerNight.toLocaleString("en-IN")}<span style="color:#78716c;font-weight:400;font-size:11px;">/night</span></div>
              <button
                onclick="window.__hampiNavigate?.('/resorts/${resort.slug}')"
                style="margin-top:8px;background:#072b1d;color:white;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;width:100%;"
              >View Resort</button>
            </div>`,
            { maxWidth: 240, className: "hampi-popup" }
          );
      });

      // Expose navigate to popup button
      (window as unknown as Record<string, unknown>)["__hampiNavigate"] = (path: string) => router.push(path);
    }

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [resorts, router]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full rounded-3xl overflow-hidden z-0 ${className}`}
      style={{ minHeight: "500px" }}
    />
  );
}
