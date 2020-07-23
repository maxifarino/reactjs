import React from 'react';
import { connect } from 'react-redux';

const AddUserOverlay = props => {
  let {
    title,
    buttonAdmin,
    buttonOperator,
    buttonHC,
    buttonSC,
  
  } = props.local.strings.users.addUserOverlay;
  return (
    <div className="popover-additem">
      <h5>{title}:</h5>
      <div className="popover-row">
        <a 
          className="users-nav-link nav-bn nav-bn-small" 
          onClick={(e) => {props.openAddUserModal(e,'admin')}}
        >{buttonAdmin}
        </a>
        <a 
          className="users-nav-link nav-bn nav-bn-small"  
          onClick={(e) => {props.openAddUserModal(e,'operator')}}
        >{buttonOperator}
        </a>
      </div>
      <a 
        className="users-nav-link nav-bn nav-bn-full-width"
        onClick={(e) => {props.openAddUserModal(e,'hiringclient')}}
      >{buttonHC}
      </a>
      <a 
        className="users-nav-link nav-bn nav-bn-full-width"
        onClick={(e) => {props.openAddUserModal(e,'subcontractor')}}
      >{buttonSC}
      </a>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    local: state.localization
  };
};

export default connect(mapStateToProps)(AddUserOverlay);