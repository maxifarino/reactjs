import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import _ from 'lodash';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions';
import moment from "moment";

class FilterNotesTasks extends Component {
  render() {
    const {handleSubmit, tasks, fromInsuredTab, fromHolderTab} = this.props;

    const {
      contactsTypesPossibleValues,
      statusPossibleValues,
      cfRolesPossibleValues,
    } = tasks;

    const {
      title,
      keywords,
      dateDueFrom,
      dateDueTo,
      assignedToUser,
      assignedToRole,
      status,
      priority,
      type,
      departments,
      holderKeywords,
      insuredKeywords,
    } = this.props.locale;

    // Assigned to options
    const usersList = Utils.sortByPQassociation(this.props.users.nPQlist);
    const assignedOptionsList = Utils.getOptionsList(assignedToUser.ph, usersList, 'name', 'id', 'name');
    const assignRoleOptionsList = Utils.getOptionsList(assignedToRole.ph, cfRolesPossibleValues, 'name', 'id', 'name');
    const statusOptionsList = Utils.getOptionsList(status.ph, statusPossibleValues, 'status', 'id', 'name');

    const taskPriorityOptions = Utils.getOptionsList(priority.ph, this.props.tasks.taskPriorityPossibleValues, 'name', 'id', 'name', '');
    const taskTypesOptions = Utils.getOptionsList(type.ph, this.props.tasks.taskTypesPossibleValues, 'type', 'id', 'type', '');

    const departmentsOptions = Utils.getOptionsList(departments.ph, this.props.departments, 'name', 'id', 'name', '');

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form" style={{backgroundColor: 'white'}}>
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            <div className="col-md-4 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="keywords">{keywords.label}: </label>
                <Field
                  name="keywords"
                  type="text"
                  placeholder={`-- ${keywords.ph} --`}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>

            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="holderKeyword">{holderKeywords.label}: </label>
                {fromHolderTab?
                  <Field
                    name="holderKeyword"
                    type="text"
                    placeholder={`-- ${holderKeywords.ph} --`}
                    component={renderField}
                    className="tags-input"
                    disabled
                  />
                :
                  <Field
                    name="holderKeyword"
                    type="text"
                    placeholder={`-- ${holderKeywords.ph} --`}
                    component={renderField}
                    className="tags-input"
                  />
                }
              </div>
            </div>
            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="insuredKeyword">{insuredKeywords.label}: </label>

                {(fromInsuredTab)?
                  <Field
                    name="insuredKeyword"
                    type="text"
                    placeholder={`-- ${insuredKeywords.ph} --`}
                    component={renderField}
                    className="tags-input"
                    disabled
                  />
                  :
                  <Field
                    name="insuredKeyword"
                    type="text"
                    placeholder={`-- ${insuredKeywords.ph} --`}
                    component={renderField}
                    className="tags-input"
                  />
                }


              </div>
            </div>

            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="dateFrom">{dateDueFrom.label}: </label>
                <Field
                  name="dateFrom"
                  type="date"
                  defaultValue={moment().format('YYYY-MM-DD')}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>
            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="dateTo">{dateDueTo.label}: </label>
                <Field
                  name="dateTo"
                  type="date"
                  component={renderField}
                  // defaultValue={moment().format('YYYY-MM-DD')}
                  className="tags-input"
                />
              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="departmentId">{departments.label}: </label>
                <div className="select-wrapper">
                  <Field
                    name="departmentId"
                    component={renderSelect}
                    options={departmentsOptions}/>
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="assignedTo">{assignedToUser.label}: </label>
                <div className="select-wrapper">
                  <Field
                    name="assignedTo"
                    component={renderSelect}
                    options={assignedOptionsList}/>
                </div>
              </div>
            </div>

            {!_.isEmpty(cfRolesPossibleValues) &&
            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="assignedToRoleId">{assignedToRole.label}: </label>
                <div className="select-wrapper">
                  <Field
                    name="assignedToRoleId"
                    component={renderSelect}
                    options={assignRoleOptionsList}/>
                </div>
              </div>
            </div>
            }

            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="statusId">{status.label}: </label>
                <div className="select-wrapper">
                  <Field
                    name="statusId"
                    component={renderSelect}
                    options={statusOptionsList}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="tasksPriorityId">{priority.label}: </label>
                <div className="select-wrapper">
                  <Field
                    name="tasksPriorityId"
                    component={renderSelect}
                    options={taskPriorityOptions}/>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-12 no-padding">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="typeId">{type.label}: </label>
                <div className="select-wrapper">
                  <Field
                    name="typeId"
                    component={renderSelect}
                    options={taskTypesOptions}/>
                </div>
              </div>
            </div>

          </div>
          <div className="row">
            <div className="col-12 no-padding">
              <div className="admin-form-field-wrapper">
                <FilterActions
                  formName={this.props.form}
                  dispatch={this.props.dispatch}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

    );
  }
}

FilterNotesTasks = reduxForm({
  form: 'FilterCFTasks',
  initialValues: {
    dateFrom: moment().format('YYYY-MM-DD'),
  }
})(FilterNotesTasks);

const mapStateToProps = (state, props) => {
  return {
    users: state.users,
    local: state.localization,
    locale: state.localization.strings.CFTasks.filter,
    departments: state.departments.list,
    tasks: state.CFTasks,
    initialValues: {
      insuredKeyword: props.insuredName,
      holderKeyword: props.holderName,
      assignedTo: props.userId,
    }
  }
};

export default connect(mapStateToProps)(FilterNotesTasks);
