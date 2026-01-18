"use client"

import Link from "next/link"
import Input from "@/components/ui/Input"
import { useAuth } from "@/hooks/use_auth"
import { useState } from "react"
import { ArrowLeft, Lock, Mail, User } from "lucide-react"

export default function Page() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [errors, setErrors] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
      setLoading,
    })
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <header className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Register</h1>
        </header>
        <form onSubmit={handleRegister} className="space-y-6">
          {Object.keys(errors).length > 0 && !errors.name && !errors.email && !errors.password && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-sm">
              Something went wrong.
            </div>
          )}
          <Input
            label="Fullname"
            icon={User}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jhon Doe"
            required
            disabled={loading}
            error={errors.name?.[0]}
          />
          <Input
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            disabled={loading}
            error={errors.email?.[0]}
          />
          <Input
            label="Password"
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
            minLength={8}
            disabled={loading}
            error={errors.password?.[0]}
          />
          <Input
            label="Confirm Password"
            icon={Lock}
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Confirm Password"
            required
            minLength={8}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-600/50 text-white font-bold rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Process...' : 'Register now'}
          </button>
          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}