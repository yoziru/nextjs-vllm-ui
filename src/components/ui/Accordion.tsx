
"use client";
import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item border-t p-0 m-0">
      <div
        className="accordion-header p-0 m-0 text-sm font-semibold cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </span>
      </div>
      {isOpen && (
        <div className="accordion-body p-0 m-0">{children}</div>
      )}
    </div>
  );
}
