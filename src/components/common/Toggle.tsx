import React from 'react';

interface SwitchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const SwitchToggle: React.FC<SwitchToggleProps> = ({
  checked,
  onChange,
  className = '',
  disabled = false,
}) => (
  <div
    className={`relative w-12 h-7 flex items-center cursor-pointer select-none ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    onClick={() => !disabled && onChange(!checked)}
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onKeyPress={e => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) onChange(!checked);
    }}
  >
    <div
      className={`absolute left-0 top-0 w-12 h-7 rounded-full transition-colors duration-200 ${
        checked ? '' : 'bg-gray-300'
      }`}
      style={{
        backgroundColor: checked ? '#425985' : undefined
      }}
    />
    <div
      className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </div>
);

export default SwitchToggle;
