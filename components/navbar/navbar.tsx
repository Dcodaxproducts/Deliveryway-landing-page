"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      {/* OUTER BAR */}
      <nav className="w-full bg-[#CE181B] px-4 py-4 relative z-30">
        {/* INNER CONTAINER */}
        <div className="mx-auto max-w-7xl">
          <div className="flex h-[64px] items-center justify-between rounded-full bg-[rgba(255,255,255,0.09)] pl-7 pr-3">
            {/* LEFT: LOGO */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push('/')}>
              <Image
                src="/assets/logo_nav.png"
                alt="Food logo"
                width={36}
                height={36}
              />
              <span className="text-[20px] font-[700] text-white">
                food
              </span>
            </div>

            {/* CENTER: LINKS (DESKTOP) */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-sans text-white ml-20">
              <Link href="/about" className="hover:opacity-80">
                About
              </Link>
              <Link href="/services" className="hover:opacity-80">
                Services
              </Link>
              <Link href="/pricing" className="hover:opacity-80">
                Pricing
              </Link>
              <Link href="/contact" className="hover:opacity-80">
                Contact
              </Link>
            </div>

            {/* RIGHT: CTA + MOBILE MENU */}
            <div className="flex items-center gap-3">
              <Button
                className="hidden md:inline-flex rounded-full bg-white px-7 py-3 text-[15px] font-sans font-medium text-[#CE181B] hover:bg-white/90"
              onClick={()=>router.push("/register")}
              >
                Registration
              </Button>

              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 text-white md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="relative ml-auto h-full w-72 bg-white shadow-xl">
            {/* CLOSE */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg bg-gray-100 p-2"
              >
                <X size={18} />
              </button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-6 px-6 text-sm font-medium text-gray-800">
              <Link href="#">About</Link>
              <Link href="#">Services</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">Contact</Link>

              <Button className="mt-4 py-3 rounded-full bg-[#CE181B] text-white hover:bg-[#b51619]" onClick={()=>router.push("/register")}>
                Registration / Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
