import React, {Component} from 'react';
import {change, Field, formValueSelector, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {WithContext as ReactTags} from 'react-tag-input';

import * as usersActions from '../actions';
import * as commonActions from '../../common/actions';

import Utils from '../../../lib/utils';
import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect';
import SubcontractorSearch from './SubcontractorSearch'

import validate from './validation';
import renderTypeAhead from "../../customInputs/renderTypeAhead";

class AddUser extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fail: false,
      selectedSubcontractor: '',
      SubContractorsTags: [],
      defaultRoleId: 0,
      showPasswordInputs: true,
      showAddHolderUser: false,
      holderSelectedUser: null,
      showDepartments: false,
    }

    this.displayError = this.displayError.bind(this)
    this.handleSubcontractorInput = this.handleSubcontractorInput.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    if (props.currentEditingUser) {
      console.log('Route A -> props.currentEditingUser =', props.currentEditingUser);
      let {firstName, lastName, phone, roleId, cfRoleId, department} = props.currentEditingUser.extraUserInfo;

      props.actions.setHiringClientsTags([]);
      props.actions.setSubContractorsTags([]);
      this.state.showPasswordInputs = false;

      if (props.fromAdmin) {
        props.actions.fetchUsersHiringClientsAndOrSubcontractors(props.currentEditingUser.id)
      }
      props.dispatch(change('AddUser', 'firstName', firstName));
      props.dispatch(change('AddUser', 'lastName', lastName));
      props.dispatch(change('AddUser', 'phone', (phone) ? Utils.formatPhoneNumber(phone) : ''));
      props.dispatch(change('AddUser', 'email', props.currentEditingUser.email));
      props.dispatch(change('AddUser', 'role', roleId));
      props.dispatch(change('AddUser', 'cfRole', cfRoleId));
      props.dispatch(change('AddUser', 'department', department));
    } else {
      // console.log('Route B')
      props.actions.setHiringClientsTags([]);
      props.actions.setSubContractorsTags([]);
      if (props.fromHCtab) props.dispatch(change('AddUser', 'role', 6));
      if (props.fromSCtab) props.dispatch(change('AddUser', 'role', 4));
    }

    if (props.fromHolderTab) {
      this.state.hideAddUserForm = true;
      //fetch holders tags if we are editing a user
      if (props.currentEditingUser) props.actions.fetchUsersHiringClientsAndOrSubcontractors(props.currentEditingUser.id)
    }

  }

  componentDidMount() {
    if (this.props.currentEditingUser) {
      let {cfRoleId} = this.props.currentEditingUser.extraUserInfo;
      this.handleRoleChange(cfRoleId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      SubContractorsTags,
      subContractorsOptions
    } = this.props.users;
    const newSubContractorsTags = nextProps.users.SubContractorsTags
    // const newSubContractorsOptions = nextProps.users.subContractorsOptions
    // const oldSuggestionsSC         = this.generateSuggestions(subContractorsOptions, SubContractorsTags);
    // const newSuggestionsSC         = this.generateSuggestions(newSubContractorsOptions, newSubContractorsTags);

    if (newSubContractorsTags && newSubContractorsTags.length > 0 && Utils.areObjArraysDifferent(SubContractorsTags, newSubContractorsTags)) {
      this.setState({
        SubContractorsTags: newSubContractorsTags
      })
    }

    // if ( newSuggestionsSC && newSuggestionsSC.length > 0 && Utils.areObjArraysDifferent(oldSuggestionsSC, newSuggestionsSC) ) {
    //   this.setState({
    //     SuggestionsSC: newSuggestionsSC
    //   })
    // }


  }

  handleSelect(selection) {
    if (selection && selection.id && selection.text) {
      const newSubTag = {
        id: selection.id,
        value: selection.id,
        text: selection.text,
        label: selection.text,
        name: selection.text
      }
      console.log('newSubTag = ', newSubTag)
      const newSubTags = [...this.state.SubContractorsTags, ...newSubTag]
      this.setState({
        SubContractorsTags: newSubTags
      }, () => {
        this.props.actions.addSubContractorTag(newSubTag);
      })
    }
  }

  generatePassword = (e) => {
    e.preventDefault();
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pw = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      pw += charset.charAt(Math.floor(Math.random() * n));
    }
    this.props.dispatch(change('AddUser', 'password', pw));
    this.props.dispatch(change('AddUser', 'passwordagain', pw));
    this.props.dispatch(change('AddUser', 'changeuponlogin', true));
  }

  handleDeleteHCTag = (i) => {
    const {HiringClientsTags} = this.props.users;
    const id = HiringClientsTags[i].id;
    this.props.actions.deleteHCTag(id);
  }

  handleDeleteSCTag = (i) => {
    const {SubContractorsTags} = this.props.users;
    const id = SubContractorsTags[i].id;
    this.props.actions.deleteSCTag(id);

    const subTags = this.state.SubContractorsTags

    const deleteSubTagFromObjArray = (id, tags) => {
      const outTags = []
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i]

        for (let p in tag) {
          if (p == 'id' && tag[p] != id) {
            outTags.push(tag)
          }
        }

      }
      return outTags
    }

    this.setState({
      SubContractorsTags: deleteSubTagFromObjArray(id, subTags)
    })

  }

  getTagId = (tag, options) => {
    let id = '';
    for (let i = options.length - 1; i >= 0; i--) {
      if (options[i].label === tag) {
        id = options[i].value;
      }
    }
    return id;
  }

  displayError = (error) => {
    this.props.submitFailLoadReset()
    return (
      <div className="error-item-form">
        {error}
      </div>
    )
  }

  additionHCTag = (tag) => {
    const {HiringClientsTags, hiringClientsOptions} = this.props.users;
    const SuggestionsHC = this.generateSuggestions(hiringClientsOptions, HiringClientsTags);

    if (tag && Utils.isObjInObjArr(tag, SuggestionsHC)) {
      let _tag = Utils.isObjInObjArr(tag, SuggestionsHC)
      this.props.actions.addHiringClientTag(_tag);
    }
  }

  // additionSCTag = (tag) => {
  //   console.log('tag = ', tag)
  //   this.setState({
  //     selectedSubcontractor: tag
  //   })
  //   // const { SubContractorsTags, subContractorsOptions } = this.props.users;
  //   // const SuggestionsSC = this.generateSuggestions(subContractorsOptions, SubContractorsTags);

  //   // if (tag && Utils.isObjInObjArr(tag, SuggestionsSC)) {
  //   //   let _tag = Utils.isObjInObjArr(tag, SuggestionsSC)
  //   //   this.props.actions.addSubContractorTag(_tag);
  //   // }
  // }

  belongsTo = (option, tags) => {
    let belongs = false;
    for (let i = tags.length - 1; i >= 0; i--) {
      if (option.label === tags[i].value) {
        belongs = true;
      }
    }
    return belongs;
  }

  generateSuggestions = (options, tags) => {
    let suggestions = [];
    for (let i = options.length - 1; i >= 1; i--) {
      if (!this.belongsTo(options[i], tags)) {
        suggestions.push({
          id: `${options[i].value}`,
          text: options[i].label
        });
      }
    }
    return suggestions;
  }

  // componentDidMount() {
  //   document.querySelector(`[name="firstName"]`).focus();
  // }

  handleFilterSuggestions(textInputValue, possibleSuggestionsArray) {
    var lowerCaseQuery = textInputValue.toLowerCase()

    return possibleSuggestionsArray.filter(function (suggestion) {
      return suggestion.text.toLowerCase().includes(lowerCaseQuery)
    })
  }

  handleSubcontractorInput(value) {
    const keyword = value.subcontractors
    this.props.actions.fetchSubContractorsByKeyword(keyword);
  }

  toggleEditPassword = () => {
    this.setState(
      {showPasswordInputs: !this.state.showPasswordInputs}
    )
  };

  handleTypeAhead = (filterTerm) => {
    this.setSelectedUserData();

    const canSeeHCs = '3,6,10,23,21,20,22';

    const queryParams = {
      searchTerm: filterTerm,
      searchForHolder: canSeeHCs, //FIXME this ID's shouldn't be hardcoded
      orderBy: 'name',
      orderDirection: 'ASC'
    };

    this.props.commonActions.fetchUsersTypeAhead(queryParams);
    this.setState({showAddHolderUser: true});

  };

  handleHolderUserSelect = (select) => {
    const {
      typeAheadResults,
    } = this.props.common;


    let selectedUser = typeAheadResults.find((elem) => elem.id == select.value);

    let {id, firstName, lastName, phone, roleID, CFRoleId, mail} = selectedUser;

    this.props.actions.setCurrentEditingUser(selectedUser);

    const currentHc = {
      id: this.props.holderProfile.profileData.id.toString(),
      text: this.props.holderProfile.profileData.name
    }

    this.props.actions.fetchUsersHiringClientsAndOrSubcontractors(id)
      .then(res => {
        let found = this.props.users.HiringClientsTags.find(elem => {
          return elem.id == this.props.holderProfile.profileData.id;
        })
        if (!found) {
          this.props.users.HiringClientsTags.push(currentHc);
        }
      })

    this.props.dispatch(change('AddUser', 'firstName', firstName));
    this.props.dispatch(change('AddUser', 'lastName', lastName));
    this.props.dispatch(change('AddUser', 'phone', (phone) ? Utils.formatPhoneNumber(phone) : ''));
    this.props.dispatch(change('AddUser', 'email', mail));
    this.props.dispatch(change('AddUser', 'role', roleID));
    this.props.dispatch(change('AddUser', 'cfRole', CFRoleId));
    this.toggleAddUserForm(false);
    // this.setSelectedUserData(selectedUser);
  };

  resetHolderUser = () => {
    this.setSelectedUserData()
  };

  setSelectedUserData(user = null) {
    this.setState({
      holderSelectedUser: user
    })
  }

  toggleAddUserForm = (showPasswordFields = true) => {
    this.setState({
      hideAddUserForm: !this.state.hideAddUserForm,
    });
    if (showPasswordFields) {
      this.setState({
        showPasswordInputs: !this.state.showPasswordInputs,
      })
    }
  }

  handleRoleChange = (id) => {
    const roleIdx = this.props.departments.roles.findIndex((elem) => {
      return elem.Id == id
    })
    this.setState({
      showDepartments: (roleIdx >= 0)
    })
  }

  render() {
    let {
      editUser,
      addUser,
      roleLabel,
      //rolePlaceholder,
      noRoleAssigned,
      nameLabel,
      namePlaceholder,
      lastNameLabel,
      lastNamePlaceholder,
      emailLabel,
      emailPlaceholder,
      phoneLabel,
      phonePlaceholder,
      associatedSCLabel,
      associatedSCPlaceholder,
      associatedHCLabel,
      associatedHCPlaceholder,
      associatedHolderLabel,
      associatedInsuredLabel,
      passwordLabel,
      passwordPlaceholder,
      buttonGeneratePass,
      retypePasswordLabel,
      checkLabel,
      saveUserButton,
      cancelButton,
      subsPlaceholder,
      departmentsPlaceholder,
    } = this.props.local.strings.users.addUser;

    const {
      // SubContractorsTags,
      HiringClientsTags,
      hiringClientsOptions,
      subContractorsOptions
    } = this.props.users;

    const {SubContractorsTags} = this.state

    //console.log('SubContractorsTags = ', SubContractorsTags)
    //console.log('hiringClientsOptions = ', hiringClientsOptions)
    //console.log('subContractorsOptions = ', subContractorsOptions)

    const {handleSubmit} = this.props;
    const SuggestionsHC = this.generateSuggestions(hiringClientsOptions, HiringClientsTags);
    const SuggestionsSC = this.generateSuggestions(subContractorsOptions, SubContractorsTags);

    let showHCOptions = false;
    let showSCOptions = false;

    // FIXME this defines which role can have holders of subcontractors related, this should be defined with logic.
    // This constants are redefined on src/components/users/index.js line 330
    const canSeeHCs = new Set([3, 6, 10, 23, 21, 20, 22]);
    const canSeeSCs = new Set([4, 11]);

    const {pqRole, cfRole, roleId} = this.props;
    // const fromHCtabOrSCtab = this.props.fromHCtab || this.props.fromSCtab || this.props.fromHolderTab || this.props.fromProjectTab;

    if (this.props.currentRole || this.props.currentCFRole) {
      const chosenRoleId = Number(this.props.currentRole);
      const chosenCFRoleId = Number(this.props.currentCFRole);

      showHCOptions = (canSeeHCs.has(chosenRoleId) || canSeeHCs.has(chosenCFRoleId)) && this.props.fromAdmin
      showSCOptions = (canSeeSCs.has(chosenRoleId) || canSeeSCs.has(chosenCFRoleId)) && this.props.fromAdmin
    }
    const editedUser = this.props.currentEditingUser
    const roles = this.props.register.roleOptions.slice(1, this.props.register.roleOptions.length);
    const roleOptions = Utils.getOptionsList(noRoleAssigned, roles, 'label', 'value', 'label', 0);
    let allCFRoles = this.props.register.cfRoleOptions.slice(1, this.props.register.cfRoleOptions.length);
    let cfRoles = allCFRoles;
    if (this.props.fromHolderTab) {
      cfRoles = allCFRoles.filter((item) => {
        return canSeeHCs.has(item.value);
      })
    }
    const cfRoleOptions = Utils.getOptionsList(noRoleAssigned, cfRoles, 'label', 'value', 'label', 0);
    const modalTitle = editedUser ? editUser : addUser;
    const unallowedRoles = new Set([3, 4, 6]);

    const departmentOptions = Utils.getOptionsList(` ${departmentsPlaceholder} `, this.props.departments.list, 'name', 'id', 'name');

    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError
    } = this.props.common;

    const editingUserFlag = !!this.props.currentEditingUser || (this.props.users.currentEditingUser && (Object.keys(this.props.users.currentEditingUser).length > 0));
    const {typeAheadFieldValue} = this.props;
    const optionsList = Utils.getOptionsList(null, typeAheadResults, 'name', 'id');
    return (
      <div className="add-item-view">
        <div className="add-item-header">
          <h1>{modalTitle}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <form
              className="save-item-form save-user-form"
              onSubmit={handleSubmit}>
              <div className="container-fluid">
                {this.props.fromHolderTab && this.state.hideAddUserForm && !editingUserFlag ?
                  <React.Fragment>
                    <div className="row">
                      <div className="col no-padding">
                        <div className="type-ahead-search-input no-padding">
                          <div className="search-typeAhead">
                            <Field
                              label={'Search User'}
                              name="typeAhead"
                              placeholder={'All users'}
                              fetching={typeAheadFetching}
                              results={optionsList}
                              handleSearch={this.handleTypeAhead}
                              fetchError={typeAheadError}
                              component={renderTypeAhead}
                              onSelect={this.handleHolderUserSelect}
                              noIcon
                              noContainer
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.showAddHolderUser ?
                      (
                        <div className="row">
                          <div className="col no-padding text-center">
                            <p onClick={this.toggleAddUserForm}>Didn't find the user? you can <strong>add a new
                              one</strong></p>
                          </div>
                        </div>
                      ) : null
                    }
                    <div className="add-item-bn">
                      <a
                        className="cancel-add-item"
                        onClick={this.props.close}>
                        {cancelButton}
                      </a>
                    </div>

                  </React.Fragment>
                  :
                  <React.Fragment>
                    <div className="row">
                      {
                        !this.props.fromSCtab && !this.props.fromHolderTab && pqRole && !unallowedRoles.has(roleId) ?
                          <div className="col-md-12 col-sm-12 no-padding">
                            <div className="admin-form-field-wrapper">
                              <label htmlFor="role">
                                {cfRole ? 'PQ' : ''} {roleLabel}:
                              </label>
                              <div className="select-wrapper">
                                <Field
                                  name="role"
                                  component={renderSelect}
                                  options={roleOptions}/>
                              </div>
                            </div>
                          </div>
                          : null
                      }
                      {
                        !this.props.fromSCtab && !this.props.fromHCtab && cfRole ?
                          <div className="col-md-12 col-sm-12 no-padding">
                            <div className="admin-form-field-wrapper">
                              <label htmlFor="cfRole">
                                {pqRole ? 'CF' : ''} {roleLabel}:
                              </label>
                              <div className="select-wrapper">
                                <Field
                                  name="cfRole"
                                  component={renderSelect}
                                  callback={(val) => this.handleRoleChange(val)}
                                  options={cfRoleOptions}/>
                              </div>
                            </div>
                          </div>
                          : null
                      }
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 no-padding">
                        <div className="admin-form-field-wrapper">
                          <label htmlFor="firstName" className="required">{nameLabel}: </label>
                          <Field
                            name="firstName"
                            component={renderField}
                            type="text"
                            placeholder={namePlaceholder}/>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 no-padding">
                        <div className="admin-form-field-wrapper">
                          <label htmlFor="lastName" className="required">{lastNameLabel}: </label>
                          <Field
                            name="lastName"
                            component={renderField}
                            type="text"
                            placeholder={lastNamePlaceholder}/>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 no-padding">
                        <div className="admin-form-field-wrapper">
                          <label htmlFor="email" className="required">{emailLabel}: </label>
                          <Field
                            name="email"
                            component={renderField}
                            type="text"
                            placeholder={emailPlaceholder}/>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 no-padding">
                        <div className="admin-form-field-wrapper">
                          <label
                            htmlFor="phone">{phoneLabel}:
                          </label>
                          <Field
                            name="phone"
                            component={renderField}
                            type="text"
                            placeholder={phonePlaceholder}/>
                        </div>
                      </div>
                    </div>
                    {this.state.showDepartments ? (
                      <div className="row">
                        <div className="col-md-12 col-sm-12 no-padding">
                          <div className="admin-form-field-wrapper">
                            <label htmlFor="department">Department</label>
                            <div className="select-wrapper">
                              <Field
                                name="department"
                                component={renderSelect}
                                options={departmentOptions}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="row">
                      {
                        showSCOptions ?
                          <div className="subSearchMain col-md-6 col-sm-12 no-padding">
                            <div className="admin-form-field-wrapper subException">
                              <div className="SubcontractorSelect">
                                <SubcontractorSearch
                                  label={(cfRole && pqRole) ? `${associatedSCLabel} / ${associatedInsuredLabel}` : (pqRole ? associatedSCLabel : associatedInsuredLabel)}
                                  onSubmit={this.handleSubcontractorInput}
                                  placeholder={subsPlaceholder}
                                  subContractorsOptions={subContractorsOptions}
                                  additionSCTag={this.additionSCTag}
                                />
                                {
                                  subContractorsOptions.length > 0
                                    ? <div>
                                      <Field
                                        name="subContractorId"
                                        component={renderSelect}
                                        placeholder={editedUser && SubContractorsTags[0] && SubContractorsTags[0].label ? SubContractorsTags[0].label : null}
                                        defaultValue={editedUser && SubContractorsTags[0] && SubContractorsTags[0].value ? SubContractorsTags[0].value : null}
                                        options={subContractorsOptions}
                                        isValueAnObject={false}
                                        onChange={this.handleSelect}
                                      />
                                    </div>
                                    : null
                                }
                                {
                                  SubContractorsTags && SubContractorsTags[0]
                                    ? <ReactTags
                                      name="associatedSC"
                                      placeholder={associatedSCPlaceholder}
                                      tags={SubContractorsTags}
                                      suggestions={SuggestionsSC}
                                      handleDelete={this.handleDeleteSCTag}
                                      handleFilterSuggestions={this.handleFilterSuggestions}
                                      allowDeleteFromEmptyInput={true}
                                      minQueryLength={1}
                                    />
                                    : null
                                }

                              </div>
                            </div>
                          </div> : null
                      }
                      {
                        showHCOptions && roleId !== 3 && roleId !== 6 ?
                          <div className="col-md-6 col-sm-12 no-padding">
                            <div className="admin-form-field-wrapper">
                              <label htmlFor="associatedHC">
                                {(cfRole && pqRole) ? `${associatedHCLabel} / ${associatedHolderLabel}` : (pqRole ? associatedHCLabel : associatedHolderLabel)}:
                              </label>
                              <div>
                                <ReactTags
                                  name="associatedHC"
                                  placeholder={associatedHCPlaceholder}
                                  tags={HiringClientsTags}
                                  suggestions={SuggestionsHC}
                                  handleAddition={this.additionHCTag}
                                  handleDelete={this.handleDeleteHCTag}
                                  handleFilterSuggestions={this.handleFilterSuggestions}
                                  allowDeleteFromEmptyInput={false}
                                  minQueryLength={1}
                                />
                              </div>
                            </div>
                          </div> : null
                      }
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 no-padding">
                        <div className="admin-form-field-wrapper">
                          {this.state.selectedSubcontractor.name
                            ? this.state.selectedSubcontractor.name
                            : null
                          }
                        </div>
                      </div>
                    </div>
                    {(!this.state.showPasswordInputs) ?
                      (
                        <button
                          className="bn bn-small bg-green-dark-gradient create-item-bn"
                          onClick={() => this.toggleEditPassword()}
                          type="button">
                          Edit Password
                        </button>
                      ) : (
                        <React.Fragment>
                          <div className="row">
                            <div className="col-md-6 col-sm-12 no-padding">
                              <div className="admin-form-field-wrapper">
                                <label htmlFor="password" className="required">{passwordLabel}: </label>
                                <Field
                                  name="password"
                                  component={renderField}
                                  type="password"
                                  placeholder={passwordPlaceholder}/>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12 no-padding">
                              <div className="admin-form-field-wrapper">
                                <button className="bn bg-green-dark-gradient bn-generate-pw"
                                        onClick={this.generatePassword}>
                                  {buttonGeneratePass}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 col-sm-12 no-padding">
                              <div className="admin-form-field-wrapper">
                                <label htmlFor="passwordagain" className="required">{retypePasswordLabel}: </label>
                                <Field
                                  name="passwordagain"
                                  component={renderField}
                                  type="password"
                                  placeholder={passwordPlaceholder}/>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12 no-padding">
                              <div className="admin-form-field-wrapper">
                                <label htmlFor="changeuponlogin">
                                  <Field
                                    id="changeuponlogin"
                                    className="changeuponlogin"
                                    name="changeuponlogin"
                                    component={renderField}
                                    type="checkbox"
                                  />
                                  <span className="check add-user-check"></span>
                                  <span className="label">{checkLabel}</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    {
                      this.props.users.errorUsers
                        ? this.displayError(this.props.users.errorUsers)
                        : null
                    }
                    <div className="add-item-bn">
                      <button
                        className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
                        type="submit">
                        {saveUserButton}
                      </button>
                      <a
                        className="cancel-add-item"
                        onClick={this.props.close}>
                        {cancelButton}
                      </a>
                    </div>
                  </React.Fragment>
                }
              </div>
            </form>
          </div>
        </section>
      </div>

    );
  }
}

AddUser = reduxForm({
  form: 'AddUser',
  validate,
  onSubmitFail: (e, dispatch, submitError) => {
    if (submitError) {
      console.log('submitError = ', submitError)
    }
    const fieldNames = [
      'role',
      'cfRole',
      'firstName',
      'lastName',
      'email',
      'phone',
      'password',
      'passwordagain',
      'changeuponlogin',
      'subContractorId',
    ];
    Utils.getFirstFailedElem(fieldNames, e).focus();
  }
})(AddUser);

// Decorate with connect to read form values
const selector = formValueSelector('AddUser'); // <-- same as form name
AddUser = connect(
  state => {
    // can select values individually
    const currentRole = selector(state, 'role');
    const currentCFRole = selector(state, 'cfRole');
    return {
      currentRole,
      currentCFRole,
    }
  }
)(AddUser)

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(usersActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    register: state.register,
    local: state.localization,
    hcprofile: state.HCProfile,
    scProfile: state.SCProfile,
    holderProfile: state.holdersProfile,
    projectData: state.projectDetails.projectData,
    common: state.common,
    roleId: state.login.profile.RoleID,
    pqRole: state.login.profile.Role,
    cfRole: state.login.profile.CFRole,
    //IsPrequalRole: state.login.profile.Role.IsPrequalRole,
    departments: state.departments,
    initialValues: {
      role: 0,
      cfRole: 0
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
