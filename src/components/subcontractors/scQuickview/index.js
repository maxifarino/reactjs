import React from 'react';

const SCQuickView = (props) => {
  const nameLabel = props.row.name.length > 11 ? `${props.row.name.substring(0, 11)}...` : props.row.name;
  return (
    <div 
      id={`popover-positioned-bottom-user-${props.idx}`} 
      className={`quickview-popover popover ${props.idx > 4 ? 'top' : 'bottom'}`}>
      <div className="popover-content">
        <div className="popoverheader">
          <h4 className="item-name">
            {nameLabel}
          </h4>
        </div>
        <div className="popoverbody">
          body - content
        </div>
      </div>
    </div>
  );
};

export default SCQuickView;