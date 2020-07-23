import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import { EditorState } from 'draft-js';

import Header from './header';
import Editor from './editor';
import Footer from './footer';
//import * as regex from '../../../lib/regex';
import * as builderActions from './actions';
import * as templateListActions from '../list/actions';
import * as commonActions from '../../common/actions'
import './communication-templates-builder.css';

const Alerts = require ('../../alerts');

class TemplateBuilder extends Component {
  constructor(props) {
    super(props);

    this.onDiscardTemplate = this.onDiscardTemplate.bind(this);
    this.onSaveTemplate = this.onSaveTemplate.bind(this);
    this.onSetTemplateField = this.onSetTemplateField.bind(this);

    props.actions.setFromHC(this.props.fromhc);
    props.actions.fetchCommPlaceholders(this.props.login.currentSystem);
    props.commonActions.fetchUserHiringClients(this.props.login.currentSystem);
    if(props.templates.communicationTypesPossibleValues.length<=0){
      props.templateListActions.fetchTemplates({pageSize:1, pageNumber:1});
    }

    if(props.templateBuilder.template.ownerId === "" && this.props.match.params.id !== "") {
      props.actions.setHiringClient(this.props.match.params.id);
    }
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.templateBuilder.savingTemplate && !nextProps.templateBuilder.savingTemplate){
      if(nextProps.templateBuilder.errorMsg) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.templateBuilder.errorMsg,
          'Accept',
          false,
          ()=>{}
        );
      } else if(nextProps.templateBuilder.successMsg) {
        Alerts.showInformationAlert(
          'Success',
          nextProps.templateBuilder.successMsg,
          'Accept',
          false,
          ()=>{
            //this.onDiscardTemplate();
          }
        );
      }
    }
  }

  componentWillUnmount () {
    this.onDiscardTemplate();
  }

  onDiscardTemplate () {
    const editorState = EditorState.createEmpty();
    this.props.actions.setTemplateEditorState(editorState);
    this.props.actions.setTemplate(null);
    this.onSetTemplateField('templateName', "");
    this.onSetTemplateField('subject', "");
    this.onSetTemplateField('templateActivityId', "");
    this.onSetTemplateField('communicationTypeId', "");
    this.onSetTemplateField('fromAddress', "");
    this.onSetTemplateField('ownerId', "");
  }

  onSetTemplateField (fieldName, fieldValue) {
    this.props.actions.setTemplateField(fieldName, fieldValue);
  }

  onSaveTemplate () {
    let canSave = true;
    const {
      template
    } = this.props.templateBuilder;

    const payload = {
      templateName: template.templateName,
      subject: template.subject,
      bodyHTML: template.bodyHTML.replace(new RegExp('&lt;', 'g'), '<').replace(new RegExp('&gt;', 'g'), '>'),
      bodyText: template.bodyText,
      templateActivityId: template.templateActivityId,
      communicationTypeId: template.communicationTypeId,
      //fromAddress: template.fromAddress,
      ownerId: template.ownerId,
    }
    if(template.id && template.id !== ""){
      payload.templateId = template.id;
    }
    for (const key in payload){
      if(payload[key] === "" || payload[key] === null){
        canSave = false;
        break;
      }
    }
    const addressValid = true;//regex.EMAIL.test(payload.fromAddress);
    if(canSave && addressValid){
      this.props.actions.saveTemplate(payload);
    }
  }

  render() {
    if (!this.props.common.checkingAuthorizations) {
      if(!this.props.common.commTempAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    return(
      <div className="container-fluid template-builder">
        <Header onSetTemplateField={this.onSetTemplateField} />
        <Editor setTemplateEditorState={this.props.actions.setTemplateEditorState}
        />
        <Footer
          saveTemplate={this.onSaveTemplate}
          onDiscardTemplate={this.onDiscardTemplate}
        />
        {this.props.templateBuilder.savingTemplate?
          <div style={{position:'fixed', top:'0', left:'0', backgroundColor:'#80808087', width:'100%', height:'100%'}}>
            <div className="spinner-wrapper">
              <div className="spinner"></div>
            </div>
          </div>:null}
      </div>
    );
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(builderActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    templateListActions: bindActionCreators(templateListActions, dispatch),
  };
};

const mapStateToProps = (state, ownProps) => {
  const { templateBuilder, templates, common, login } = state;
  return {
    login,
    common,
    templateBuilder,
    templates
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplateBuilder);
