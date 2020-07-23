import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const FormOptions = (props) => {
  //let { HCTitle, SCTitle, buttonMoreLogs } = props.local.strings.users.rowPopOver;

  const { login } = props;

  const isPrequalAdmin = _.get(login, 'profile.Role.Id') === 1;

  return (
    <div
      id={`popover-positioned-bottom-user-${props.idx}` }
      className="quickview-popover popover bottom"
    >
      <div className="popover-content">
        <ul className="form-options">
          <li onClick={props.checkSubmissions}>FORM SUBMISSIONS</li>
          <li onClick={props.editForm}>EDIT FORM</li>

          {isPrequalAdmin && (
            <li onClick={props.hideScorecardsFields}>HIDE SCORECARD'S FIELDS</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    local: state.localization,
    login: state.login,
  }
};

export default connect(mapStateToProps)(FormOptions);
