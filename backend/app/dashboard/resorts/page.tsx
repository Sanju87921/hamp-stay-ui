import { auth } from "@/auth";
import { DashboardLayout } from "../DashboardLayout";
import { redirect } from "next/navigation";
import { Hotel, Plus, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function MyResortsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RESORT_OWNER") {
    redirect("/dashboard");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  const resorts = await db.resort.findMany({
    where: { ownerId: session.user.id },
  });

  return (
    <DashboardLayout role="RESORT_OWNER" user={user as any}>
      <div className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy-950 mb-2">My Resorts</h1>
            <p className="text-navy-950/50">Manage your property listings and visibility.</p>
          </div>
          <Link
            href="/dashboard/resorts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gold-500 transition-all duration-300 shadow-lg shadow-gold-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Link>
        </div>

        {resorts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-sand-300 p-16 text-center">
            <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hotel className="w-10 h-10 text-sand-400" />
            </div>
            <h3 className="text-xl font-bold text-navy-950 mb-2">No resorts found</h3>
            <p className="text-navy-950/50 max-w-sm mx-auto mb-8">
              Start your journey as a resort partner by listing your first property in Hampi.
            </p>
            <Link
              href="/dashboard/resorts/new"
              className="inline-flex px-8 py-4 bg-navy-950 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 transition-all duration-300"
            >
              List Your Resort
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resorts.map((resort) => (
              <div key={resort.id} className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden group">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={resort.images[0]}
                    alt={resort.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-navy-950 shadow-sm">
                    {resort.status}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-navy-950 font-serif">{resort.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      <span className="text-xs font-bold text-navy-950">{resort.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-navy-950/50 text-xs mb-6">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{(resort.location as any).area}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gold-500 hover:text-navy-950 transition-all">
                      Edit Listing
                    </button>
                    <button className="px-4 py-2.5 border border-sand-200 text-navy-950 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-sand-100 transition-all">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
