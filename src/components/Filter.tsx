import { useRef } from "react";

export interface FilterProps {
  value: string;
  onChange: (newValue: string) => void;
}

export function Filter({ value, onChange }: FilterProps) {
  let ref = useRef<HTMLInputElement>(null);
  const clear = () => {
    onChange("");
    ref.current?.focus();
  };
  return (
    <div className="filter">
      <input
        className="filter__input"
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></input>
      <div className="filter__clear" onClick={clear}>
        <i className="fa-solid fa-x" />
      </div>
    </div>
  );
}
