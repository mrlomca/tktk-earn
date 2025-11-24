
import React from 'react';
import { GUIDE_STEPS } from '../constants';

const QuickStart: React.FC = () => {
  return (
    <section id="guide" className="bg-white py-20 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-black text-4xl font-bold mb-16">
          Quick Start Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDE_STEPS.map((step, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start gap-4"
            >
              <div className="flex items-center gap-4 w-full">
                <div className={`w-12 h-12 ${step.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} strokeWidth={2.5} />
                </div>
                <h3 className="text-black text-lg font-bold leading-tight">
                  {step.title}
                </h3>
              </div>
              
              <p className="text-gray-500 text-sm font-medium leading-relaxed pl-[4rem] -mt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStart;