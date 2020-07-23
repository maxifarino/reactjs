import React, {Component} from 'react';
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";

import validate from "./validation";
import renderSelect from "../../../../../customInputs/renderSelect";
import Utils from "../../../../../../lib/utils";
import renderField from "../../../../../customInputs/renderField";

class AddDepartmentUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: [],
    }
  }

  onChangeRole = (value) => {
    const usersRole = this.props.departments.currentDepartmentRoles.filter((el) => el.value == value);
    // CONVERT TO OBJECT ON DEMAND FOR BETTER USAGE.
    let usersList = []
    if (usersRole[0]) {
      if (typeof usersRole[0].users === 'string') usersRole[0].users = JSON.parse(usersRole[0].users);
      // there can be NO users available.
      if (usersRole[0].users) usersList = usersRole[0].users;
    }

    this.setState({
      usersList: usersList
    });
  }

  render() {
    const {handleSubmit} = this.props;
    const {user, role, cancelButton, saveButton, addUserTitle} = this.props.locale.form;

    const rolesList = Utils.getOptionsList(role.ph, this.props.departments.currentDepartmentRoles, 'label', 'value');
    let userList = Utils.getOptionsList(user.ph, this.state.usersList, 'label', 'value');
    return (
       <form onSubmit={handleSubmit}
             className="list-view-filter-form departmentUsers">
         <h2 className="list-view-filter-title">{addUserTitle}</h2>
         <div className="container-fluid filter-fields">

           <div className="row">
             <div className="col-md-6 col-sm-12">
               <div className="admin-form-field-wrapper">
                 <label htmlFor="archived">{role.label}: </label>
                 <div className="select-wrapper">
                   <Field
                     name="roleId"
                     component={renderSelect}
                     options={rolesList}
                     callback={(val) => this.onChangeRole(val)}
                   />
                 </div>
               </div>
             </div>
             <div className="col-md-6 col-sm-12">
               <div className="admin-form-field-wrapper">
                 <label htmlFor="userId">{user.label}: </label>
                 <div className="select-wrapper">
                   <Field
                     name="userId"
                     component={renderSelect}
                     options={userList}
                   />
                 </div>
               </div>
             </div>
           </div>

           <div className="row departmentUserButtons">
             <div className="add-item-bn">
               <button
                 className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
                 type="submit">
                 {saveButton}
               </button>
               <a
                 className="cancel-add-item"
                 onClick={this.props.close}>
                 {cancelButton}
               </a>
             </div>
           </div>
         </div>
       </form>
    );
  }
}

AddDepartmentUserForm = reduxForm({
  form: 'AddDepartmentUserForm',
  validate
})(AddDepartmentUserForm);

const mapStateToProps = (state) => {
  return {
    locale: state.localization.strings.departments,
    departments: state.departments,
  }
}

export default connect(mapStateToProps)(AddDepartmentUserForm);