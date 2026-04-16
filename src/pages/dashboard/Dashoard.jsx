import { useState } from "react";
import { Link } from "react-router-dom";

// ── Dummy Data ──────────────────────────────────────────────
const stats = [
    { label: "Total files", value: "1,284", sub: "+38 this week", subColor: "text-emerald-500" },
    { label: "Storage used", value: "47.2 GB", sub: "of 100 GB", subColor: "text-[#555]" },
    { label: "Jobs processed", value: "3,910", sub: "+124 today", subColor: "text-emerald-500" },
    { label: "Failed jobs", value: "6", sub: "last 24 hours", subColor: "text-[#555]", valueColor: "text-red-400" },
];

const queueItems = [
    { name: "product-launch-reel.mp4", meta: "Video compression · 2 min left", status: "Processing" },
    { name: "banner-hero-2x.png", meta: "Image resize · Completed", status: "Done" },
    { name: "team-offsite-day2.mov", meta: "Thumbnail generation · Waiting", status: "Queued" },
    { name: "corrupted-upload.avi", meta: "FFmpeg decode · Failed", status: "Failed" },
    { name: "ui-mockup-screens.zip", meta: "Batch image process · Waiting", status: "Queued" },
];

const recentUploads = [
    { name: "product-launch-reel.mp4", type: "MP4", size: "284 MB", time: "2 min ago", status: "Processing" },
    { name: "banner-hero-2x.png", type: "PNG", size: "4.1 MB", time: "18 min ago", status: "Done" },
    { name: "team-offsite-day2.mov", type: "MOV", size: "1.2 GB", time: "1 hr ago", status: "Queued" },
    { name: "corrupted-upload.avi", type: "AVI", size: "96 MB", time: "3 hr ago", status: "Failed" },
    { name: "logo-variants-v3.png", type: "PNG", size: "780 KB", time: "5 hr ago", status: "Done" },
    { name: "onboarding-walkthrough.mp4", type: "MP4", size: "512 MB", time: "Yesterday", status: "Done" },
];

const storageBreakdown = [
    { label: "Videos", value: 28, color: "bg-blue-500", bar: "bg-blue-500" },
    { label: "Images", value: 12, color: "bg-emerald-500", bar: "bg-emerald-500" },
    { label: "Thumbnails", value: 4.2, color: "bg-violet-400", bar: "bg-violet-400" },
    { label: "Other", value: 3, color: "bg-[#3a3a3a]", bar: "bg-[#3a3a3a]" },
];

const totalStorage = 100;

// ── Badge Component ─────────────────────────────────────────
const statusConfig = {
    Processing: { pill: "bg-blue-500/10 text-blue-400", dot: "bg-blue-500" },
    Done: { pill: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
    Queued: { pill: "bg-white/5 text-[#666]", dot: "bg-[#555]" },
    Failed: { pill: "bg-red-500/10 text-red-400", dot: "bg-red-400" },
};

function Badge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.Queued;
    return (
        <span className={`text-[11px] font-medium px-2 py-1 rounded-md ${cfg.pill}`}>
            {status}
        </span>
    );
}

// ── Upload Icon ─────────────────────────────────────────────
function UploadIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 10V3M8 3L5 6M8 3l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 11v1a2 2 0 002 2h6a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

