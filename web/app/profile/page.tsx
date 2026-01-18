"use client"

import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react"
import { Lock, Mail, Save, ShieldCheck, User } from "lucide-react"
import { useAuth } from "@/hooks/use_auth"
import axios from "@/lib/axios"

export default function Page() {
    const { user, mutate } = useAuth({ middleware: 'auth' })

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        }
    }, [user])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)
        setValidationErrors({})

        try {
            await axios.put('/api/profile', {
                name,
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            })

            await mutate()
            setSuccess("Profile updated successfully.")

            setCurrentPassword("")
            setPassword("")
            setPasswordConfirmation("")
        } catch (err: any) {
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors)
                setError("Please correct the errors below.")
            } else {
                setError(err.response?.data?.message || "An unexpected error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
            <Navbar />
            <div className="pt-28 md:pt-32 p-6 md:p-12 relative">
                <div className="max-w-4xl mx-auto space-y-8">
                    <header className="border-b border-zinc-800 pb-6">
                        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Edit Profil</h1>
                        <p className="text-zinc-300 text-sm font-mono">
                            Manage your personal information and security
                        </p>
                    </header>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-6">
                            <div className="p-6 rounded-md border border-zinc-800 bg-zinc-950/30 text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-blue-900/20">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-lg font-medium text-white">{user.name}</h2>
                                <p className="text-sm text-zinc-300 font-mono mt-1 uppercase">{user.role || 'MEMBER'}</p>
                            </div>
                            <div className="p-6 rounded-md border border-zinc-800 bg-zinc-950/30">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 mb-4">Account Status</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-zinc-300">Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-zinc-600" />
                                    <span className="text-sm text-zinc-300">Secure</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <form onSubmit={handleUpdate} className="p-8 rounded-md border border-zinc-800 bg-zinc-950/30 space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-900/10 rounded-md border border-red-900/20 text-red-500 text-sm font-mono">
                                        <p className="font-bold">ERROR: {error}</p>
                                        {Object.keys(validationErrors).length > 0 && (
                                            <ul className="mt-2 list-disc list-inside">
                                                {Object.entries(validationErrors).map(([field, messages]) => (
                                                    <li key={field}>{messages[0]}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 bg-green-900/10 rounded-md border border-green-900/20 text-green-500 text-sm font-mono">
                                        SUCCESS: {success}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-6 border-b border-zinc-800 pb-2">Personal Information</h3>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-zinc-400">FULL NAME</label>
                                            <div className="relative group">
                                                <User className="w-4 h-4 absolute left-3 top-3 text-zinc-600 group-focus-within:text-white transition-colors" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className={`w-full bg-zinc-900/50 rounded-md border ${validationErrors.name ? 'border-red-900 focus:border-red-600' : 'border-zinc-800 focus:border-blue-600'} text-white text-sm py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 transition-all placeholder-zinc-700`}
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                            </div>
                                            {validationErrors.name && (
                                                <p className="text-xs text-red-500 font-mono">{validationErrors.name[0]}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-zinc-400">EMAIL ADDRESS (LOCKED)</label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-700" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    disabled
                                                    className="w-full bg-zinc-950 rounded-md border border-zinc-800/50 text-zinc-600 text-sm py-2.5 pl-10 pr-4 cursor-not-allowed focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-6 border-b border-zinc-800 pb-2">Security</h3>
                                    <p className="text-xs text-zinc-600 mb-4 font-mono">LEAVE BLANK TO KEEP CURRENT PASSWORD</p>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-zinc-400">CURRENT PASSWORD</label>
                                            <div className="relative group">
                                                <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-600 group-focus-within:text-white transition-colors" />
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className={`w-full bg-zinc-900/50 rounded-md border ${validationErrors.current_password ? 'border-red-900 focus:border-red-600' : 'border-zinc-800 focus:border-blue-600'} text-white text-sm py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 transition-all placeholder-zinc-700`}
                                                    placeholder="Required to set new password"
                                                />
                                            </div>
                                            {validationErrors.current_password && (
                                                <p className="text-xs text-red-500 font-mono">{validationErrors.current_password[0]}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-mono text-zinc-400">NEW PASSWORD</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className={`w-full bg-zinc-900/50 rounded-md border ${validationErrors.password ? 'border-red-900 focus:border-red-600' : 'border-zinc-800 focus:border-blue-600'} text-white text-sm py-2.5 px-4 focus:outline-none focus:ring-1 transition-all placeholder-zinc-700`}
                                                    placeholder="Min. 8 chars"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-mono text-zinc-400">CONFIRM PASSWORD</label>
                                                <input
                                                    type="password"
                                                    value={passwordConfirmation}
                                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                    className="w-full bg-zinc-900/50 rounded-md border border-zinc-800 text-white text-sm py-2.5 px-4 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder-zinc-700"
                                                    placeholder="Repeat new password"
                                                />
                                            </div>
                                        </div>
                                        {validationErrors.password && (
                                            <p className="text-xs text-red-500 font-mono">{validationErrors.password[0]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-blue-600 hover:bg-blue-600/50 rounded-md cursor-pointer text-white text-sm font-semibold py-2.5 px-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 tracking-wide"
                                    >
                                        {isLoading ? (
                                            "SAVING..."
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                SAVE CHANGES
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}