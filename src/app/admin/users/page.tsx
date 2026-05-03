"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/admin");
    }
  }, [user, router]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "author"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await fetcher<User[]>("/api/users");
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetcher("/api/users", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setIsAdding(false);
      setFormData({ name: "", email: "", password: "", role: "author" });
      fetchUsers();
    } catch (err) {
      alert("Gagal menambah user. Email mungkin sudah digunakan.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 mb-2 block">← Back to Dashboard</Link>
          <h1 className="text-4xl font-serif font-bold text-gray-900">User Management</h1>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          {isAdding ? "Cancel" : "Add New User"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddUser} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-10 max-w-2xl">
          <h2 className="text-xl font-bold mb-6">Create New Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 outline-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="author">Author (Create Posts)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
            Create User
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Name</th>
              <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Email</th>
              <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Role</th>
              <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-5 text-gray-500">{u.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-gray-500 text-sm">
                  {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
