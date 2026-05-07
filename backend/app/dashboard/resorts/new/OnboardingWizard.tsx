"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hotel, 
  MapPin, 
  Wifi, 
  Image as ImageIcon, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createResortAction } from "@/actions/resorts";

const STEPS = [
  { id: "basic", title: "Basic Info", icon: Hotel },
  { id: "location", title: "Location", icon: MapPin },
  { id: "amenities", title: "Amenities", icon: Wifi },
  { id: "rooms", title: "Rooms", icon: CreditCard },
  { id: "media", title: "Media", icon: ImageIcon },
];

const AMENITY_OPTIONS = [
  "Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym", "Parking", "Room Service", "Airport Shuttle", "Pet Friendly"
];

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    type: "luxury",
    location: {
      area: "",
      district: "Vijayanagara",
      state: "Karnataka",
      lat: 15.335,
      lng: 76.46,
      distanceFromCenterKm: 5,
    },
    pricePerNight: 0,
    amenities: [] as string[],
    images: [] as string[],
    roomTypes: [
      { name: "Deluxe Suite", description: "A luxury suite with a view.", pricePerNight: 12000, capacity: 2, amenities: ["WiFi", "AC"] }
    ],
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { name: "", description: "", pricePerNight: 0, capacity: 2, amenities: [] }],
    }));
  };

  const removeRoomType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index),
    }));
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const newRooms = [...formData.roomTypes];
    (newRooms[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, roomTypes: newRooms }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate overall min price from room types
      const minPrice = formData.roomTypes.length > 0 
        ? Math.min(...formData.roomTypes.map(r => r.pricePerNight))
        : 0;
      const finalData = { ...formData, pricePerNight: minPrice };
      
      const result = await createResortAction(finalData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        alert("Failed to create resort. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-sand-200 -translate-y-1/2 z-0" />
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStep;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive ? "bg-gold-600 text-white shadow-lg shadow-gold-600/20" : "bg-white text-navy-400 border border-sand-200"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isActive ? "text-navy-900" : "text-navy-400"}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 md:p-12 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-navy-950">Property Details</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-widest mb-2">Resort Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Hampi Heritage Resort"
                        className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-gold-600 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-widest mb-2">Tagline</label>
                      <input 
                        type="text" 
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                        placeholder="e.g. Luxury amidst history"
                        className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-gold-600 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell travellers about your unique stay..."
                        className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-gold-600 focus:ring-0 transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-navy-950">Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-widest mb-2">Area (e.g. Hampi Island, Anegundi)</label>
                      <input 
                        type="text" 
                        value={formData.location.area}
                        onChange={(e) => handleLocationChange("area", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-gold-600 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-widest mb-2">Distance from Virupaksha Temple (KM)</label>
                      <input 
                        type="number" 
                        value={formData.location.distanceFromCenterKm}
                        onChange={(e) => handleLocationChange("distanceFromCenterKm", parseFloat(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-gold-600 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-navy-950">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          formData.amenities.includes(amenity)
                            ? "bg-gold-50 border-gold-600 text-gold-900"
                            : "bg-white border-sand-200 text-navy-600 hover:border-sand-300"
                        }`}
                      >
                        <span className="text-sm font-medium">{amenity}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-navy-950">Room Types</h2>
                    <button 
                      onClick={addRoomType}
                      className="text-xs font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1 hover:text-gold-700"
                    >
                      <Plus className="w-4 h-4" /> Add Room
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.roomTypes.map((room, index) => (
                      <div key={index} className="p-6 bg-sand-50 rounded-2xl border border-sand-100 relative group">
                        <button 
                          onClick={() => removeRoomType(index)}
                          className="absolute top-4 right-4 text-navy-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Room Name (e.g. River View Suite)"
                            value={room.name}
                            onChange={(e) => handleRoomChange(index, "name", e.target.value)}
                            className="px-4 py-2 rounded-lg border border-sand-200 focus:border-gold-600 outline-none"
                          />
                          <input 
                            type="number" 
                            placeholder="Price Per Night (₹)"
                            value={room.pricePerNight}
                            onChange={(e) => handleRoomChange(index, "pricePerNight", parseFloat(e.target.value))}
                            className="px-4 py-2 rounded-lg border border-sand-200 focus:border-gold-600 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-navy-950">Property Media</h2>
                  <p className="text-navy-950/50 text-sm">Add URLs for your property photos. We recommend high-quality images of the facade, rooms, and views.</p>
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <input 
                        key={i}
                        type="url" 
                        placeholder={`Image URL #${i + 1}`}
                        value={formData.images[i] || ""}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[i] = e.target.value;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-gold-600 focus:ring-0 outline-none"
                      />
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-gold-50 rounded-2xl border border-gold-100 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-gold-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-navy-950 text-sm">Almost there!</h4>
                      <p className="text-xs text-navy-950/60 leading-relaxed mt-1">By submitting, your resort will be created as a "Draft". It will be visible to you in your dashboard, but will only go live after verification by our team.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-8 border-t border-sand-100 flex justify-between items-center bg-sand-50/50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-navy-600 disabled:opacity-0 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name}
              className="flex items-center gap-2 px-8 py-3 bg-gold-600 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gold-500 transition-all disabled:bg-sand-300"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "List Property"}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-navy-950 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-navy-800 transition-all"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
