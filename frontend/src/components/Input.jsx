import React from 'react';

export default function Input({ icon: Icon, label, error, name, ...props }) {
  return (
    <div className="flex flex-col w-full group">
      {label && (
        <label htmlFor={name} className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 mb-1.5 block group-focus-within:text-blue-600 transition-colors">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        )}
        
        <input
          id={name}
          name={name}
          {...props}
          className={`
            w-full py-4 bg-white border rounded-xl outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error 
              ? 'border-red-400 focus:ring-4 focus:ring-red-500/10' 
              : 'border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600'
            }
          `}
        />
      </div>

      {error && (
        <span className="text-red-500 text-[10px] font-medium ml-1 mt-1 animate-pulse">
          {error[0]}
        </span>
      )}
    </div>
  );
}