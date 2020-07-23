import React from "react";
import PropTypes from "prop-types";
import { MdCloudUpload } from "react-icons/md";

const Placeholder = ({ error, touched }) => (
  <div className={`placeholder-preview ${error && touched ? "has-error" : ""}`} style={{ textAlign: 'center' }}>
    <MdCloudUpload style={{ fontSize: 100, paddingTop: 70 }} />
    { error && touched ? (
      <p>{ error }</p>
    ) : (
      <p>Click or drag image file to this area to upload.</p>
    )}  
  </div>
);

Placeholder.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool
};

export default Placeholder;