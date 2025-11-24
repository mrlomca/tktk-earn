import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';

const FAQ: React.FC = () => {
  // Default the first item (index 0) to be open
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#E8F6F5] py-20 px-6 min-h-[600px] scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-4xl font-bold mb-2 text-black">
          Frequently Asked <span className="text-[#FE2C55]">Questions</span>
        </h2>
        <p className="text-center text-gray-500 mb-12 text-sm">
          Everything you need to know about Scroll & Earn
        </p>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl overflow-hidden transition-all duration-200 border border-transparent hover:border-gray-100"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-4 py-4 md:px-8 md:py-6 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors text-left"
                >
                  <span className="text-gray-900 font-bold text-sm md:text-[15px] truncate md:whitespace-normal md:overflow-visible">
                    {item.question}
                  </span>
                  <span className="text-gray-400 ml-2 md:ml-4 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-4 pb-4 md:px-8 md:pb-8 pt-0">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;