import React from "react";
import PropTypes from "prop-types";
import pdfIcon from '../../../../../assets/img/pdf-icon.png';

const numItemsPerRow = 3;
const spaceBetweenItems = 20; // edit to increase/decrease space between items

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  margin: `-${spaceBetweenItems * 0.5}px`,
  overflow: 'hidden',
};

const itemStyle = {
  display: "block",
  flex: "none",
  width: `${100 / numItemsPerRow}%`,
  boxSizing: "border-box",
  padding: `${spaceBetweenItems * 0.5}px`
};

const cardStyle = {
  height: "80px",
  textAlign: "center",
};

const imagePreviewClass = {
  display: 'block',
  width: '60px',
  height: "70px",
};

const detailsClass = {
  fontSize: '10px',
  paddingTop: '20px',
}

const ImagePreview = ({ files }) => (
  <div style={containerStyle}>
    { files.map(({ name, preview, size, type }, idx) => (
      <div key={idx} style={itemStyle}>
        <div style={cardStyle}>
          <img 
            src={ type === 'application/pdf' ? pdfIcon : preview } 
            alt={name} 
            title={name}
            style={imagePreviewClass}
          />
        </div>
        <div style={detailsClass}>
          {name} - {(size / 1024000).toFixed(2)}MB
        </div>
      </div>
    ))}
  </div>
)

ImagePreview.propTypes = {
  imagefile: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
};

export default ImagePreview;