
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";

interface EditableAmountProps {
  value: number;
  onUpdate: (value: number) => void;
  className?: string;
  prefix?: string;
}

const EditableAmount: React.FC<EditableAmountProps> = ({ 
  value, 
  onUpdate, 
  className = "",
  prefix = "$"
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toFixed(2));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdate(numValue);
    } else {
      setInputValue(value.toFixed(2));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toFixed(2));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-32 h-8 text-lg ${className}`}
        step="0.01"
        min="0"
      />
    );
  }

  return (
    <div 
      className={`flex items-center cursor-pointer group ${className}`}
      onClick={handleEdit}
    >
      <span className="text-2xl font-bold">{prefix}{value.toFixed(2)}</span>
      <Edit2 size={16} className="ml-2 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default EditableAmount;
