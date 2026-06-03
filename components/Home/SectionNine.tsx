import Image from "next/image";

export default function SectionNine() {
  return (
    <div className="relative z-20 mx-auto max-w-7xl px-4 bg-[#000000] rounded-[32px] md:rounded-[40px]">
      <div
        className="rounded-2xl md:rounded-3xl bg-cover bg-center px-4 sm:px-6 py-14 sm:py-18 md:py-21 text-center text-white md:px-16"
        style={{
          backgroundImage: "url('/assets/sectionNine/background.png')",
        }}
      >
        <h2 className="mx-auto max-w-3xl text-2xl sm:text-3xl md:text-4xl font-bold leading-tight font-heading">
          Download Our Restaurant App <br className="hidden sm:block" />
          and Manage Orders Effortlessly!
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-[16px] leading-relaxed text-gray-200">
          Take full control of your restaurant operations from anywhere. Accept
          orders, update menus, track deliveries, and monitor performance — all
          through our powerful, easy-to-use mobile app.
          <br className="hidden sm:block" />
          Enjoy real-time notifications, faster workflows, and a seamless
          management experience designed for busy restaurant teams.
        </p>

        {/* STORE BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Google Play */}
          <a
            href="#"
            className="w-full sm:w-[180px] flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-md transition hover:scale-105"
          >
            <Image
              src="/assets/sectionNine/google_store.png"
              alt="Google Play"
              width={23}
              height={23}
              className="object-contain"
            />
            <span className="text-[13px] font-medium text-black text-left leading-tight">
              Get it on <br />
              <span className="text-[16px] font-bold font-google">
                Google Play
              </span>
            </span>
          </a>

          {/* App Store */}
          <a
            href="#"
            className="w-full sm:w-[180px] flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-md transition hover:scale-105"
          >
            <Image
              src="/assets/sectionNine/apple_store.png"
              alt="App Store"
              width={23}
              height={23}
              className="object-contain"
            />
            <span className="text-[13px] font-medium text-black text-left leading-tight">
              Download on the <br />
              <span className="text-[16px] font-bold font-google">
                App Store
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
