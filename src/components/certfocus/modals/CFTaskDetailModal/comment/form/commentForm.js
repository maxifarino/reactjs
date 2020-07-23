import React, {Component} from 'react';
import PropTypes from 'prop-types';

import validate from "./validate";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import renderField from "../../../../../customInputs/renderField";
import renderTypeAhead from "../../../../../customInputs/renderTypeAhead";
import renderRemovable from "../../../../../customInputs/renderRemovable";
import renderSelect from "../../../../../customInputs/renderSelect";
import Utils from "../../../../../../lib/utils";
import {bindActionCreators} from "redux";
import * as commonActions from "../../../../../common/actions";
import RolAccess from "../../../../../common/rolAccess";

class CommentForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canReassign: false,
      canPostpone: false,
    }
  }


  renderFormField = (element, idx) => {
    const {type, name, label, ph, options, conditional, show} = element;
    const {handleCallback = () => false} = element
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
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

  setFormAction = (action) => {
    return this.props.handleSubmit(values =>
      this.props.onSubmit({
        ...values,
        action: action
      }))
  }

  searchUsers = (filterTerm) => {
    const queryParams = {
      searchTerm: filterTerm,
      orderBy: 'name',
      orderDirection: 'ASC',
      searchCFOnly: 1,
    };

    this.props.commonActions.fetchUsersTypeAhead(queryParams);
  }

  onSelectUser = () => {
    this.setState({
      canReassign: true,
    })
    this.props.commonActions.resetTypeAheadResults();
  }

  resetReassign = (value) => {
    this.setState({
      canReassign: false,
    })
  }

  setPostponeFlag = (date) => {
    this.setState({
      canPostpone: (date != ''),
    })
  }

  renderReassignFormPart = (usersOptions) => {
    const {typeAheadResults, typeAheadFetching, typeAheadError} = this.props.common;

    const {toUser} = this.props.locale.fields;
    const {reassign} = this.props.locale.buttons;
    const usersField = {
      name: 'toUser', label: toUser.label, ph: toUser.ph, type: 'typeAhead',
      handleSearch: this.searchUsers, fetching: typeAheadFetching, results: usersOptions,
      onSelect: this.onSelectUser, error: typeAheadError, reference: this.userTypeahead,
      onFocusSelect: this.resetReassign,
    };

    return (
      <React.Fragment>
        <div className="col-4">
          {this.renderFormField(usersField)}
        </div>
        <div className="col-2 comment">
          <button name={'reassignBtn'}
                  onClick={this.setFormAction('reassign')}
                  className={`${!this.state.canReassign ? '' : 'bg-sky-blue-gradient'} bn`}
                  type="submit"
                  disabled={!this.state.canReassign}>{reassign.label}
          </button>
        </div>
      </React.Fragment>
    );
  }

  renderPostponeFormPart = (canPostpone) => {
    const {toDate} = this.props.locale.fields;
    const {postpone} = this.props.locale.buttons;
    return (
      <React.Fragment>
        <div className="col-2">
          <div className="admin-form-field-wrapper">
            <label htmlFor={'toDate'}>{toDate.label}:</label>
            <Field
              name={'toDate'}
              type={'date'}
              onChange={(e, value) => this.setPostponeFlag(value)}
              component={renderField}
            />
          </div>
        </div>
        <div className="col-2 comment">
          <button name={'postponeBtn'}
                  onClick={this.setFormAction('postpone')}
                  className={`${!canPostpone ? '' : 'bg-sky-blue-gradient'} bn`}
                  type="submit"
                  disabled={!canPostpone}
          >{postpone.label}
          </button>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const {handleSubmit, pristine, submitting} = this.props;

    const {typeAheadResults} = this.props.common;
    const usersOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name', '');

    const {toUser, comment, toDate} = this.props.locale.fields;
    const {reply, reassign, postpone} = this.props.locale.buttons;

    return (
      <form onSubmit={handleSubmit} className={'list-view-filter-form taskForm mt-3'}>
        <div className="container-fluid filter-fields">
          <div className="row">
            <div className="col-12">
              <div className="admin-form-field-wrapper">
                <label htmlFor="comment">{comment.label}: </label>
                <Field
                  name={'comment'}
                  type={'textarea'}
                  component={renderField}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2 comment">
              <button name={'replyBtn'}
                      onClick={this.setFormAction('reply')}
                      className={`${pristine ? '' : 'bg-sky-blue-gradient'} bn`}
                      type="submit"
                      disabled={pristine || submitting}>{reply.label}
              </button>
            </div>

            <RolAccess
              masterTab={'tasks'}
              sectionTab={'task_reassign'}
              component={() => this.renderReassignFormPart(usersOptions)}
            />
            <RolAccess
              masterTab={'tasks'}
              sectionTab={'task_postpone'}
              component={() => this.renderPostponeFormPart(this.state.canPostpone)}
            />

          </div>
        </div>
      </form>
    );
  }
}

CommentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

CommentForm = reduxForm({
  form: 'taskCommentForm',
  validate,
  initialValues: {}
})(CommentForm);

const mapStateToProps = (state) => {
  return {
    common: state.common,
    locale: state.localization.strings.CFTasks.viewDetail.commentForm,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);