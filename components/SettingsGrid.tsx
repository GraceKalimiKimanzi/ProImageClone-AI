
import React from 'react';

interface Option {
  id: string;
  label: string;
}

interface SettingsGridProps {
  title: string;
  options: Option[];
  selectedId: string;
  onChange: (id: string) => void;
  icon: string;
}

const SettingsGrid: React.FC<SettingsGridProps> = ({ title, options, selectedId, onChange, icon }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium uppercase tracking-wider">
        <i className={`fa-solid ${icon}`}></i>
        <span>{title}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
              selectedId === option.id
                ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsGrid;
