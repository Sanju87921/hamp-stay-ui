"use client";

import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { TrendingUp, Users, Hotel, Star, IndianRupee } from "lucide-react";
import { cn } from "@/utils/cn";

interface AnalyticsProps {
  data: any;
}

export function OwnerAnalytics({ data }: AnalyticsProps) {
  if (!data) return null;

  const { revenueChart, propertyPerformance, metrics } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Revenue" 
          value={`₹${metrics.totalRevenue.toLocaleString()}`} 
          icon={IndianRupee}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <MetricCard 
          label="Total Bookings" 
          value={metrics.totalBookings} 
          icon={Users}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <MetricCard 
          label="Current Stays" 
          value={metrics.activeStays} 
          icon={Hotel}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <MetricCard 
          label="Average Rating" 
          value="4.8" // Placeholder or calculate
          icon={Star}
          color="text-gold-600"
          bg="bg-gold-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-serif font-bold text-navy-950">Revenue Trends</h3>
            <span className="text-[10px] font-bold text-navy-950/40 uppercase tracking-widest bg-sand-50 px-2 py-1 rounded">Last 6 Months</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d44c30" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d44c30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#d44c30" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Comparison */}
        <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-serif font-bold text-navy-950">Property Performance</h3>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" radius={[0, 10, 10, 0]} barSize={20}>
                  {propertyPerformance.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#072b1d' : '#d4b062'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm group hover:border-gold-400 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div className="h-1 w-8 bg-sand-100 rounded-full" />
      </div>
      <p className="text-xs font-bold text-navy-950/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-serif font-bold text-navy-950">{value}</p>
    </div>
  );
}
