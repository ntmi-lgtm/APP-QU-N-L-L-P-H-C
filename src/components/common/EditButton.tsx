import React from 'react';
import { Pencil } from 'lucide-react';

interface EditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  title = 'Chỉnh sửa',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 text-xs rounded-md',
    md: 'p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm rounded-lg',
    lg: 'p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-100 text-base rounded-xl',
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      title={title}
      aria-label={title}
      className={`inline-flex items-center gap-1 transition-all duration-150 cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <Pencil size={iconSizes[size]} className="stroke-[2.5]" />
    </button>
  );
};
