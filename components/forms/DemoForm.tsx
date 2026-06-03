"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DemoForm = () => {
  return (
    <form className="flex flex-col gap-4 w-full">

      {/* Name Fields */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="firstName" className="text-slate-900 text-sm font-semibold">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="First Name"
            className="h-10 bg-white border border-slate-200 rounded-lg"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Label htmlFor="lastName" className="text-slate-900 text-sm font-semibold">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Last Name"
            className="h-10 bg-white border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* Work Email */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email" className="text-slate-900 text-sm font-semibold">
          Work Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Work Email"
          className="h-10 bg-white border border-slate-200 rounded-lg"
        />
      </div>

      {/* Company Size */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="companySize" className="text-slate-900 text-sm font-semibold">
          Company Size
        </Label>
        <Select>
          <SelectTrigger className="h-10 bg-white border border-slate-200 rounded-lg w-full">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10-50">10-50 Employees</SelectItem>
            <SelectItem value="51-200">51-200 Employees</SelectItem>
            <SelectItem value="201-500">201-500 Employees</SelectItem>
            <SelectItem value="500+">500+ Employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-4">
        Book Your Demo
      </Button>
    </form>
  );
};

export default DemoForm;
