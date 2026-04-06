import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../features/auth/hooks/useAuth"

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
        } catch (error) {
            console.log("Error:", error);
        }

    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Create account</h1>
                <p className="text-gray-500 mb-6">Start using MediaFlow for free</p>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className='flex flex-col gap-1'>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            name='fullname'
                            type='text'
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder='Full Name'
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Email'
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            name='password'
                            type='password'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Password'
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type='submit'
                        disable={loading}
                        className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Creating Account" : "Create Account"}
                    </button>

                    <p className='text-center text-sm text-gray-500 mt-6'>
                        Already have an account?
                        <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">Login</Link>
                    </p>
                </form>
            </div>


        </div >
    )
}

export default Signup                               