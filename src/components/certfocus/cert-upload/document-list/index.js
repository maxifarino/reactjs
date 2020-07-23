import React from 'react';

const DocumentsTable = (props) => (
  <div className="documents-table">
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Document Name</th>
        <th>Upload By</th>
        <th>Upload Date</th>
        <th>Document Status</th>
      </tr>
    </thead>
    <tbody>
    {props.documents && props.documents.length > 0 ? (
      props.documents.map(document => (
      <tr key={document.id}>
        <td>{document.name}</td>
        <td>{document.uploadBy}</td>
        <td>{document.uploadDate}</td>
        <td>{document.documentStatus}</td>
      </tr>
      )
    )) : (
      <tr>
        <td colSpan={4}>No documents</td>
      </tr>
    )}
    </tbody>
  </table>
  </div>
);

const DocumentList = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <DocumentsTable 
          documents={props.documentList}
        />
      </div>
    </div>
  )
};

export default DocumentList;