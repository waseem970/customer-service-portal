import React, { ChangeEvent, InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, type = 'text', placeholder = '', ...props }) => (
  <div className="textfield">
    {label && <label className="textfield-label">{label}</label>}
    <input
      className="textfield-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  </div>
);

export default TextField;
