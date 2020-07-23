import React from 'react';

const AttachmentsTable = (props) => (
  <div className="attachments-table">
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
    {props.attachments && props.attachments.length > 0 ? (
      props.attachments.map(attachment => {        
        return (
          <tr key={attachment.requirementSetDocumentId}>
            <td><a href={attachment.url} target="_blank">{attachment.fileName}</a></td>
          </tr>
        )
      })
    ):(
      <tr>
        <td colSpan={5}>No Attachments found</td>
      </tr>
    )}
    </tbody>
  </table>
  </div>
);

const AttachmentsList = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <AttachmentsTable attachments={props.attachmentsList} />
      </div>
    </div>
  )
};

export default AttachmentsList;