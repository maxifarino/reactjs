/*eslint no-loop-func: 0*/
import React from 'react';
import { connect } from 'react-redux';
import {  withRouter, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import Utils from '../../lib/utils';
import * as linkActions from './actions';
import * as filesActions from '../sc-profile/tabs/files/actions';
import * as formPreviewerActions from '../formPreviewer/actions';
import FormTableOfContents from '../formPreviewer/formView/formTableOfContents';
import FormView from '../formPreviewer/formView';
import './formLink.css';

const formPreviewerUtils = require('../formPreviewer/utils');
const Alerts = require ('../alerts');
const _ = require('lodash');

class FormLink extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      form: null,
      fieldValues: null,
      redirectToDashboard: false,
      checkSubmissionMode: false
    }

    let link, savedFormId;
    if (props.fromTab){
      link = props.linkHash;
      savedFormId = props.savedFormId;
    } else {
      link = props.match.params.link;
      savedFormId = props.match.params.savedFormId;
    }

    this.props.formPreviewerActions.setTableOfContentItems([]);

    if (savedFormId) {
      props.actions.getFormAndValuesFromSubmissionId (savedFormId);
      this.state.checkSubmissionMode = true;
    } else {
      props.actions.getFormAndValuesFromLink (link);
    }

    this.saveFieldValue = this.saveFieldValue.bind(this);
    this.saveRadioButtonValues = this.saveRadioButtonValues.bind(this);
    this.saveAllValues = this.saveAllValues.bind(this);
    this.canEditValues = this.canEditValues.bind(this);
  }

  canEditValues () {
    if(this.state.checkSubmissionMode) {
      if (this.props.loginProfile.Role) {
        if (this.props.loginProfile.Role.IsSCRole) {
          return this.props.formLink.savedFormStatus !== 'Complete';
        }
        return (this.props.loginProfile.Role.IsPrequalRole &&
          this.props.loginProfile.Role.IsPrequalRole > 0);
      }
      return false;
    } else {
      return this.props.formLink.savedFormStatus !== 'Complete';
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.formLink.loading)return;
    this.showFormLinkAlerts (nextProps);

    const {form} = nextProps.formLink;
    if (!form) return;

    const fieldValues = formPreviewerUtils.getFormFieldValues(form);

    //assign the saved values from backend
    const backendValues = nextProps.formLink.savedValues;
    if (backendValues && backendValues.length > 0) {
      // if there are saved values we assign them
      for (var i = 0; i < backendValues.length; i++) {
        // get the current saved field id
        const savedFieldId = backendValues[i].formSectionFieldId;
        // use the id to get the index of the field value
        const index = _.findIndex(fieldValues, function(o) { return o.fieldId === savedFieldId; });
        // assign the value
        if (fieldValues[index].type === 'CheckBox' || fieldValues[index].type === 'Radio Button') {
          fieldValues[index].value = Utils.parseBoolean(backendValues[i].savedValue);
        } else {
          let value = backendValues[i].savedValue;
          const type = fieldValues[index].type;
          // format if necessary for initialization
          if(value !== '' && value !== null && value !== undefined){
            switch(type){
              case 'Phone':
                value = Utils.formatPhoneNumber(value);
                break;
              case 'Currency':
                value = Utils.formatCurrency(value);
                break;
              default:
                break;
            }
          }
          fieldValues[index].value = value;

          //assign file link value
          fieldValues[index].fileLink = backendValues[i].fileLink
        }

      }
    }

    this.setState({form, fieldValues});
  }

  onCancel () {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  showFormLinkAlerts (nextProps) {
    if(this.props.formLink.loading && !nextProps.formLink.loading){
      if(nextProps.formLink.error) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.formLink.error,
          'Accept',
          false,
          ()=>{
            if (nextProps.formLink.redirect) {
              if(this.props.fromTab){
                this.onCancel();
              } else {
                this.setState({redirectToDashboard:true});
              }
            }
          }
        );
      } else if(nextProps.formLink.successMsg) {
        Alerts.showInformationAlert(
          'Success!',
          nextProps.formLink.successMsg.replace('@HiringClient@',nextProps.hcName),
          'Accept',
          false,
          ()=>{
            if (nextProps.formLink.redirect) {
              if(this.props.fromTab){
                this.onCancel();
              } else {
                this.setState({redirectToDashboard:true});
              }
            }
          }
        );
      }
    }
  }

  saveFieldValue (key, value, internalName) {
    if(!this.canEditValues()) return;

    const newList = this.state.fieldValues.map(
      (fieldValue, index) => fieldValue.key === key ?
        {
          ...fieldValue,
          value,
          internalName
        } : fieldValue
    );
    this.setState({ fieldValues: newList });
  }

  saveRadioButtonValues (keyValueArr) {
    if(!this.canEditValues()) return;

    const fieldValues = this.state.fieldValues;
    const newList = [];
    for (var i = 0; i < fieldValues.length; i++) {
      const index = _.findIndex(keyValueArr, (o) => { return o.key === fieldValues[i].key; });
      if(index !== -1){
        fieldValues[i].value = keyValueArr[index].value;
        fieldValues[i].internalName = keyValueArr[index].internalName;
      }
      newList.push(fieldValues[i]);
    }
    this.setState({ fieldValues: newList });
  }

  saveAllValues (isComplete) {
    if(!this.canEditValues()) return;

    const fieldValues = this.state.fieldValues;
    let savedValues = [];

    for (var i = 0; i < fieldValues.length; i++) {
      const value = fieldValues[i].value;
      const type = fieldValues[i].type;
      const internalName = fieldValues[i].internalName;
      if (value !== null && value !== undefined) {
        if(type === "File Upload"){
          //console.log(fieldValues[i]);
          if (value.name && value.name !== '') {

            // console.log('file input value = ', JSON.stringify(value))

            // if new file is available, save the file and assign the file name as value
            const formData = new FormData();
            formData.append('subcontractorId', this.props.formLink.subcontractorId);
            formData.append('description', `Field Name:${internalName}`);
            formData.append('fileTypeId', 1);
            formData.append('payloadId', this.props.formLink.savedFormId);
            formData.append('documentFile', value);
            formData.append('hiringClientId', this.props.hcId);

            this.props.filesActions.saveFile(formData);

            const newEntry = {
              formSectionFieldId: fieldValues[i].fieldId,
              savedValue: value.name
            }
            savedValues.push(newEntry);

          } else if (value && value !== "") {
            // if there's no new file, send the stored value
            const newEntry = {
              formSectionFieldId: fieldValues[i].fieldId,
              savedValue: value
            }
            savedValues.push(newEntry);
          }
        } else {
          let realValue = value;
          //format if necessary
          if(value !== ''){
            switch (type) {
              case 'Phone':
                realValue = Utils.normalizePhoneNumber(value, value);
                //console.log(realValue);
                break;
              case 'Currency':
                realValue = Utils.normalizeCurrency(value);
                //console.log(realValue);
                break;
              default:
                break;
            }
          }
          //create entry
          const newEntry = {
            formSectionFieldId: fieldValues[i].fieldId,
            savedValue: realValue
          }
          savedValues.push(newEntry);
        }
      }
    }
    this.props.actions.saveFormValues(this.props.formLink.savedFormId, savedValues, isComplete);
  }

  render() {
    if (this.state.redirectToDashboard) {
      return <Redirect push to="/dashboard" />;
    }

    //const onlyView = !this.canEditValues();
    const containerStyle = this.props.fromTab? {backgroundColor: 'white'}:{}
    const tabStyle = this.props.fromTab? {height: 'auto'}:{}

    return (
      <div style={containerStyle}>
        <div className="container-fluid">
          <div className="row">
            <FormTableOfContents fromTab={this.props.fromTab} />
            <div className="col-sm-12 col-md-8 form-link-main" style={tabStyle}>
              {
                this.state.form ?
                  <FormView
                    form={this.state.form}
                    fieldValues={this.state.fieldValues}
                    saveFieldValue={this.saveFieldValue}
                    saveRadioButtonValues={this.saveRadioButtonValues}
                    canEditValues={this.canEditValues()}
                    canSubmit={this.canEditValues()}
                    submitFormValues={()=>{this.saveAllValues(true)}}
                    saveForLater={()=>{this.saveAllValues(false)}}
                    fromTab={this.props.fromTab}
                    onCancel={() => {this.onCancel()}}
                  />
                  :null
              }
            </div>
          </div>
        </div>
        {
          this.props.formLink.loading?
          <div style={{
            position:'fixed',
            top:'0',
            left:'0',
            backgroundColor:'#80808087',
            width:'100%',
            height:'100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="spinner-wrapper">
              <div className="spinner"></div>
            </div>
          </div>:null
        }
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  console.log('state.HCProfile',state.HCProfile.profileData.name);
  return {
    hcId: state.SCProfile.hcId,
    hcName:state.HCProfile.profileData.name,
    formLink: state.formLink,
    local: state.localization,
    loginProfile: state.login.profile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(linkActions, dispatch),
    filesActions: bindActionCreators(filesActions, dispatch),
    formPreviewerActions: bindActionCreators(formPreviewerActions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormLink));
