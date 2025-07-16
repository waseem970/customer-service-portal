import React, { SelectHTMLAttributes } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options = [], value, onChange, ...props }) => (
  <div className="dropdown">
    {label && <label className="dropdown-label">{label}</label>}
    <select className="dropdown-select" value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
