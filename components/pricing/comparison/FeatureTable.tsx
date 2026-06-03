'use client';
import { comparisonSections } from "@/constants/pricing";
import RenderCell from "./RenderCell";

const FeatureTable = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] border border-slate-200 rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-4 bg-white border-b border-slate-200">
          <div className="px-6 py-5 text-sm font-bold text-slate-900">Feature</div>
          <div className="px-6 py-5 text-sm font-bold text-center text-slate-900">Starter</div>
          <div className="px-6 py-5 text-sm font-bold text-center text-red-600">Professional</div>
          <div className="px-6 py-5 text-sm font-bold text-center text-slate-900">Enterprise</div>
        </div>

        {/* Sections */}
        {comparisonSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            
            {/* Section Title */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-900">{section.title}</span>
            </div>

            {/* Rows */}
            {section.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 border-t border-slate-100">
                <div className="px-6 py-5 text-sm text-slate-600">{row.name}</div>
                <div className="px-6 py-5 flex justify-center items-center"><RenderCell value={row.starter} /></div>
                <div className="px-6 py-5 flex justify-center items-center"><RenderCell value={row.professional} /></div>
                <div className="px-6 py-5 flex justify-center items-center"><RenderCell value={row.enterprise} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureTable;
