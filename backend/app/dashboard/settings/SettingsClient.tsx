"use client";

import { useSession } from "next-auth/react";
import { User, Shield, Camera, Phone, Mail, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfileAction, changePasswordAction } from "@/actions/user";
import { cn } from "@/utils/cn";
import { User as UserType } from "@prisma/client";

export function SettingsClient({ user }: { user: UserType }) {
  const { update } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: user.name || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
  });

  // Password Form State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    
    const result = await updateProfileAction(profile);
    if (result.success) {
      // Update client session to refresh sidebar
      await update({ name: profile.name });
      setStatus({ type: 'success', message: 'Profile updated successfully' });
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to update profile' });
    }
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }
    
    setIsLoading(true);
    setStatus(null);
    
    const result = await changePasswordAction({
      currentPassword: passwords.current,
      newPassword: passwords.new
    });

    if (result.success) {
      setStatus({ type: 'success', message: 'Password changed successfully' });
      setPasswords({ current: "", new: "", confirm: "" });
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to change password' });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
            activeTab === "profile" ? "bg-navy-950 text-white shadow-lg" : "text-navy-950/40 hover:bg-sand-100"
          )}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
            activeTab === "security" ? "bg-navy-950 text-white shadow-lg" : "text-navy-950/40 hover:bg-sand-100"
          )}
        >
          <Shield className="w-4 h-4" />
          Security
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-white rounded-[40px] border border-sand-200 shadow-luxury overflow-hidden"
        >
          <form onSubmit={activeTab === 'profile' ? handleProfileSubmit : handlePasswordSubmit} className="p-8 md:p-12">
            {status && (
              <div className={cn(
                "mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300",
                status.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
              )}>
                {status.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-bold">{status.message}</p>
              </div>
            )}

            {activeTab === 'profile' ? (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-sand-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-sand-300" />
                      )}
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 p-2 bg-gold-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-navy-950 mb-1">Public Profile</h3>
                    <p className="text-sm text-navy-950/50">Your identity on the HampiStays platform.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-sand-50 border border-sand-100 rounded-2xl text-navy-950 font-bold focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-sand-50 border border-sand-100 rounded-2xl text-navy-950 font-bold focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-2">Email Address (Locked)</label>
                    <div className="relative opacity-60">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-12 pr-4 py-4 bg-sand-100 border border-sand-200 rounded-2xl text-navy-950 font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-navy-950 mb-1">Account Security</h3>
                  <p className="text-sm text-navy-950/50 mb-8">Update your credentials to stay protected.</p>
                </div>

                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                      className="w-full px-4 py-4 bg-sand-50 border border-sand-100 rounded-2xl text-navy-950 font-bold focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                      className="w-full px-4 py-4 bg-sand-50 border border-sand-100 rounded-2xl text-navy-950 font-bold focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      className="w-full px-4 py-4 bg-sand-50 border border-sand-100 rounded-2xl text-navy-950 font-bold focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-navy-950 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 transition-all duration-500"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