// ── Queue Icon ──────────────────────────────────────────────
function QueueIcon({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.Queued;
    const iconColor = {
        Processing: "text-blue-400",
        Done: "text-emerald-400",
        Queued: "text-[#555]",
        Failed: "text-red-400",
    }[status] ?? "text-[#555]";

    const bgColor = {
        Processing: "bg-blue-500/10",
        Done: "bg-emerald-500/10",
        Queued: "bg-white/[0.03]",
        Failed: "bg-red-500/8",
    }[status] ?? "bg-white/[0.03]";

    return (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor} ${iconColor}`}>
            {status === "Processing" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 8l2-2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M8 6v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            )}
            {status === "Done" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
            {status === "Queued" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
            )}
            {status === "Failed" && (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            )}
        </div>
    );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
    const [activeNav, setActiveNav] = useState("Dashboard");
    const navLinks = ["Dashboard", "Files", "Settings"];

    return (
        <div className='min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-["DM_Sans",sans-serif]'>

            {/* ── Navbar ── */}
            <nav className="bg-[#161616] border-b border-[#2a2a2a] px-7 h-14 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-8">
                    <span className='font-["DM_Mono",monospace] text-[13px] tracking-widest text-blue-400 uppercase font-medium'>
                        MediaFlow
                    </span>
                    <div className="flex gap-6">
                        {navLinks.map((link) => (
                            <button
                                key={link}
                                onClick={() => setActiveNav(link)}
                                className={`text-[13px] pb-0.5 transition-colors cursor-pointer ${activeNav === link
                                    ? "text-[#e8e8e8] border-b-[1.5px] border-blue-500"
                                    : "text-[#666] hover:text-[#aaa]"
                                    }`}
                            >
                                {link}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white border-none rounded-lg px-3.5 py-[7px] text-[13px] font-medium flex items-center gap-1.5 transition-all cursor-pointer">
                        <UploadIcon />
                        <Link to="/files/add-file">
                            Upload file
                        </Link>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-[#1e2a3a] border border-[#2e2e2e] flex items-center justify-center text-[12px] font-medium text-blue-400">
                        <Link to="/profile">BA</Link>
                    </div>
                </div>
            </nav>

            {/* ── Main Content ── */}
            <div className="px-7 py-7">

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-[20px] font-semibold text-[#f0f0f0]">Good morning, Brij</h1>
                    <p className="text-[13px] text-[#555] mt-1">Here's what's happening with your media pipeline today.</p>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-[#161616] border border-[#2a2a2a] rounded-xl px-5 py-[18px]">
                            <p className="text-[11px] font-medium text-[#555] tracking-[0.06em] uppercase mb-2">{s.label}</p>
                            <p className={`text-[26px] font-semibold leading-none ${s.valueColor ?? "text-[#f0f0f0]"}`}>
                                {s.value}
                            </p>
                            <p className={`text-[12px] mt-1.5 ${s.subColor}`}>{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Mid Grid: Storage + Queue ── */}
                <div className="grid grid-cols-2 gap-4 mb-6">

                    {/* Storage Breakdown */}
                    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
                        <p className="text-[11px] font-medium text-[#888] tracking-[0.06em] uppercase mb-4">Storage breakdown</p>
                        <div className="flex flex-col gap-3">
                            {storageBreakdown.map((item) => (
                                <div key={item.label} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2 text-[13px] text-[#aaa]">
                                            <span className={`w-2 h-2 rounded-sm ${item.color}`} />
                                            {item.label}
                                        </span>
                                        <span className='text-[12px] font-["DM_Mono",monospace] text-[#555]'>
                                            {item.value} GB
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.bar}`}
                                            style={{ width: `${(item.value / totalStorage) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#222] flex justify-between items-center">
                            <span className="text-[12px] text-[#555]">Total used</span>
                            <span className='text-[13px] font-medium font-["DM_Mono",monospace] text-[#aaa]'>47.2 / 100 GB</span>
                        </div>
                    </div>

                    {/* Processing Queue */}
                    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
                        <p className="text-[11px] font-medium text-[#888] tracking-[0.06em] uppercase mb-4">Processing queue</p>
                        <div className="flex flex-col gap-2">
                            {queueItems.map((item) => (
                                <div key={item.name} className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1a] rounded-lg border border-[#242424]">
                                    <QueueIcon status={item.status} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-[#d0d0d0] truncate">{item.name}</p>
                                        <p className="text-[11px] text-[#555] mt-0.5">{item.meta}</p>
                                    </div>
                                    <Badge status={item.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Recent Uploads Table ── */}
                <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[11px] font-medium text-[#888] tracking-[0.06em] uppercase">Recent uploads</p>
                        <button className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                            View all
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] table-fixed">
                            <colgroup>
                                <col className="w-[34%]" />
                                <col className="w-[10%]" />
                                <col className="w-[12%]" />
                                <col className="w-[14%]" />
                                <col className="w-[14%]" />
                                <col className="w-[16%]" />
                            </colgroup>
                            <thead>
                                <tr>
                                    {["File name", "Type", "Size", "Uploaded", "Status", "Actions"].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left text-[11px] font-medium text-[#555] tracking-[0.06em] uppercase pb-3 border-b border-[#242424] px-3"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentUploads.map((file) => {
                                    const dot = statusConfig[file.status]?.dot ?? "bg-[#555]";
                                    const isRetry = file.status === "Failed";
                                    return (
                                        <tr key={file.name} className="group hover:bg-[#1a1a1a] transition-colors">
                                            <td className="px-3 py-3 border-b border-[#1e1e1e] group-last:border-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                                    <span className="text-[#c0c0c0] truncate">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-[#555] border-b border-[#1e1e1e] group-last:border-0">{file.type}</td>
                                            <td className="px-3 py-3 text-[#c0c0c0] border-b border-[#1e1e1e] group-last:border-0">{file.size}</td>
                                            <td className="px-3 py-3 text-[#555] border-b border-[#1e1e1e] group-last:border-0">{file.time}</td>
                                            <td className="px-3 py-3 border-b border-[#1e1e1e] group-last:border-0">
                                                <Badge status={file.status} />
                                            </td>
                                            <td className="px-3 py-3 border-b border-[#1e1e1e] group-last:border-0">
                                                <button
                                                    className={`text-[12px] font-medium transition-colors cursor-pointer ${isRetry
                                                        ? "text-red-400 hover:text-red-300"
                                                        : "text-blue-400 hover:text-blue-300"
                                                        }`}
                                                >
                                                    {isRetry ? "Retry" : "Preview"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}