"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { PostData } from "@/types";
import { TrendingUp, Eye, BookOpen, Clock } from "lucide-react";

interface AnalyticsDashboardProps {
  posts: PostData[];
}

const COLORS = ["#0f172a", "#334155", "#475569", "#64748b", "#94a3b8"];

export default function AnalyticsDashboard({ posts }: AnalyticsDashboardProps) {
  // 1. Data untuk Bar Chart: Top 7 Posts by Views
  const topPostsData = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 7)
      .map((p) => ({
        name: p.title.length > 20 ? p.title.slice(0, 20) + "..." : p.title,
        views: p.views || 0,
      }));
  }, [posts]);

  // 2. Data untuk Pie Chart: Published vs Drafts
  const statusData = useMemo(() => {
    const published = posts.filter((p) => p.published).length;
    const drafts = posts.length - published;
    return [
      { name: "Published", value: published },
      { name: "Drafts", value: drafts },
    ];
  }, [posts]);

  // 3. Hitung total views
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const avgReadingTime = posts.length > 0 
    ? (posts.reduce((acc, p) => acc + (p.readingTime || 0), 0) / posts.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Views" 
          value={totalViews.toLocaleString()} 
          icon={<Eye size={20} />} 
          trend="+12%" // Static placeholder for now
        />
        <StatCard 
          title="Total Articles" 
          value={posts.length.toString()} 
          icon={<BookOpen size={20} />} 
        />
        <StatCard 
          title="Avg. Read Time" 
          value={`${avgReadingTime}m`} 
          icon={<Clock size={20} />} 
        />
        <StatCard 
          title="Conversion" 
          value="4.2%" 
          icon={<TrendingUp size={20} />} 
          trend="+0.5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart: Views Distribution */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Content Performance</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top 7 Articles</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPostsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="views" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Status Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs font-bold text-gray-500 uppercase">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 border border-gray-100">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</div>
      <div className="text-2xl font-serif font-bold text-gray-900">{value}</div>
    </div>
  );
}
