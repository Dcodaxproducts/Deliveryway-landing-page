import { Check } from "lucide-react";

interface ChecklistItemProps {
  text: string;
}

const ChecklistItem = ({ text }: ChecklistItemProps) => {
  return (
    <li className="flex items-center gap-3 justify-start">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Check className="h-4 w-4 text-gray-900" />
      </span>
      <span className="text-sm sm:text-[16px] text-gray-700 text-left">
        {text}
      </span>
    </li>
  );
};

export default ChecklistItem;
