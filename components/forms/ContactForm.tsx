"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  return (
    <form className="flex flex-col gap-6 w-full">

      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            className="mt-1 border border-slate-200"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@restaurant.com"
            className="mt-1 border border-slate-200"
          />
        </div>
      </div>

      {/* Restaurant Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="restaurantName">Restaurant Name</Label>
        <Input
          id="restaurantName"
          placeholder="The Gusto Kitchen"
          className="mt-1 border border-slate-200"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="How can we help your business today?"
          className="mt-1 h-32 border border-slate-200"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3">
        Send Message
      </Button>

      {/* FAQ Link */}
      <div className="text-center mt-2 text-sm text-slate-500">
        Need instant answers?{" "}
        <span className="text-red-600 font-bold cursor-pointer">Check our FAQ</span>
      </div>
    </form>
  );
};

export default ContactForm;
