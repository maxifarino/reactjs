import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Utils from '../../../../../lib/utils';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import FilterActions from '../../../../common/filterActions/FilterActions'
import * as hcActions from '../../../../hiringclients/actions';

class FilterNotesTasks extends React.Component {
  constructor(props) {
    super(props);
    props.actions.fetchHiringClients({orderBy: 'name', orderDirection:'ASC', withoutPag: true});
  }
  render() {
    const {
      title,
      keywordsLabel,
      keywordsPlaceholder,
      assignedToLabel,
      labelRoleAssign,
      assignedToPlaceholder,
      assignedToRolePlaceholder,
      typePlaceholder,
      dueDateLabel,
      enteredDateLabel,
      datePlaceholder,
      statusPlaceholder,
      hiringClientPlaceholder
    } = this.props.local.strings.scProfile.notesTasks.filter;

    // assigned to options
    const usersList = this.props.users.list;
    const hiringClientList = this.props.hc.list;
    const rolesPossibleValues = this.props.notesTasks.rolesPossibleValues;
    const hiringClientOptionsList = Utils.getOptionsList(hiringClientPlaceholder, hiringClientList, 'name', 'id', 'name')
    const assignedOptionsList = Utils.getOptionsList(assignedToPlaceholder, usersList, 'name', 'id', 'name');
    const assignRoleOptionsList = Utils.getOptionsList(assignedToRolePlaceholder, rolesPossibleValues, 'name', 'id', 'name');
    const typesOptionsList = Utils.getOptionsList(typePlaceholder, [{ id: 1, name: 'Note' }, { id: 2, name: 'Task' } ], 'name', 'id', 'name');
    const statusOptionsList = Utils.getOptionsList(statusPlaceholder, [{ id: 1, name: 'WIP' }, { id: 2, name: 'Completed' } ], 'name', 'id', 'name');

    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form" style={{backgroundColor: 'white'}}>
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            <div className="col-md-4 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="keywords">{keywordsLabel}: </label>
                <Field
                  name="keywords"
                  type="text"
                  placeholder={`--${keywordsPlaceholder}--`}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>

            {
              !this.props.fromSidebar &&
              <div className="col-md-2 col-sm-12 no-padd" >
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="assignedTo">{assignedToLabel}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="assignedTo"
                      component={renderSelect}
                      options={assignedOptionsList}/>
                  </div>
                </div>
              </div>
            }

            {
              !_.isEmpty(rolesPossibleValues) && this.props.fromHCtab &&
              <div className="col-md-2 col-sm-12 no-padd" >
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="assignedTo">{labelRoleAssign}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="assignedToRoleId"
                      component={renderSelect}
                      options={assignRoleOptionsList} />
                  </div>
                </div>
              </div>
            }

            {
              this.props.fromSidebar &&
              <div className="col-md-2 col-sm-12 no-padd" >
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="assignedTo">{hiringClientPlaceholder}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="hiringClient"
                      component={renderSelect}
                      options={hiringClientOptionsList}/>
                  </div>
                </div>
              </div>
            }

            {
              !this.props.fromSidebar &&
              <div className="col-md-2 col-sm-12 no-padd">
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="date">{statusPlaceholder}: </label>
                  <Field
                    name="statusId"
                    component={renderSelect}
                    options={statusOptionsList} />
                </div>
              </div>
            }

            {
              !this.props.fromSidebar &&
              <div className="col-md-2 col-sm-12 no-padd" >
                <div className="admin-form-field-wrapper keywords-field">
                    <label htmlFor="typeId">{typePlaceholder}: </label>
                    <div className="select-wrapper">
                    <Field
                        name="typeId"
                        component={renderSelect}
                        options={typesOptionsList} />
                    </div>
                </div>
              </div>
            }

            <div className="col-md-2 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="date">{enteredDateLabel}: </label>
                <Field
                  name="enteredDate"
                  type="date"
                  placeholder={`--${datePlaceholder}--`}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>

            <div className="col-md-2 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="date">{dueDateLabel}: </label>
                <Field
                  name="dueDate"
                  type="date"
                  placeholder={`--${datePlaceholder}--`}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>

            <FilterActions
              formName={this.props.form}
              dispatch={this.props.dispatch} />

          </div>
        </div>
      </form>

    );
  }
}

FilterNotesTasks = reduxForm({
  form: 'FilterNotesTasks',
})(FilterNotesTasks);

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    hc: state.hc,
    local: state.localization,
    notesTasks: state.notesTasks
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(hcActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterNotesTasks);
