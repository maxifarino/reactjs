import React from 'react';

const EndorsementsTable = (props) => (
  <div className="endorsements-table">
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
    {props.endorsements && props.endorsements.length > 0 ? (
      props.endorsements.map(endorsement => {
        return (
          <tr key={endorsement.Id}>
            <td>{endorsement.Name}</td>
          </tr>
        )
      })
    ):(
      <tr>
        <td colSpan={5}>No Additional Requirements found</td>
      </tr>
    )}
    </tbody>
  </table>
  </div>
);

const EndorsementsList = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <EndorsementsTable endorsements={props.endorsementsList} />
      </div>
    </div>
  )
};

export default EndorsementsList;