import React, { useState } from 'react';
import cls from './Tooltip.module.scss';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={cls.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cls.tooltipContent}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;