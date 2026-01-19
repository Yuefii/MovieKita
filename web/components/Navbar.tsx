"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use_auth"
import { LogOut, Menu } from "lucide-react"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
      <div className="flex items-center justify-between px-4 md:px-12 h-16 md:h-20">
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="/" className="text-white text-2xl md:text-3xl font-bold cursor-pointer tracking-wider">
            MOVIE<span className="text-blue-500">KITA</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-white bg-transparent">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              {user.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition hover:bg-white/10 rounded-md"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition"
                title="Edit Profile">
                <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 hover:bg-white/10 rounded-md transition text-gray-300 hover:text-white cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-blue-600/50 transition">
              Login
            </Link>
          )}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 absolute top-16 left-0 w-full p-4 flex flex-col gap-4 text-center text-sm text-gray-400 font-medium border-t border-gray-800 animate-in slide-in-from-top-2">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="hover:text-white py-2"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="hover:text-white py-2"
              >
                Profile
              </Link>
              <button onClick={logout} className="hover:text-white py-2 w-full border-t border-gray-800 mt-2">
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hover:text-white py-2">Login</Link>
          )}
        </div>
      )}
    </header>
  )
}