import { useState } from "react";
import { Link } from "react-router-dom";

// ── Plan Config (from your backend constants) ────────────────
const PLANS = [
    {
        key: "free",
        name: "Free",
        price: { monthly: 0, yearly: 0 },
        description: "Perfect for trying out MediaFlow.",
        maxFileSizeMB: 50,
        monthlyUploads: 10,
        allowVideo: false,
        features: [
            "10 uploads / month",
            "50 MB max file size",
            "Image processing only",
            "Standard queue priority",
            "Basic dashboard",
        ],
        cta: "Get started free",
        highlighted: false,
    },
    {
        key: "pro",
        name: "Pro",
        price: { monthly: 12, yearly: 9 },
        description: "For creators and indie developers.",
        maxFileSizeMB: 500,
        monthlyUploads: 100,
        allowVideo: true,
        features: [
            "100 uploads / month",
            "500 MB max file size",
            "Images + video processing",
            "High queue priority",
            "Advanced dashboard",
            "Presigned URL downloads",
        ],
        cta: "Start Pro trial",
        highlighted: true,
        badge: "Most popular",
    },
    {
        key: "business",
        name: "Business",
        price: { monthly: 39, yearly: 29 },
        description: "For teams with serious media workloads.",
        maxFileSizeMB: 2048,
        monthlyUploads: 500,
        allowVideo: true,
        features: [
            "500 uploads / month",
            "2 GB max file size",
            "Images + video processing",
            "Highest queue priority",
            "Team management",
            "Webhook notifications",
            "Priority support",
        ],
        cta: "Start Business trial",
        highlighted: false,
    },
];

const FEATURES = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 16l4-4 4 4 4-6 4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
            </svg>
        ),
        title: "Smart image processing",
        desc: "Resize, compress, and convert images on-the-fly with Sharp. WebP, PNG, JPEG — all supported with lossless quality options.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10 9.5l5 2.5-5 2.5V9.5z" fill="currentColor" />
            </svg>
        ),
        title: "Video transcoding",
        desc: "Powered by FFmpeg. Transcode, trim, and compress videos to web-ready formats. Auto-generate thumbnails at any timestamp.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
        title: "S3-backed storage",
        desc: "Files stored securely across dedicated S3 buckets — uploads, processed outputs, and thumbnails — with presigned URL access.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
        title: "Async job queues",
        desc: "Bull Queue + Redis keeps heavy processing off the request thread. Jobs run in the background — you get real-time progress via Socket.io.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Secure by default",
        desc: "JWT auth with access + refresh tokens. Zod-validated inputs. Per-user bucket isolation. Your files are private by default.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
        title: "Real-time dashboard",
        desc: "Live processing status, storage analytics, and job history — all updated instantly via Socket.io without page refreshes.",
    },
];

const STEPS = [
    { num: "01", title: "Upload your file", desc: "Drag and drop or select any image or video. Files go straight to S3 via a secure presigned URL." },
    { num: "02", title: "We process it", desc: "Our async queue picks it up instantly. Sharp or FFmpeg does the heavy lifting in the background." },
    { num: "03", title: "Download or stream", desc: "Your processed file is ready with a presigned download URL. Use it anywhere — CDN, app, or API." },
];

// ── Small reusable components ────────────────────────────────
function CheckIcon({ color = "#3bab6e" }) {
    return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="8" cy="8" r="7" fill={color} fillOpacity="0.15" />
            <path d="M5 8.5l2 2 4-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Navbar() {
    return (
        <nav className="bg-[#0f0f0f]/80 backdrop-blur border-b border-[#2a2a2a] px-8 h-14 flex items-center justify-between sticky top-0 z-50">
            <span className='font-["DM_Mono",monospace] text-[13px] tracking-widest text-blue-400 uppercase font-medium'>
                MediaFlow
            </span>
            <div className="flex items-center gap-6">
                <a href="#features" className="text-[13px] text-[#666] hover:text-[#aaa] transition-colors">Features</a>
                <a href="#how-it-works" className="text-[13px] text-[#666] hover:text-[#aaa] transition-colors">How it works</a>
                <a href="#pricing" className="text-[13px] text-[#666] hover:text-[#aaa] transition-colors">Pricing</a>
                <Link
                    to="/auth/login"
                    className="text-[13px] text-[#aaa] hover:text-white transition-colors"
                >
                    Sign in
                </Link>
                <Link
                    to="/auth/signup"
                    className="bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-[13px] font-medium px-4 py-[7px] rounded-lg transition-all"
                >
                    Get started
                </Link>
            </div>
        </nav>
    );
}

