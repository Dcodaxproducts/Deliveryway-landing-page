"use client";

import { MapPin } from "lucide-react";
import ContactForm from "../forms/ContactForm";
import { contactInfo, officeLocations } from "@/constants/contact";


const Contact = () => {
  return (
    <section className="w-full py-20 px-6 lg:px-25 bg-slate-50 flex flex-col lg:flex-row gap-15">

      {/* Form */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full  bg-white p-10 rounded-2xl shadow-lg">
          <ContactForm />
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex-1 flex flex-col justify-center gap-12">

        {/* Contact Methods */}
        <div className="flex flex-col gap-8">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <div className="w-8 h-1 bg-red-600 rounded-full" />
            Contact Information
          </h2>

          <div className="flex flex-col gap-6">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-12 h-12 flex justify-center items-center bg-red-600/10 rounded-xl">
                  {info.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-slate-900 font-bold">{info.title}</div>
                  <div className="text-slate-600">{info.value}</div>
                  <div className="text-slate-400 text-xs">{info.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Locations */}
        <div className="flex flex-col gap-8">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <div className="w-8 h-1 bg-red-600 rounded-full" />
            Office Locations
          </h2>

          <div className="flex flex-col sm:flex-row gap-8">
            {officeLocations.map((office, idx) => (
              <div key={idx} className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div className="text-slate-900 font-bold">{office.city}</div>
                </div>
                <div className="text-slate-600 text-sm">{office.address}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
