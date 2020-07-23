import React, {Component} from 'react';
import {connect} from 'react-redux';
import PTable from "../../../../common/ptable";
import Swal from "sweetalert2";
import {bindActionCreators} from "redux";
import * as departmentUsersAction from "../actions"
import {showQuickConfirmation} from "../../../../alerts";
import AddDepartmentUserForm from "./form";

class DepartmentsUsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddUserModal: false,
    }
  }

  openAddUserForm = () => {
    this.setState({
      showAddUserModal: true,
    })
  }
  closeAddUserForm = () => {
    this.setState({
      showAddUserModal: false,
    })
  }

  deleteDepartmentUser = (userId) => {
    let currentDepartment = this.props.currentItem

    Swal({
      title: this.props.locale.deleteUser.alertTitle,
      html: this.props.locale.deleteUser.alertHTML,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then( (result) => {
      if (result.value) {
        const queryParams = {
          departmentId: currentDepartment.id,
          userId,
        }
        this.props.actions.removeDepartmentUser(queryParams, (success) => {
          if (success) {
            const userIdx = this.props.departments.currentDepartmentUsers.findIndex( (el)=> el.Id === userId);
            this.props.departments.currentDepartmentUsers.splice(userIdx,1);
            this.props.resetForm();

            showQuickConfirmation(
              {
                title: `User has been successfully removed`,
                timer: 1500
              }
            );
          } else {
            showQuickConfirmation(
              {
                title: `ERROR: User WAS NOT  removed.  Please contact Administrator`,
                timer: 3000
              }
            );
          }
        })
        // window.alert('remove user')
      }
    })
  }

  renderButtonDeleteUser = (userId) => {
    return (
      <a onClick={() => this.deleteDepartmentUser(userId)}
         className={'cell-table-link icon-delete'}
      >{this.props.locale.table.actions.delete}</a>
    )
  }

  onHandleSubmit = (values) => {

    const {currentItem} = this.props;

    const queryParams = {
      departmentId: currentItem.id,
      userId: values.userId,
    }
    this.props.actions.addDepartmentUser(queryParams, (success) => {
      if (success) {
        showQuickConfirmation({
          title: this.props.locale.form.success,
          timer: 1500,
        });
        this.props.actions.getDepartmentUsers(queryParams);
        this.closeAddUserForm();
      } else {
        showQuickConfirmation({
          title: this.props.locale.form.fail,
          timer: 3000,
        });
      }
    });
  }

  render() {
    const {
      users,
      mails,
      roles,
    } = this.props.locale.table.columns;

    const fields = [
      'userName',
      'userMail',
      'userRole',
      'delete',
    ];

    const tableMetadata = {
      fields: fields,
      header: {
        userName: users,
        userMail: mails,
        userRole: roles,
        delete: '',
      }
    }
    const {currentItem} = this.props;
    const userList = this.props.departments.currentDepartmentUsers;
    const tableBody = userList.map((elem) => {
      return {
        userName: `${elem.FirstName} ${elem.LastName}`,
        userMail: elem.Mail,
        userRole: elem.Role,
        delete: this.renderButtonDeleteUser(elem.Id)
      }
    })

    const tableData = {
      fields: tableMetadata.fields,
      header: tableMetadata.header,
      body: tableBody
    };

    const paginationSettings = {
      total: 0,
      itemsPerPage: 10,
      setPageHandler: () => false,
      currentPageNumber: 1,
    };

    return (
      <div className="list-view departmentUsers" >
        <h1>{this.props.locale.form.usersTitle}{currentItem.name}</h1>
        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a
                      onClick={this.openAddUserForm}
                      className="list-view-nav-link nav-bn icon-add" >
                      {this.props.locale.buttonAddUser}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {(this.state.showAddUserModal)? (
          <section className="list-view-filters">
            <AddDepartmentUserForm
              onSubmit={this.onHandleSubmit}
              close={this.closeAddUserForm}
            />
          </section>
        ) : null}


        <PTable
          items={tableData}
          isFetching={false}
          clickOnColumnHeader={() => false}
          pagination={paginationSettings}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locale: state.localization.strings.departments,
    login: state.login,
    departments: state.departments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(departmentUsersAction, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DepartmentsUsersList);