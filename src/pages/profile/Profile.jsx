import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Dummy Data ───────────────────────────────────────────────
const USER = {
    fullname: "Brijbihari Awadhiya",
    email: "brij@mediaflow.app",
    plan: "pro",
    joinedAt: "January 2025",
};

const PLANS = {
    free: {
        label: "Free",
        color: "text-[#888]",
        bg: "bg-[#1e1e1e]",
        border: "border-[#2e2e2e]",
        maxFileSizeMB: 50,
        monthlyUploads: 10,
        allowVideo: false,
    },
    pro: {
        label: "Pro",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        maxFileSizeMB: 500,
        monthlyUploads: 100,
        allowVideo: true,
    },
    business: {
        label: "Business",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        maxFileSizeMB: 2048,
        monthlyUploads: 500,
        allowVideo: true,
    },
};

const UPGRADE_PLANS = [
    {
        key: "pro",
        name: "Pro",
        price: "$12/mo",
        perks: ["100 uploads / month", "500 MB max file size", "Video processing"],
        highlight: true,
    },
    {
        key: "business",
        name: "Business",
        price: "$39/mo",
        perks: ["500 uploads / month", "2 GB max file size", "Webhooks + priority support"],
        highlight: false,
    },
];

// ── Navbar (same as Dashboard) ───────────────────────────────
function Navbar({ initials }) {
    return (
        <nav className="bg-[#161616] border-b border-[#2a2a2a] px-7 h-14 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-8">
                <Link to="/" className='font-["DM_Mono",monospace] text-[13px] tracking-widest text-blue-400 uppercase font-medium'>
                    MediaFlow
                </Link>
                <div className="flex gap-6">
                    {["Dashboard", "Files", "Settings"].map((link) => (
                        <Link
                            key={link}
                            to={link === "Dashboard" ? "/dashboard" : "#"}
                            className="text-[13px] text-[#666] hover:text-[#aaa] transition-colors pb-0.5"
                        >
                            {link}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Link
                    to="/dashboard"
                    className="bg-[#1e1e1e] hover:bg-[#242424] border border-[#2e2e2e] text-[#aaa] text-[13px] font-medium px-4 py-[7px] rounded-lg transition-all flex items-center gap-1.5"
                >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to dashboard
                </Link>
                <div className="w-8 h-8 rounded-full bg-[#1e2a3a] border border-[#2e2e2e] flex items-center justify-center text-[12px] font-medium text-blue-400">
                    {initials}
                </div>
            </div>
        </nav>
    );
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ children }) {
    return (
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            {children}
        </div>
    );
}

function SectionHeader({ title, desc }) {
    return (
        <div className="px-6 py-5 border-b border-[#242424]">
            <p className="text-[14px] font-medium text-[#e8e8e8]">{title}</p>
            {desc && <p className="text-[12px] text-[#555] mt-0.5">{desc}</p>}
        </div>
    );
}

// ── Field Row ────────────────────────────────────────────────
function FieldRow({ label, value, action, actionLabel = "Edit", actionColor = "text-blue-400" }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e] last:border-0">
            <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-medium text-[#555] uppercase tracking-[0.06em]">{label}</p>
                <p className="text-[14px] text-[#c0c0c0]">{value}</p>
            </div>
            {action && (
                <button
                    onClick={action}
                    className={`text-[12px] font-medium transition-colors cursor-pointer ${actionColor} hover:opacity-80`}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

// ── Main Profile Page ─────────────────────────────────────────
export default function ProfilePage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: USER.fullname,
        email: USER.email,
    });
    const [editingField, setEditingField] = useState(null); // "fullname" | "email" | null
    const [deleteInput, setDeleteInput] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");

    const currentPlan = PLANS[USER.plan];
    const initials = USER.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    function handleSave(field) {
        setEditingField(null);
        setSavedMsg(`${field === "fullname" ? "Name" : "Email"} updated successfully.`);
        setTimeout(() => setSavedMsg(""), 3000);
    }

    function handleDeleteAccount() {
        if (deleteInput === USER.email) {
            // call your delete API here
            navigate("/auth/signup");
        }
    }

    return (
        <div className='min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-["DM_Sans",sans-serif]'>
            <Navbar initials={initials} />

            <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-5">

                {/* ── Avatar + Name header ── */}
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#1e2a3a] border border-[#2a2a2a] flex items-center justify-center text-[22px] font-semibold text-blue-400">
                        {initials}
                    </div>
                    <div>
                        <p className="text-[20px] font-semibold text-[#f0f0f0]">{formData.fullname}</p>
                        <p className="text-[13px] text-[#555] mt-0.5">
                            Member since {USER.joinedAt} ·{" "}
                            <span className={`font-medium ${currentPlan.color}`}>{currentPlan.label} plan</span>
                        </p>
                    </div>
                </div>

                {/* Success toast */}
                {savedMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-[13px]">
                        {savedMsg}
                    </div>
                )}

                {/* ── Personal Info ── */}
                <Section>
                    <SectionHeader title="Personal information" desc="Update your name and email address." />

                    {/* Full name */}
                    <div className="px-6 py-4 border-b border-[#1e1e1e]">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[11px] font-medium text-[#555] uppercase tracking-[0.06em]">Full name</p>
                            <button
                                onClick={() => setEditingField(editingField === "fullname" ? null : "fullname")}
                                className="text-[12px] font-medium text-blue-400 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                {editingField === "fullname" ? "Cancel" : "Edit"}
                            </button>
                        </div>
                        {editingField === "fullname" ? (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                    className="flex-1 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3 py-2 text-[13px] text-[#e8e8e8] placeholder-[#3a3a3a] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                                <button
                                    onClick={() => handleSave("fullname")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <p className="text-[14px] text-[#c0c0c0] mt-1">{formData.fullname}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[11px] font-medium text-[#555] uppercase tracking-[0.06em]">Email address</p>
                            <button
                                onClick={() => setEditingField(editingField === "email" ? null : "email")}
                                className="text-[12px] font-medium text-blue-400 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                {editingField === "email" ? "Cancel" : "Edit"}
                            </button>
                        </div>
                        {editingField === "email" ? (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="flex-1 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3 py-2 text-[13px] text-[#e8e8e8] placeholder-[#3a3a3a] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                                <button
                                    onClick={() => handleSave("email")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <p className="text-[14px] text-[#c0c0c0] mt-1">{formData.email}</p>
                        )}
                    </div>
                </Section>

                {/* ── Current Plan ── */}
                <Section>
                    <SectionHeader title="Your plan" desc="Manage your subscription and limits." />
                    <div className="px-6 py-5">

                        {/* Active plan badge */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border mb-5 ${currentPlan.bg} ${currentPlan.border}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${USER.plan === "free" ? "bg-[#888]" : USER.plan === "pro" ? "bg-blue-400" : "bg-violet-400"}`} />
                                <div>
                                    <p className={`text-[14px] font-semibold ${currentPlan.color}`}>
                                        {currentPlan.label} plan
                                    </p>
                                    <p className="text-[12px] text-[#555] mt-0.5">
                                        {USER.plan === "free" ? "Free forever" : "Billed monthly"}
                                    </p>
                                </div>
                            </div>
                            {USER.plan !== "free" && (
                                <button className="text-[12px] text-[#555] hover:text-red-400 transition-colors cursor-pointer">
                                    Cancel plan
                                </button>
                            )}
                        </div>

                        {/* Limits summary */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {[
                                { label: "Uploads / month", value: `${currentPlan.monthlyUploads}` },
                                {
                                    label: "Max file size",
                                    value:
                                        currentPlan.maxFileSizeMB >= 1024
                                            ? `${currentPlan.maxFileSizeMB / 1024} GB`
                                            : `${currentPlan.maxFileSizeMB} MB`,
                                },
                                { label: "Video processing", value: currentPlan.allowVideo ? "Enabled" : "Disabled" },
                            ].map((item) => (
                                <div key={item.label} className="bg-[#1a1a1a] border border-[#242424] rounded-xl p-3 text-center">
                                    <p className="text-[11px] text-[#555] mb-1">{item.label}</p>
                                    <p className='text-[13px] font-medium text-[#aaa] font-["DM_Mono",monospace]'>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Upgrade options — only show if not on business */}
                        {USER.plan !== "business" && (
                            <>
                                <p className="text-[11px] font-medium text-[#555] uppercase tracking-[0.06em] mb-3">
                                    Upgrade your plan
                                </p>
                                <div className="flex flex-col gap-3">
                                    {UPGRADE_PLANS.filter((p) =>
                                        USER.plan === "free" ? true : p.key === "business"
                                    ).map((plan) => (
                                        <div
                                            key={plan.key}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${plan.highlight
                                                ? "bg-blue-500/5 border-blue-500/20"
                                                : "bg-[#1a1a1a] border-[#242424]"
                                                }`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-[13px] font-semibold ${plan.highlight ? "text-blue-400" : "text-[#aaa]"}`}>
                                                        {plan.name}
                                                    </p>
                                                    {plan.highlight && (
                                                        <span className="text-[10px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded-md font-medium">
                                                            Recommended
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-3">
                                                    {plan.perks.map((perk) => (
                                                        <span key={perk} className="text-[11px] text-[#555]">
                                                            · {perk}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                                <span className='text-[13px] font-medium font-["DM_Mono",monospace] text-[#888]'>
                                                    {plan.price}
                                                </span>
                                                <Link
                                                    to="#"
                                                    className={`text-[12px] font-medium px-4 py-2 rounded-lg transition-all cursor-pointer ${plan.highlight
                                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                        : "bg-[#222] hover:bg-[#2a2a2a] text-[#aaa] border border-[#2e2e2e]"
                                                        }`}
                                                >
                                                    Upgrade
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </Section>

                {/* ── Danger Zone ── */}
                <Section>
                    <div className="px-6 py-5 border-b border-[#2a2a2a]">
                        <p className="text-[14px] font-medium text-red-400">Danger zone</p>
                        <p className="text-[12px] text-[#555] mt-0.5">
                            Permanent actions — these cannot be undone.
                        </p>
                    </div>
                    <div className="px-6 py-5">
                        {!showDeleteConfirm ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[13px] font-medium text-[#c0c0c0]">Delete account</p>
                                    <p className="text-[12px] text-[#555] mt-0.5">
                                        Permanently delete your account, all files, and processed media.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex-shrink-0 ml-6 text-[12px] font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-4 py-2 rounded-lg transition-all cursor-pointer"
                                >
                                    Delete account
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
                                    <p className="text-[13px] font-medium text-red-400 mb-1">This will permanently delete:</p>
                                    <ul className="text-[12px] text-[#666] flex flex-col gap-1 mt-2">
                                        <li>· Your account and profile data</li>
                                        <li>· All uploaded files from S3 storage</li>
                                        <li>· All processed media and thumbnails</li>
                                        <li>· Your job history and dashboard data</li>
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-[12px] text-[#555]">
                                        Type <span className='font-["DM_Mono",monospace] text-[#888] bg-[#1e1e1e] px-1.5 py-0.5 rounded'>{USER.email}</span> to confirm
                                    </p>
                                    <input
                                        type="email"
                                        placeholder={USER.email}
                                        value={deleteInput}
                                        onChange={(e) => setDeleteInput(e.target.value)}
                                        className="bg-[#1a1a1a] border border-red-500/20 rounded-lg px-3 py-2.5 text-[13px] text-[#e8e8e8] placeholder-[#3a3a3a] focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                                        className="flex-1 text-[13px] font-medium text-[#666] hover:text-[#aaa] bg-[#1e1e1e] hover:bg-[#242424] border border-[#2e2e2e] py-2.5 rounded-lg transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={deleteInput !== USER.email}
                                        className="flex-1 text-[13px] font-medium text-white bg-red-500/80 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed py-2.5 rounded-lg transition-all cursor-pointer"
                                    >
                                        Permanently delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Section>

            </div>
        </div>
    );
}