// ── Main Landing Page ─────────────────────────────────────────
export default function LandingPage() {
    const [billing, setBilling] = useState("monthly");

    return (
        <div className='min-h-screen bg-[#0f0f0f] text-[#e8e8e8] font-["DM_Sans",sans-serif]'>
            <Navbar />

            {/* ══ HERO ══════════════════════════════════════════════ */}
            <section className="relative px-8 pt-28 pb-32 flex flex-col items-center text-center overflow-hidden">
                {/* Background grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                {/* Glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-medium px-3 py-1.5 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        Now in public beta — start free, no credit card needed
                    </div>

                    <h1 className="text-[52px] font-semibold text-[#f0f0f0] leading-[1.12] tracking-tight mb-6">
                        Media processing,{" "}
                        <span className="text-blue-400">done right.</span>
                    </h1>
                    <p className="text-[17px] text-[#666] leading-relaxed max-w-xl mx-auto mb-10">
                        Upload images and videos. Get them compressed, resized, transcoded, and
                        thumbnail-ready — all via async queues and S3-backed storage.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link
                            to="/auth/signup"
                            className="bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white font-medium text-[14px] px-6 py-3 rounded-lg transition-all"
                        >
                            Start for free
                        </Link>
                        <a
                            href="#how-it-works"
                            className="text-[14px] text-[#666] hover:text-[#aaa] flex items-center gap-1.5 transition-colors"
                        >
                            See how it works
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Hero mockup strip */}
                <div className="relative z-10 mt-16 w-full max-w-4xl bg-[#161616] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                    <div className="bg-[#1a1a1a] border-b border-[#242424] px-5 py-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                        <span className='ml-4 font-["DM_Mono",monospace] text-[11px] text-[#444]'>
                            mediaflow.app/dashboard
                        </span>
                    </div>
                    <div className="p-5 grid grid-cols-4 gap-3">
                        {[
                            { label: "Total files", value: "1,284", sub: "+38 this week", color: "text-[#f0f0f0]" },
                            { label: "Storage used", value: "47.2 GB", sub: "of 100 GB", color: "text-[#f0f0f0]" },
                            { label: "Jobs processed", value: "3,910", sub: "+124 today", color: "text-[#f0f0f0]" },
                            { label: "Failed jobs", value: "6", sub: "last 24h", color: "text-red-400" },
                        ].map((s) => (
                            <div key={s.label} className="bg-[#1a1a1a] border border-[#242424] rounded-xl p-4">
                                <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">{s.label}</p>
                                <p className={`text-[22px] font-semibold ${s.color}`}>{s.value}</p>
                                <p className="text-[11px] text-[#444] mt-1">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                    <div className="px-5 pb-5">
                        <div className="bg-[#1a1a1a] border border-[#242424] rounded-xl overflow-hidden">
                            <div className="border-b border-[#242424] px-4 py-3 flex justify-between items-center">
                                <span className="text-[11px] text-[#555] uppercase tracking-widest">Recent uploads</span>
                            </div>
                            {[
                                { name: "product-launch-reel.mp4", type: "MP4", size: "284 MB", status: "Processing", dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-400" },
                                { name: "banner-hero-2x.png", type: "PNG", size: "4.1 MB", status: "Ready", dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-400" },
                                { name: "team-offsite-day2.mov", type: "MOV", size: "1.2 GB", status: "Queued", dot: "bg-[#555]", badge: "bg-white/5 text-[#666]" },
                            ].map((f) => (
                                <div key={f.name} className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e1e] last:border-0 hover:bg-[#1f1f1f] transition-colors">
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.dot}`} />
                                    <span className="text-[12px] text-[#c0c0c0] flex-1 truncate">{f.name}</span>
                                    <span className="text-[11px] text-[#555] w-10">{f.type}</span>
                                    <span className="text-[11px] text-[#c0c0c0] w-16 text-right">{f.size}</span>
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${f.badge}`}>{f.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ FEATURES ══════════════════════════════════════════ */}
            <section id="features" className="px-8 py-24 border-t border-[#1e1e1e]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className='font-["DM_Mono",monospace] text-[11px] tracking-widest text-blue-400 uppercase mb-3'>
                            What's inside
                        </p>
                        <h2 className="text-[36px] font-semibold text-[#f0f0f0] leading-tight">
                            Everything you need for media pipelines
                        </h2>
                        <p className="text-[15px] text-[#555] mt-3 max-w-lg mx-auto">
                            Built on battle-tested open source tools. No lock-in. No black boxes.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors"
                            >
                                <div className="text-blue-400 mb-4">{f.icon}</div>
                                <h3 className="text-[14px] font-medium text-[#e8e8e8] mb-2">{f.title}</h3>
                                <p className="text-[13px] text-[#555] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
            <section id="how-it-works" className="px-8 py-24 border-t border-[#1e1e1e]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className='font-["DM_Mono",monospace] text-[11px] tracking-widest text-blue-400 uppercase mb-3'>
                            How it works
                        </p>
                        <h2 className="text-[36px] font-semibold text-[#f0f0f0] leading-tight">
                            Upload to processed in seconds
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute top-8 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-[#242424] hidden md:block" />

                        <div className="grid grid-cols-3 gap-8">
                            {STEPS.map((step) => (
                                <div key={step.num} className="flex flex-col items-center text-center">
                                    <div className='w-16 h-16 rounded-2xl bg-[#161616] border border-[#2a2a2a] flex items-center justify-center font-["DM_Mono",monospace] text-[20px] font-medium text-blue-400 mb-5 relative z-10'>
                                        {step.num}
                                    </div>
                                    <h3 className="text-[15px] font-medium text-[#e8e8e8] mb-2">{step.title}</h3>
                                    <p className="text-[13px] text-[#555] leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ PRICING ═══════════════════════════════════════════ */}
            <section id="pricing" className="px-8 py-24 border-t border-[#1e1e1e]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className='font-["DM_Mono",monospace] text-[11px] tracking-widest text-blue-400 uppercase mb-3'>
                            Pricing
                        </p>
                        <h2 className="text-[36px] font-semibold text-[#f0f0f0] leading-tight mb-3">
                            Simple, honest pricing
                        </h2>
                        <p className="text-[15px] text-[#555]">No surprises. Upgrade or cancel anytime.</p>

                        {/* Billing toggle */}
                        <div className="inline-flex items-center gap-1 bg-[#161616] border border-[#2a2a2a] rounded-xl p-1 mt-8">
                            <button
                                onClick={() => setBilling("monthly")}
                                className={`text-[13px] font-medium px-5 py-2 rounded-lg transition-all cursor-pointer ${billing === "monthly"
                                    ? "bg-[#242424] text-[#e8e8e8]"
                                    : "text-[#555] hover:text-[#888]"
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBilling("yearly")}
                                className={`text-[13px] font-medium px-5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${billing === "yearly"
                                    ? "bg-[#242424] text-[#e8e8e8]"
                                    : "text-[#555] hover:text-[#888]"
                                    }`}
                            >
                                Yearly
                                <span className="text-[11px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-md font-medium">
                                    Save 25%
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.key}
                                className={`relative rounded-2xl p-6 flex flex-col ${plan.highlighted
                                    ? "bg-[#161e2e] border-2 border-blue-500/40"
                                    : "bg-[#161616] border border-[#2a2a2a]"
                                    }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <p className="text-[13px] font-medium text-[#888] uppercase tracking-widest mb-2">{plan.name}</p>
                                    <div className="flex items-end gap-1.5 mb-2">
                                        <span className="text-[40px] font-semibold text-[#f0f0f0] leading-none">
                                            ${billing === "monthly" ? plan.price.monthly : plan.price.yearly}
                                        </span>
                                        {plan.price.monthly > 0 && (
                                            <span className="text-[13px] text-[#555] mb-1.5">/mo</span>
                                        )}
                                    </div>
                                    <p className="text-[13px] text-[#555]">{plan.description}</p>
                                </div>

                                {/* Key limits */}
                                <div className="bg-[#1a1a1a] rounded-xl p-4 mb-5 flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[12px]">
                                        <span className="text-[#555]">Uploads / month</span>
                                        <span className='font-["DM_Mono",monospace] text-[#aaa]'>{plan.monthlyUploads}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px]">
                                        <span className="text-[#555]">Max file size</span>
                                        <span className='font-["DM_Mono",monospace] text-[#aaa]'>
                                            {plan.maxFileSizeMB >= 1024
                                                ? `${plan.maxFileSizeMB / 1024} GB`
                                                : `${plan.maxFileSizeMB} MB`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px]">
                                        <span className="text-[#555]">Video processing</span>
                                        <span className={plan.allowVideo ? "text-emerald-400" : "text-[#444]"}>
                                            {plan.allowVideo ? "✓ Included" : "✗ Images only"}
                                        </span>
                                    </div>
                                </div>

                                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-2.5 text-[13px] text-[#888]">
                                            <CheckIcon color={plan.highlighted ? "#4f8ef7" : "#3bab6e"} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/auth/signup"
                                    className={`w-full text-center text-[13px] font-medium py-3 rounded-xl transition-all ${plan.highlighted
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-[#1e1e1e] hover:bg-[#242424] text-[#aaa] hover:text-[#e8e8e8] border border-[#2e2e2e]"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* FAQ note */}
                    <p className="text-center text-[12px] text-[#444] mt-8">
                        All plans include a 14-day free trial of Pro features. No credit card required to start.
                    </p>
                </div>
            </section>

            {/* ══ CTA BANNER ════════════════════════════════════════ */}
            <section className="px-8 py-20 border-t border-[#1e1e1e]">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-[32px] font-semibold text-[#f0f0f0] leading-tight mb-4">
                        Ready to ship faster?
                    </h2>
                    <p className="text-[15px] text-[#555] mb-8">
                        Start with the free plan. No setup fees, no lock-in. Your first 10 uploads are on us.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/auth/signup"
                            className="bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white font-medium text-[14px] px-7 py-3 rounded-lg transition-all"
                        >
                            Create free account
                        </Link>
                        <Link
                            to="/auth/login"
                            className="text-[14px] text-[#666] hover:text-[#aaa] flex items-center gap-1.5 transition-colors"
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ════════════════════════════════════════════ */}
            <footer className="border-t border-[#1e1e1e] px-8 py-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <span className='font-["DM_Mono",monospace] text-[13px] tracking-widest text-blue-400 uppercase font-medium'>
                            MediaFlow
                        </span>
                        <p className="text-[12px] text-[#444] mt-1.5">
                            Fast, async media processing. Built on Node.js, Sharp &amp; FFmpeg.
                        </p>
                    </div>
                    <div className="flex gap-8 text-[12px] text-[#555]">
                        <a href="#features" className="hover:text-[#aaa] transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-[#aaa] transition-colors">Pricing</a>
                        <Link to="/auth/login" className="hover:text-[#aaa] transition-colors">Sign in</Link>
                        <Link to="/auth/signup" className="hover:text-[#aaa] transition-colors">Sign up</Link>
                    </div>
                    <p className="text-[12px] text-[#333]">© 2026 MediaFlow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}