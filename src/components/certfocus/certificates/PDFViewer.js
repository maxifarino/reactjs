import React, { Component } from 'react';

class PDFViewer extends Component {
  render() {
    const { pdf, height, width, position, frameBorder, top } = this.props;

    return (
      <div style={{
        height:`${height}`,
        width:`${width}`,
        position:`${position}`,
        border:`${frameBorder}`,
        top: `${top}`
        }}
      >
        <embed
          className="pdfobject"
          src={pdf}
          type="application/pdf"
          style={{
            overflow: 'auto',
            width: '100%',
            height: '100%'
          }}
          internalinstanceid="30"
        />
      </div>
    );
  };
};

export default PDFViewer;