import React from 'react';

const QuickView= (props) => {
  const {
    handleMouseEnter,
    handleMouseLeave,
    customClasses,
    linkText,
    children } = props;
  return (
    <div className="quickview-wrapper">
      <a 
        className='icon-quick_view cell-table-link' 
        onMouseEnter={(e) => {handleMouseEnter(e, userItem.id)}}
        onMouseLeave={(e) => {handleMouseLeave(e)}} >
        {linkText}
        {children}
      </a>
    </div>
  );
};

export default QuickView;