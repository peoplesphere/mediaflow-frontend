import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../features/auth/hooks/useAuth"
import toast from 'react-hot-toast'

function Signup() {
    const navigate = useNavigate()
    const {
        signup,
        loading,
        error,
    } = useAuth();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signup(formData)
            toast.success('Account created successfully! 🎉')
            navigate('/dashboard')
        } catch (error) {
            console.log("Error:", error);
            toast.error(error.response?.data?.message || 'Signup failed')
        }

    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-[#0f0f0f]'>
            <div className="relative bg-[#161616] border border-[#2a2a2a] rounded-2xl w-full max-w-md px-9 py-10 overflow-hidden">

                {/* Top accent line */}
                <div className="absolute top-0 left-9 right-9 h-0.5 bg-gradient-to-r from-blue-500 to-violet-400 rounded-b" />

                <span className="font-mono text-[11px] tracking-widest text-blue-400 uppercase mb-5 block">
                    AIMS Platform
                </span>
                <h1 className="text-[26px] font-semibold text-[#f0f0f0] leading-tight mb-1.5">
                    Create account
                </h1>
                <p className="text-sm font-light text-[#666] mb-8">
                    Start using AIMS for free today
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3.5 py-3 rounded-lg mb-5 text-[13px]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[#888] tracking-[0.04em] uppercase">
                            Full Name
                        </label>
                        <input
                            name="fullname"
                            type="text"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-[11px] text-sm text-[#e8e8e8] placeholder-[#3a3a3a] focus:outline-none focus:border-blue-500 focus:bg-[#1a1a1e] focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[#888] tracking-[0.04em] uppercase">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            required
                            className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-[11px] text-sm text-[#e8e8e8] placeholder-[#3a3a3a] focus:outline-none focus:border-blue-500 focus:bg-[#1a1a1e] focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[#888] tracking-[0.04em] uppercase">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••••"
                            required
                            className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3.5 py-[11px] text-sm text-[#e8e8e8] placeholder-[#3a3a3a] focus:outline-none focus:border-blue-500 focus:bg-[#1a1a1e] focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.99] text-white py-3 rounded-lg text-sm font-medium tracking-wide disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1 cursor-pointer"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                    <p className="text-center text-[13px] text-[#555] mt-2">
                        Already have an account?{" "}
                        <Link to="/auth/login" className="text-blue-400 font-medium hover:underline ml-1">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Signup                               