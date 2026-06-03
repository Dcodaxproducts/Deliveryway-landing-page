import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItemProps {
  id: string;
  question: string;
  answer: string;
}

const FaqItem = ({ id, question, answer }: FaqItemProps) => {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-base sm:text-[18px] font-heading font-[600] text-[#171717]">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm sm:text-[15px] text-[#595959]">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqItem;
