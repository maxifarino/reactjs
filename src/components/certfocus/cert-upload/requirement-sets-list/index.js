import React from 'react';
import Utils from '../../../../lib/utils';

const conditionPossibleValues = [
  { label: '-- Condition --', value: '' },
  { label: '= (Checked or unchecked)', value: 1 },
  { label: '= (AM Best Rating)', value: 2 },
  { label: '>= (AM Best Rating)', value: 3 },
  { label: '=', value: 4 },
  { label: '>=', value: 5 },
  { label: '>', value: 6 },
];

const RequirementSetsTable = (props) => (
  <div className="requirement-sets-table">
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>Status</th>
        <th>Coverage</th>
        <th>Attribute</th>
        <th>Value</th>
        <th>Requirements</th>
      </tr>
    </thead>
    <tbody>
    {props.requirementSets && props.requirementSets.length > 0 ? (
      props.requirementSets.map(requirement => {
        return (
          <tr key={requirement.ruleId}>
            <td>{requirement.status}</td>
            <td>{requirement.ruleGroupName}</td>
            <td>{requirement.attributeName}</td>
            <td>{(Number(requirement.conditionTypeId) > 3) 
                ? Utils.formatCurrency(requirement.conditionValue) 
                : requirement.conditionValue}
            </td>
            <td>{requirement.deficiencyText}</td>
          </tr>
        )
        })
    ):(
      <tr>
        <td colSpan={5}>No Requirement Sets</td>
      </tr>
    )}
    </tbody>
  </table>
  </div>
);

const RequirementSetsList = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <RequirementSetsTable requirementSets={props.requirementSetsList} />
      </div>
    </div>
  )
};

export default RequirementSetsList;