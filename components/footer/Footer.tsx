import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="relative bg-gray-100 pt-20">
  
      {/* FOOTER CONTENT */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {/* GRID WITH SPACE-BETWEEN BEHAVIOR */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.8fr_1fr_1fr_auto]">
          {/* LOGO + SUBSCRIBE (LEFT) */}
          <div className="max-w-[400px]">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Food Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold text-gray-900">
                food
              </span>
            </div>

            <h4 className="mt-6 font-heading font-semibold text-gray-900">
              Subscribe
            </h4>
            <p className="mt-2 text-[15px] text-gray-600">
              Join our newsletter to stay up to date on features and releases.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-white p-2 shadow-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 text-sm outline-none"
              />
              <button className="rounded-full bg-black px-5 py-2 text-sm text-white">
                Subscribe
              </button>
            </div>

            <p className="mt-3.5 text-[13px] text-gray-500">
              By subscribing you agree to our{" "}
              <span className="underline">Privacy Policy</span>
            </p>
          </div>

          {/* QUICK LINKS (CENTER LEFT) */}
          <div>
            <h4 className="font-heading font-bold text-gray-900">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-[15px] text-gray-600">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* PRODUCTS (CENTER RIGHT) */}
          <div>
            <h4 className="font-medium text-gray-900">
              Products
            </h4>
            <ul className="mt-4 space-y-2 text-[15px] text-gray-600">
              <li>Super Admin Dashboard</li>
              <li>Restaurant Admin Dashboard</li>
              <li>Customer App</li>
              <li>Driver App</li>
              <li>Merchant (Restaurant) App</li>
            </ul>
          </div>

          {/* COMPANY (RIGHT) */}
          <div className="md:text-left">
            <h4 className="font-medium text-gray-900">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-[15px] text-gray-600">
              <li>About</li>
              <li>Privacy Policy</li>
              <li>Support</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-gray-300" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">
            Copyright © 2025 Investo. All Rights Reserved
          </p>

          <div className="flex items-center gap-4">
            <FaFacebookF className="h-4 w-4 cursor-pointer text-gray-600 hover:text-black" />
            <FaTwitter className="h-4 w-4 cursor-pointer text-gray-600 hover:text-black" />
            <FaInstagram className="h-4 w-4 cursor-pointer text-gray-600 hover:text-black" />
            <FaYoutube className="h-4 w-4 cursor-pointer text-gray-600 hover:text-black" />
          </div>
        </div>
      </div>
    </footer>
  );
}
