import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from "redux-form";
import renderTypeAhead from "../../../../customInputs/renderTypeAhead";
import renderRemovable from "../../../../customInputs/renderRemovable";
import renderSelect from "../../../../customInputs/renderSelect";
import renderField from "../../../../customInputs/renderField";
import {connect} from "react-redux";
import validate from "./validate";
import Utils from "../../../../../lib/utils";

import * as commonActions from '../../../../common/actions';
import * as projectsActions from '../../../projects/actions';
import * as insuredsActions from '../../../insureds/actions';
import * as documentsActions from '../../../documents/actions';

import {bindActionCreators} from "redux";


class CFTaskForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      holderId: this.props.holderId || null,
      insuredId: this.props.insuredId || null,
      holderName: this.props.holderName || null,
      role: null,
      project: null,
    }

    this.userTypeahead = React.createRef();
    this.insuredTypeAhead = React.createRef();
    this.holderTypeAhead = React.createRef();
    this.projectInsuredTypeAhead = React.createRef();

    this.props.insuredsActions.setInsuredsList([]);

    if (this.props.holderId) {
      this.getHolderProjects(this.props.holderId);
    } else {
      this.props.projectsActions.setProjectsList([]);
    }
    console.log('props: ', this.props)
  }

  renderFormField = (element, idx) => {
    const {type, name, label, ph, options, conditional, show} = element;
    const {handleCallback = () => false} = element
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (fieldType === 'dummy') {
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            type={'text'}
            placeholder={ph}
            input={element}
            component={renderField}/>
        </div>
      );
    }


    if (fieldType === 'typeAhead') {
      const {fetching, results, error, handleSearch, onSelect, reference, onFocusSelect} = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            childRef={reference}
            name={name}
            placeholder={ph}
            fetching={fetching}
            results={results}
            handleSearch={handleSearch}
            fetchError={error}
            component={renderTypeAhead}
            onSelect={onSelect}
            onFocusSelect={onFocusSelect}
          />
        </div>
      );
    } else if (fieldType === 'removable') {
      const {valueText, disabled, onRemove} = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            onRemove={onRemove}
            disabled={disabled}
          />
        </div>
      );
    }

    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options ?
            <div className="select-wrapper">
              <Field
                name={name}
                component={renderSelect}
                options={options}
                callback={(val) => handleCallback(val)}
              />
            </div>
            :
            <Field
              name={name}
              type={fieldType}
              placeholder={ph}
              component={renderField}/>
        }
      </div>
    );
  }

  searchUsers = (filterTerm) => {
    //todo: implement user search
    const queryParams = {
      searchTerm: filterTerm,
      orderBy: 'name',
      orderDirection: 'ASC',
      searchCFOnly: 1,
    };

    if (this.state.role) queryParams.CFRoleId = this.state.role;

    this.props.commonActions.fetchUsersTypeAhead(queryParams);
  }

  onSelectUser = (user) => {
    this.props.commonActions.resetTypeAheadResults();
  }

  searchInsureds = (filterTerm) => {
    const queryParams = {
      insuredName: filterTerm
    }
    if (this.state.holderName) queryParams.holderName = this.state.holderName;
    this.props.commonActions.fetchInsuredsTypeAhead(queryParams);
  }

  searchProjectInsureds = (filterTerm) => {
    const queryParams = {
      insuredName: filterTerm,
      projectId: this.state.project,
    }
    this.props.commonActions.fetchProjectInsuredTypeAhead(queryParams);
  }

  onSelectInsured = (insured) => {
    // this.resetProjects();
    this.props.commonActions.resetTypeAheadResults();

  }

  onSelectProjectInsured = (projectInsured) => {
    // this.resetProjects();
    this.props.commonActions.resetTypeAheadResults();

  }

  searchHolders = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({nameTerm: filterTerm});
  }

  onSelectHolder = (holder) => {
    this.setState({
      holderId: holder.value,
      holderName: holder.label,
    })
    this.props.commonActions.resetTypeAheadResults();
    this.getHolderProjects(holder.value);
    this.insuredTypeAhead.current.resetTypeahead();
  }

  getHolderProjects = (holderId) => {
    const queryParams = {
      holderId: holderId,
      orderBy: 'name',
      orderDirection: 'ASC',
      archived: 0,
    };
    this.props.projectsActions.fetchProjects(queryParams).then( (res) => {
      if (this.props.projectId) {
        this.onProjectChange(this.props.projectId);
      }
    })
  }

  onProjectChange = (projectId) => {
    if (projectId) {
      const queryParams = {
        orderBy: 'UrgentFlag',
        orderDirection: 'DESC',
        projectId: projectId,
        documentsPage: true,
        withoutPagination: true,
      }
      this.props.documentsActions.fetchDocuments(queryParams)
      this.insuredTypeAhead.current.resetTypeahead();
      this.projectInsuredTypeAhead.current.resetTypeahead();
    }
    this.setState({
      project: projectId,
    })
  }

  onRoleChange = (value) => {
    this.setState({
      role: value,
    })
    // this.props.dispatch(clearFields(false,false,'user'))
    this.userTypeahead.current.resetTypeahead();
  }

  resetProjects = () => {
    this.props.projectsActions.setProjectsList([]);
    this.props.documentsActions.setDocumentsList([], 0);
    this.setState({
      project: null,
    })
  }

  render() {
    const {handleSubmit, dismiss} = this.props;

    const {typeAheadResults, typeAheadFetching, typeAheadError} = this.props.common;

    const {buttonCancel, buttonCreate} = this.props.locale;

    const {
      priority, type, dueDate,
      departments, role, user,
      holder, insured,
      project, projectInsured, document,
      comment
    } = this.props.locale.form;

    // FIRST ROW OF FIELDS
    const taskPriorityOptions = Utils.getOptionsList(null, this.props.tasks.taskPriorityPossibleValues, 'name', 'id', 'name');
    const urgencyField = {name: 'tasksPriorityId', label: priority.label, ph: priority.ph, options: taskPriorityOptions};
    const dueDateField = {name: 'dateDue', label: dueDate.label, ph: dueDate.ph, type: 'date'};
    const taskTypesOptions = Utils.getOptionsList(type.ph, this.props.tasks.taskTypesPossibleValues, 'type', 'id', 'type', '');
    const typeField = {name: 'typeId', label: type.label, ph: type.ph, options: taskTypesOptions};

    // SECOND ROW FO FIELDS
    const departmentsOptions = Utils.getOptionsList(departments.ph, this.props.departments, 'name', 'id', 'name', '');
    const departmentField = {
      name: 'departmentId',
      label: departments.label,
      ph: departments.ph,
      options: departmentsOptions
    };
    const rolesOptions = Utils.getOptionsList(role.ph, this.props.tasks.cfRolesPossibleValues, 'name', 'id', 'name', '');
    const rolesField = {
      name: 'assignedToRoleId',
      label: role.label,
      ph: role.ph,
      options: rolesOptions,
      handleCallback: (val) => this.onRoleChange(val)
    };
    const usersOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name', '');
    const usersField = {
      name: 'assignedToUserId', label: user.label, ph: `--${user.ph}--`, type: 'typeAhead',
      handleSearch: this.searchUsers, fetching: typeAheadFetching, results: usersOptions,
      onSelect: this.onSelectUser, error: typeAheadError, reference: this.userTypeahead
    };

    // THIRD ROW OF FIELDS
    let holderField = null;
    if (this.props.holderId) {
      holderField = {
        name: 'holderDummy', label: holder.label, type: 'dummy', value: this.props.holderName, readOnly: true
      }
    } else {
      const holdersOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name', '');
      holderField = {
        name: 'holder',
        label: holder.label,
        ph: `--${holder.ph}--`,
        type: 'typeAhead',
        handleSearch: this.searchHolders,
        fetching: typeAheadFetching,
        results: holdersOptions,
        onSelect: this.onSelectHolder,
        error: typeAheadError,
        onFocusSelect: this.resetProjects,
        reference: this.holderTypeAhead
      };
    }

    let insuredField = null;
    if (this.props.fromInsuredTab && this.props.insuredId) {
      insuredField = {
        name: 'insuredDummy', label: insured.label, type: 'dummy', value: this.props.insuredName, readOnly: true
      }
    } else {
      const insuredsOptions = Utils.getOptionsList(null, typeAheadResults, 'InsuredName', 'Id');
      insuredField = {
        name: 'insured', label: insured.label, ph: `--${insured.ph}--`, type: 'typeAhead',
        handleSearch: this.searchInsureds, fetching: typeAheadFetching, results: insuredsOptions,
        onSelect: this.onSelectInsured, error: typeAheadError, reference: this.insuredTypeAhead,
      };
    }

    // FOURTH ROW OF FIELDS
    let projectField = null;
    if (this.props.fromProject && this.props.projectId) {
      projectField = {
        name: 'projectDummy', label: project.label, type: 'dummy', value: this.props.projectName, readOnly: true
      }
    } else {
      const projectsOptions = Utils.getOptionsList(project.ph, this.props.holderProjects, 'name', 'id', 'name', this.props.projectId || '');
      projectField = {
        name: 'projectId',
        label: project.label,
        ph: project.ph,
        options: projectsOptions,
        conditional: true,
        show: (this.props.holderProjects.length > 0),
        handleCallback: this.onProjectChange
      };
    }

    const projectInsuredsOptions = Utils.getOptionsList(null, typeAheadResults, 'InsuredName', 'InsuredID');
    const projectInsuredsField = {
      name: 'projectInsured', label: projectInsured.label, ph: `--${projectInsured.ph}--`, type: 'typeAhead',
      handleSearch: this.searchProjectInsureds, fetching: typeAheadFetching, results: projectInsuredsOptions,
      onSelect: this.onSelectProjectInsured, error: typeAheadError, reference: this.projectInsuredTypeAhead,
      conditional: true, show: (this.state.project),
    };
    const documentsOptions = Utils.getOptionsList(document.ph, this.props.documents, 'FileName', 'DocumentID');
    const documentField = {
      name: 'documentId',
      label: document.label,
      ph: document.ph,
      options: documentsOptions,
      conditional: true, show: (this.state.project)
    };


    // FIFTH ROW OF FIELD
    const commentField = {name: 'description', label: comment.label, ph: comment.ph, type: 'textarea'};

    return (
      <form onSubmit={handleSubmit} className={'list-view-filter-form taskForm'}>
        <div className="container-fluid filter-fields">

          <div className="row">
            <div className="col-md-4 col-sm-12">
              {this.renderFormField(urgencyField)}
            </div>
            <div className="col-md-4 col-sm-12">
              {this.renderFormField(typeField)}
            </div>
            <div className="col-md-4 col-sm-12">
              {this.renderFormField(dueDateField)}
            </div>
          </div>

          {/*<div className="EditorButtons">*/}
          {/*  <a className="bg-sky-blue-gradient bn">Department</a>*/}
          {/*  <a className="bg-sky-blue-gradient bn">Role / User</a>*/}
          {/*  <a className="bg-sky-blue-gradient bn">Holder / Project / Project Insured</a>*/}
          {/*  <a className="bg-sky-blue-gradient bn">Insured</a>*/}
          {/*</div>*/}

          <div className="row">
            <div className="col-md-4 col-sm-12">
              {this.renderFormField(departmentField)}
            </div>
            <div className="col-md-4 col-sm-12">
              {this.renderFormField(rolesField)}
            </div>
            <div className="col-md-4 col-sm-12">
              {this.renderFormField(usersField)}
            </div>
          </div>

          {(!this.props.fromInsuredTab)?
            <React.Fragment>
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  {this.renderFormField(holderField)}
                </div>
                <div className="col-md-4 col-sm-12">
                  {this.renderFormField(insuredField)}
                </div>

              </div>

              <div className="row">
                <div className="col-md-4 col-sm-12">
                  {this.renderFormField(projectField)}
                </div>
                <div className="col-md-4 col-sm-12">
                  {this.renderFormField(projectInsuredsField)}
                </div>
                <div className="col-md-4 col-sm-12">
                  {this.renderFormField(documentField)}
                </div>
              </div>
            </React.Fragment>
          : null}

          <div className="row">
            <div className="col">
              {this.renderFormField(commentField)}
            </div>
          </div>
        </div>

        <div className="EditorButtons">
          <a className="bg-sky-blue-gradient bn" onClick={dismiss}>{buttonCancel}</a>
          <button className="bg-sky-blue-gradient bn" type="submit">{buttonCreate}</button>
        </div>
      </form>
    );
  }
}

CFTaskForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  dismiss: PropTypes.func.isRequired,
};

CFTaskForm = reduxForm({
  form: 'CFTaskForm',
  validate,
  initialValues: {
    description: ''
  }
})(CFTaskForm)

const mapStateToProps = (state, props) => {
  return {
    locale: state.localization.strings.CFTasks.modal,
    tasks: state.CFTasks,
    departments: state.departments.list,
    holderProjects: state.holdersProjects.list,
    insureds: state.insureds.list,
    documents: state.documents.list,
    common: state.common,
    initialValues: {
      holder: {
        value: props.holderId
      },
      insured: {
        value: props.insuredId
      },
      projectId: props.projectId,
      tasksPriorityId: 2,
    }
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectsActions: bindActionCreators(projectsActions, dispatch),
    insuredsActions: bindActionCreators(insuredsActions, dispatch),
    documentsActions: bindActionCreators(documentsActions, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CFTaskForm);