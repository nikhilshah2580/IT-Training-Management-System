import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Upload,
  LoaderCircle,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { setAuth } from "../../redux/authSlice";
import { getCurrentUser } from "../../api/auth.services";
import { updateProfile, changePassword } from "../../api/profile.services";
import { profileSchema, passwordSchema } from "../../schemas/profile.schema";

const FormInput = ({ icon: Icon, label, error, helperText, ...props }) => (
  <div className="w-full">
    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Icon className="h-4 w-4" />
      </div>
      <input
        {...props}
        className={`block w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl placeholder-gray-400 
        transition-all duration-200 outline-none text-sm font-medium
        ${
          error
            ? "focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
        }`}
      />
    </div>
    {error ? (
      <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
        <AlertCircle size={13} /> {error}
      </p>
    ) : helperText ? (
      <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>
    ) : null}
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  // Navigation & Active View State
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // Password State
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation Errors State
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // UI States
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.photo || null);

  // Sync Redux state with local form state
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setAvatarPreview(user.photo || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Submit Profile Updates with Zod Validation
  const saveProfile = async (e) => {
    e.preventDefault();

    const result = profileSchema.safeParse(profile);
    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setProfileErrors(formattedErrors);
      return;
    }

    setProfileErrors({});
    setLoadingProfile(true);

    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, v);
      });

      if (selectedFile) {
        fd.append("photo", selectedFile);
      }

      const r = await updateProfile(fd);
      const me = await getCurrentUser();
      dispatch(setAuth(me.user || r.user));

      toast.success(r.message || "Profile updated successfully");
      setSelectedFile(null);
      const fileInput = document.getElementById("photo");
      if (fileInput) fileInput.value = null;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Submit Password Change with Zod Validation
  const savePassword = async (e) => {
    e.preventDefault();

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setPasswordErrors(formattedErrors);
      return;
    }

    setPasswordErrors({});
    setLoadingPassword(true);

    try {
      const r = await changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
        confirmPassword: password.confirmPassword,
      });

      toast.success(r.message || "Password changed successfully");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/70 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 inline-flex items-center gap-1">
                <Sparkles size={12} /> Enterprise Account
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
              Account Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage your profile information, credentials, and account
              settings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-400">Signed in as</p>
              <p className="text-xs font-bold text-gray-700">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Sidebar Navigation */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-xs">
              <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                <div className="relative">
                  <img
                    src={
                      avatarPreview ||
                      `https://api.dicebear.com/8.x/notionists/svg?seed=${profile.fullName}`
                    }
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 bg-gray-50 shadow-inner"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-bold text-gray-900 truncate text-sm">
                    {user?.fullName || "User"}
                  </h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <UserCheck size={12} className="text-emerald-500" />{" "}
                    Verified Member
                  </p>
                </div>
              </div>

              <nav className="mt-4 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === "profile"
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} /> Personal Information
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === "security"
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck size={16} /> Security & Passwords
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Card Area */}
          <div className="md:col-span-8">
            {/* Tab 1: Profile Information */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xs overflow-hidden animate-fadeIn">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">
                      Profile Details
                    </h2>
                    <p className="text-xs text-gray-500">
                      Update your account profile information and avatar.
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <User size={18} />
                  </div>
                </div>

                <form onSubmit={saveProfile} className="p-6 space-y-6">
                  {/* Avatar Upload Banner */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                    <img
                      src={
                        avatarPreview ||
                        `https://api.dicebear.com/8.x/notionists/svg?seed=${profile.fullName}`
                      }
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-white shadow-xs"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="photo"
                        className="cursor-pointer inline-flex items-center gap-2 bg-white px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs"
                      >
                        <Upload size={13} />
                        Change Avatar
                      </label>
                      <input
                        name="photo"
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        PNG, JPG or WEBP (Max 5MB)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      icon={User}
                      label="Full Name"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      placeholder="Enter full name"
                      error={profileErrors.fullName}
                      required
                    />
                    <FormInput
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="block w-full pl-10 pr-4 py-2.5 bg-gray-100 text-gray-400 border border-gray-200 rounded-xl text-sm cursor-not-allowed"
                      helperText="Email cannot be edited directly."
                    />
                    <FormInput
                      icon={Phone}
                      label="Phone Number"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 000-0000"
                      error={profileErrors.phone}
                    />
                    <FormInput
                      icon={MapPin}
                      label="Location / Address"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      placeholder="City, Country"
                      error={profileErrors.address}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={loadingProfile}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 shadow-xs shadow-blue-200 min-w-32.5"
                    >
                      {loadingProfile ? (
                        <>
                          <LoaderCircle className="animate-spin" size={15} />{" "}
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Security & Password */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xs overflow-hidden animate-fadeIn">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">
                      Password & Security
                    </h2>
                    <p className="text-xs text-gray-500">
                      Ensure your account is using a strong password.
                    </p>
                  </div>
                  <div className="bg-gray-100 text-gray-700 p-2 rounded-xl">
                    <KeyRound size={18} />
                  </div>
                </div>

                <form onSubmit={savePassword} className="p-6 space-y-5">
                  <FormInput
                    icon={Lock}
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    error={passwordErrors.currentPassword}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <FormInput
                      icon={Lock}
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                      error={passwordErrors.newPassword}
                    />
                    <FormInput
                      icon={Lock}
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                      error={passwordErrors.confirmPassword}
                    />
                  </div>

                  {password.newPassword &&
                    password.newPassword === password.confirmPassword &&
                    password.newPassword.length >= 6 && (
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50/80 p-3 rounded-xl border border-emerald-100">
                        <CheckCircle2 size={15} /> Passwords match and meet
                        strength requirements.
                      </div>
                    )}

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 font-semibold text-white text-sm hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs min-w-35"
                    >
                      {loadingPassword ? (
                        <>
                          <LoaderCircle className="animate-spin" size={15} />{" "}
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
