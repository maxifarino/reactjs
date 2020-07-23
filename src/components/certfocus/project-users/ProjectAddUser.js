import React, {Component} from 'react';
import {connect} from "react-redux";
import Utils from "../../../lib/utils";
import {Field, reduxForm} from "redux-form";
import renderSelect from "../../customInputs/renderSelect";
import validate from "./validation";
import {bindActionCreators} from "redux";
import * as projectsUsersActions from "./actions"

class ProjectAddUser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedUser: null,
    }
  }

  handleUserChange = (event) => {
    const {holderUsers} = this.props;
    this.props.actions.setProjectUsersListError('');

    let user = holderUsers.find(el => {
      return (el.id == event.target.value);
    });
    this.setState({
      selectedUser: user,
    });

  };

  displayError = (error) => {
    return (
      <div className="error-item-form">
        { error }
      </div>
    )
  }

  render() {
    const {handleSubmit, projectName, holderUsers, error} = this.props;

    const {
      title, userPH, previewTitle, saveButton, cancelButton
    } = this.props.local.strings.projectUsers.addUser;
    const holderUsersOptions = Utils.getOptionsList(userPH, holderUsers, 'name', 'id', 'name', 0);
    return (
      <div className="add-item-view">
        <div className="add-item-header">
          <h1>{title} "{projectName}"</h1>
        </div>
        <section className="white-section">
          <div className="add-item-form-subsection">
            <form
              className="save-item-form"
              onSubmit={handleSubmit}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 col-sm-12 no-padd">
                    <div className="admin-form-field-wrapper">
                      <label htmlFor="user"> {'User: '} </label>
                      <div className="select-wrapper">
                        <Field
                          name="user"
                          component={renderSelect}
                          onChange={(event) => this.handleUserChange(event)}
                          options={holderUsersOptions}/>
                      </div>
                    </div>
                  </div>
                  {
                    this.props.projectUsers.errorProjectUsers
                      ? this.displayError(this.props.projectUsers.errorProjectUsers)
                      : null
                  }
                </div>
              </div>

              <div className="add-item-bn no-padding">
                <button
                  className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
                  type="submit" >
                  {saveButton}
                </button>
                <a
                  className="cancel-add-item"
                  onClick={this.props.close} >
                  {cancelButton}
                </a>
              </div>
            </form>
          </div>
        </section>
        {
          (this.state.selectedUser) ? (
            <div className="previewUser">
              <h1>{previewTitle}</h1>
              <p><span>User: </span>{this.state.selectedUser.name}</p>
              <p><span>Email: </span>{this.state.selectedUser.mail}</p>
              <p><span>PQ Role: </span>{this.state.selectedUser.role}</p>
              <p><span>CF Role: </span>{this.state.selectedUser.CFRole}</p>
              <p><span>Company: </span>{this.state.selectedUser.company}</p>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

const AddProjectUserForm = reduxForm({
  form: 'AddProjectUserForm',
  validate,
  onSubmitFail: (e, dispatch, submitError) => {
    if (submitError) {
      console.log('submitError = ', submitError)
    }
  }
})(ProjectAddUser);

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(projectsUsersActions, dispatch),
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    projectUsers: state.projectUsers,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectUserForm);