import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {  withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Select from 'react-select';

import * as formActions from '../actions';
import * as fileActions from '../../sc-profile/tabs/files/actions';
import * as hcProfileActions from '../../hc-profile/actions'
import Utils from '../../../lib/utils';
import * as regex from '../../../lib/regex';

const _ = require('lodash');
//const Alerts = require ('../../alerts');
const Definitions = require('../../formBuilder/definitions');

const formGrid = Definitions.formGrid;
let TimeOut = null;
const sectionSpacing = 50;

class FormView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      form: this.props.form,
      realContainerWidth: 0,
      Hide: false,
      scale: 0,
      showErrors: false
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.renderSection = this.renderSection.bind(this);
    this.renderField = this.renderField.bind(this);
    this.getSize = this.getSize.bind(this);
    this.inputType = this.inputType.bind(this);
    this.getLastElementInSection = this.getLastElementInSection.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.onPreviousPage = this.onPreviousPage.bind(this);
    this.onSaveForLater = this.onSaveForLater.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.checkMandatoryFieldsCompleted = this.checkMandatoryFieldsCompleted.bind(this);
    this.checkSectionFieldsCompleted = this.checkSectionFieldsCompleted.bind(this);
    this.checkTriggerValue = this.checkTriggerValue.bind(this);
    this.checkGroupHasValue = this.checkGroupHasValue.bind(this);
    this.renderPageNumber = this.renderPageNumber.bind(this);
    this.renderLiteral = this.renderLiteral.bind(this);
    this.getPossibleDropDownValues = this.getPossibleDropDownValues.bind(this);
    this.setTableOfContentItems = this.setTableOfContentItems.bind(this);
    this.getDocumentsFileName = this.getDocumentsFileName.bind(this);
    this.matchFileUrlToName = this.matchFileUrlToName.bind(this)

    props.actions.fetchFormDropDownLists();
    this.props.actions.setFormPreviewerPage(0);
    this.setTableOfContentItems(this.props.form);

    let hcId = props.form.hiringClientId;
    props.hcProfileActions.fetchHCProfile(hcId)

  }

  getDocumentsFileName (documentFile, subcontractorId, newFileId) {
    /* eslint-disable */
    String.prototype.replaceAll = function(search, replacement) {
      let target = this;
      return target.split(search).join(replacement);
    };
    /* eslint-enable */

    let fileExtension = documentFile.name.split('.').pop();
    let fileName = documentFile.name.slice(0, - (fileExtension.length + 1)).replaceAll(" ", "_").replaceAll("'", "");
    let newFilename = fileName + '.' + fileExtension;

    return newFilename;
  }

  updateDimensions () {
    const container = document.getElementById('formSheetContainer');

    if (Math.abs(this.state.realContainerWidth - container.offsetWidth) > 0) {
      const scale = (container.offsetWidth)/formGrid.containerWidth;
      this.setState({scale: scale, realContainerWidth: container.offsetWidth});
      this.refreshWithTimeout();
    }
  }

  refreshWithTimeout () {
    if(TimeOut){
      clearTimeout(TimeOut);
      TimeOut = null;
    }

    // workaround to refresh field sizes after window resize
    const self = this;
    TimeOut = setTimeout(function() {
      self.setState({Hide:true});
      self.setState({Hide:false});
    }, 50);
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions);
    ReactDOM.findDOMNode(this).scrollIntoView();
    this.updateDimensions();
  }

  componentWillMount () {
    const query             = {}
    const SubcontractorId   = this.props.formLink.subcontractorId;
    const PayloadId         = this.props.formLink.savedFormId;

    if (SubcontractorId && PayloadId) {
      query.SubcontractorId = SubcontractorId;
      query.PayloadId       = PayloadId;
      this.props.actions.fetchFilesForSavedForm(query);
    }

  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    let hcId        = nextProps.form.hiringClientId
    if (hcId !== this.props.form.hiringClientId) {
      this.props.hcProfileActions.fetchHCProfile(hcId)
    }
    const query       = {}
    const oldPayload  = this.props.formLink.savedFormId;
    const newPayload  = nextProps.formLink.savedFormId;
    const oldSubId    = this.props.formLink.subcontractorId;
    const newSubId    = nextProps.formLink.subcontractorId;

    if ((newPayload && newPayload !== oldPayload) && (newSubId && newSubId !== oldSubId)) {
      query.SubcontractorId = newSubId;
      query.PayloadId       = newPayload;
      this.props.actions.fetchFilesForSavedForm(query);
    }

  }

  getFieldFile (fieldKey) {
    const fileInput = document.getElementById(fieldKey);
    return fileInput ? fileInput.files[0] : null;
  }

  hasValidFile (fieldKey, value) {
    const file = this.getFieldFile(fieldKey);
    return (file !== undefined && file !== null) || (value !== null && value !== undefined);
  }

  checkValueConstraints (field, value) {
    const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
    let valid = true;
    if(value){
      switch (type) {
        case "Email":
          valid = regex.EMAIL.test(value);
          break;
        case "Phone":
          valid = regex.PHONE.test(value);
          break;
        default:
          break;
      }
    }
    return valid;
  }

  checkMandatoryFieldsCompleted (section) {
    //const self = this;
    const fields = _.orderBy(section.fields, ['rowPos','columnPos']);
    let completed = true;
    let uncompleteField = null;

    for (var i = 0; i < fields.length; i++) {
      const field = fields[i];
      //const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
      const index = _.findIndex(this.props.fieldValues, function(o) { return o.key === field.key; });
      if(index !== -1) {
        const value = this.props.fieldValues[index].value;
        // first we check the validity of the current value
        if(!this.checkValueConstraints(field, value)) {
          completed = false;
          uncompleteField = field;
          break;
        }
        // if the value is valid we can continue
        if (Utils.parseBoolean(field.isMandatory)) {
          if (field.isConditional) {
            const triggered = this.checkTriggerValue(section, field.triggerFieldName);
            if(triggered){
              if(!this.checkComplete(section, field, value)){
                completed = false;
                uncompleteField = field;
                break;
              }
            }
          } else {
            if(!this.checkComplete(section, field, value)){
              completed = false;
              uncompleteField = field;
              break;
            }
          }
        }
      }

    }
    return {completed, uncompleteField};
  }

  checkComplete (section, field, value) {
    let complete = true;
    const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
    if (type === "File Upload") {
      if(!this.hasValidFile("file-field-"+field.key, value)){
        complete = false;
      }
    } else if (type === "CheckBox") {
      if(!this.checkGroupHasValue(section, field.controlGroup)){
        complete = false;
      }
    } else if (value === undefined || value === null || value === "") {
      complete = false;
    }
    return complete;
  }

  checkGroupHasValue (section, controlGroup) {
    const fields = section.fields;
    let hasValue = false;

    for (var i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.controlGroup === controlGroup) {
        const index = _.findIndex(this.props.fieldValues, function(o) { return o.key === field.key; });
        if(index !== -1){
          const value = this.props.fieldValues[index].value;
          if(value && value !== "false"){
            hasValue = true;
            break;
          }
        }
      }
    }

    return hasValue;
  }

  checkTriggerValue (section, triggerFieldName) {
    const fields = section.fields;
    let trigger = false;
    for (var i = 0; i < fields.length; i++) {
      const field = fields[i];
      const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
      if(field.internalName === triggerFieldName){
        const index = _.findIndex(this.props.fieldValues, function(o) { return o.key === field.key; });
        if(index !== -1){
          const value = this.props.fieldValues[index].value;
          if(type === "File Upload") {
            if(this.hasValidFile("file-field-"+field.key, value)) {
              trigger = true;
              break;
            }
          } else if (type === "Radio Button" || type === "CheckBox") {
            if(value && value !== "false") {
              trigger = true;
              break;
            }
          } else if (value && value !== "") {
            trigger = this.checkValueConstraints(field, value);
            break;
          }
        }
      }
    }
    return trigger;
  }

  onPreviousPage () {
    const { page } = this.props.formPreviewer;

    if (page > 0) {
      this.setState({showErrors: false});
      this.props.actions.setFormPreviewerPage(page-1);
      // 35 (page btn width) + 5 (margin right) = 40
      document.getElementById('pages-container').scrollLeft = (page-1)*40;
      ReactDOM.findDOMNode(this).scrollIntoView();
    }
  }

  onContinue () {
    const { form } = this.state;
    const { page } = this.props.formPreviewer;

    /*let completeSection = this.checkMandatoryFieldsCompleted(form.formSections[page]);
    if(this.props.canSubmit && !completeSection.completed) {
      this.setState({showErrors: true});
      this.focusOnField(completeSection.uncompleteField);
      return;
    }*/

    if (page < form.formSections.length-1) {
      this.setState({showErrors: false});
      this.props.actions.setFormPreviewerPage(page+1);
      // 35 (page btn width) + 5 (margin right) = 40
      document.getElementById('pages-container').scrollLeft = (page+1)*40;
      ReactDOM.findDOMNode(this).scrollIntoView();
    } else if (this.props.canSubmit && this.props.submitFormValues) {
      let complete = true;
      for (var i = 0; i < form.formSections.length; i++) {
        const completeSection = this.checkMandatoryFieldsCompleted(form.formSections[i]);
        if(!completeSection.completed){
          complete = false;
          this.props.actions.setFormPreviewerPage(i);
          this.focusOnField(completeSection.uncompleteField);
          break;
        }
      }
      if(complete){
        this.props.submitFormValues();
        //this.onCancel();
      }
    }
  }

  checkSectionFieldsCompleted() {
    const { form } = this.state;
    const sections = form.formSections;
    let complete = true;

    for(let l = 0; l < sections.length; l++) {
      const section = sections[l];
      const fields = section.fields;
      let completeSection = false;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const index = _.findIndex(this.props.fieldValues, function(o) { return o.key === field.key; });
        if(index !== -1) {
          const value = this.props.fieldValues[index].value;
          if(this.checkComplete(section, field, value)){
            completeSection = true;
            break;
          }
        }
      }
      if(!completeSection) {
        complete = false;
        break;
      }
    }

    return complete;
  }

  focusOnField (field) {
    setTimeout(function () {
      const query = `#field-${field.Id} input, #field-${field.Id} textarea, #field-${field.Id} select`;
      const element = document.querySelector(query);
      if(element) {
        element.focus();
        element.scrollIntoView();
      }
    }, 200);
  }

  setTableOfContentItems(form) {
    const items = [];
    if (form.name) {
      items.push({
        type: 'FormTitle',
        caption: form.name,
      });
    }

    const sections = _.orderBy(form.formSections, 'positionIndex', 'asc');
    for (var i = 0; i < sections.length; i++) {
      items.push({
        type: 'FormPage',
        caption: `Page ${i+1}`,
        page: i,
      });
      const currentSection = sections[i];
      const fields = _.orderBy(currentSection.fields, ['rowPos','columnPos']);
      for (var j = 0; j < fields.length; j++) {
        const field = fields[j];
        const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
        if(type === 'SectionDivider' || type === 'Sub Section Divider'){
          items.push({
            type,
            id: field.Id,
            caption: field.caption,
            page: i,
          });
        }
      }
    }

    this.props.actions.setTableOfContentItems(items);
  }

  onSaveForLater () {
    if (this.props.canSubmit && this.props.saveForLater && !this.props.formLink.loading) {
      this.props.saveForLater();
      /*
      if(this.checkSectionFieldsCompleted()) {
        this.props.saveForLater();
      }
      else {
        Alerts.showInformationAlert(
          'Error',
          "You can't save an empty section",
          'Accept',
          false,
          ()=>{
          }
        );
      }
      */
    }
  }

  onCancel () {
    if (this.props.fromTab && this.props.onCancel) {
      this.props.onCancel();
    }
  }

  getSize (num) {
    if(num === undefined || num == null){
      return null;
    }

    return num * this.state.scale;
  }

  getLastElementInSection (section) {
    let lastElement = null;
    let posY = 0;
    section.fields.forEach(function(field) {
      if(field.rowPos + field.rowsCount >= posY){
        lastElement = field;
        posY = field.rowPos + field.rowsCount;
      }
    });

    return lastElement;
  }

  getPossibleDropDownValues (field) {
    const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
    switch (type) {
      case 'DropDown':
      case 'Multi Select':
        const formFieldsLists = this.props.formPreviewer.formFieldsLists;
        const index = _.findIndex(formFieldsLists, function(o) {
          return o.id.toString() === field.referenceId.toString();
        });
        return index !== -1? formFieldsLists[index].possibleValues:[];
      case 'Source of financial statement':
        return this.props.formPreviewer.scorecardsSourcesList;
      case 'Period':
        return this.props.formPreviewer.turnOverRatesList;
      case 'Company Type':
        return this.props.formPreviewer.companiesTypesList;
      default:
        return [];
    }
  }

  renderLiteral (field) {
    let parts=[];
    if(field.caption){
      parts = field.caption.split('<%=link%>');
    }
    if(parts.length > 1 && field.urlTarget){
      const urlTarget = field.urlTarget.indexOf('http') === -1? `http://${field.urlTarget}`:field.urlTarget;
      return (
        <label className='labelField' style={{width: '100%', marginLeft: '5px'}}>
          {parts[0]}
          <a href={urlTarget} target="_blank">{field.urlTitle}</a>
          {parts[1]}
        </label>
      );
    } else {
      return <label className='labelField' style={{width: '100%', marginLeft: '5px'}}>{field.caption}</label>
    }
  }

  renderFileLink(fileName) {
    let link = null;

    link = this.props.files.downloadingFile ?
      (
        <div className="viewFileSpinnerContainer">
          <span className="spinner-wrapper">
            <div className="spinner" />
          </span>
        </div>
      ) : (
        <div
          className="viewFileLink"
          onClick={(e) => {
            e.preventDefault()
            this.props.fileActions.viewFileLink({ fileName }) }}
        >
          View
        </div>
      )


    return link;
  }

  matchFileUrlToName (fileName) {
    const formFiles = this.props.formPreviewer.formFiles
    let output = null
    for (let i=0; i<formFiles.length; i++) {
      let formFile = formFiles[i]
      if (formFile.Name === fileName) {
        output = formFile.url
      }
    }
    return output
  }

  inputType (field) {
    const self = this;
    const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
    const index = _.findIndex(this.props.fieldValues, function(o) { return o.key === field.key; });
    const possibleValues = this.getPossibleDropDownValues(field);
    let value = '';
    if(index !== -1){
      value = this.props.fieldValues[index].value || '';
    }

    const onFileChange = async (e) => {
      const file = this.getFieldFile("file-field-"+field.key);
      const _file = file ? file : ''
      const internalName = field.internalName
      // console.log('field = ', JSON.stringify(field))
      // console.log('value = ', value)
      self.props.saveFieldValue(field.key, _file, internalName);
    }

    const onValueChange = (e) => {
      self.props.saveFieldValue(field.key, e.target.value, field.internalName);
    }

    const onMultiSelectChange = (selectedOption) => {
      let strValue = null;
      selectedOption.forEach(function(opt) {
        if(!strValue){
          strValue = opt.value.toString();
        } else {
          strValue += `,${opt.value.toString()}`;
        }
      });
      self.props.saveFieldValue(field.key, strValue, field.internalName);
    }
    const getMultiSelectSelection = (options, strValue) => {
      const selection = [];
      const arrValue = strValue.split(',');
      arrValue.forEach(function(value) {
        options.forEach(function(opt) {
          if(opt.value.toString() === value){
            selection.push(opt);
          }
        });
      });
      return selection;
    }

    const onToggleValue = (e) => {
      const newVal = !Utils.parseBoolean(value);
      self.props.saveFieldValue(field.key, newVal, field.internalName);
    }

    const onRadioChange = (e) => {
      if(field.controlGroup === null)return;
      const radioBtnKeyValues = [];
      const { form } = this.state;
      const { page } = this.props.formPreviewer;
      const sections = _.orderBy(form.formSections, 'positionIndex', 'asc');
      const currentSectionFields = sections[page].fields;
      for (var i = 0; i < currentSectionFields.length; i++) {
        if(currentSectionFields[i].type === 'Radio Button' &&
          currentSectionFields[i].controlGroup === field.controlGroup){
          const radioField = currentSectionFields[i];
          const newVal = e.target.value === radioField.caption? 'true':'false';
          radioBtnKeyValues.push({key:radioField.key, value:newVal, internalName: radioField.internalName});
        }
      }
      self.props.saveRadioButtonValues(radioBtnKeyValues);
    }

    const onFieldBlur = () => {
      if(value === '')return;
      switch(type){
        case 'Phone':
          const phone = Utils.formatPhoneNumber(value);
          self.props.saveFieldValue(field.key, phone, field.internalName);
          break;
        case 'Currency':
          const currency = Utils.formatCurrency(value);
          self.props.saveFieldValue(field.key, currency, field.internalName);
          break;
        default:
          break;
      }
    }

    switch(type){
      case 'SectionDivider':
        return <div className='sectionDivider' ><label>{field.caption}</label></div>
      case 'Sub Section Divider':
        return <div className='subSectionDivider' ><label>{field.caption}</label></div>
      case 'Literal':
        return this.renderLiteral(field);
      case 'Paragraph':
        return <textarea value={value} onChange={onValueChange} placeholder={field.defaultValue}
                className='field' style={{resize: 'none'}} disabled={!this.props.canEditValues}/>
      case 'CheckBox':
        return (
          <div className="checkboxContainer">
            <input
              type="checkbox"
              checked={value}
              onChange={onToggleValue}
              disabled={!this.props.canEditValues}/>
            <label className='labelField' style={{fontWeight: '400', width: '100%'}}>
              {field.caption}
            </label>
          </div>
        );
      case 'Radio Button':
        value = Utils.parseBoolean(this.props.fieldValues[index].value)
        return (
          <div className="checkboxContainer">
            <input
              type="radio"
              checked={value}
              onChange={onRadioChange}
              disabled={!this.props.canEditValues}
              name={field.controlGroup}
              value={field.caption} />
            <label className='labelField' style={{fontWeight: '400', width: '100%'}}>
              {field.caption}
            </label>
          </div>
        );
      case 'File Upload':
        const fileValue = value.name || value;
        let fileLabel = "No file";
        let url = ''
        let buttonLabel = "Choose File";
        if (fileValue) {
          fileLabel = Utils.cleanUrl(fileValue);
          url = this.matchFileUrlToName(fileLabel)
          buttonLabel = "Replace";
        }


        return (
          <div className="fileInputContainer">
            <label className="fileContainer">
              <input
                id={"file-field-"+field.key}
                type="file"
                onChange={onFileChange}
                style={{height: 'auto', width: '100%'}}
                placeholder={field.defaultValue}
                disabled={!this.props.canEditValues} />
                <div className="fileButton">{buttonLabel}</div>
                {fileLabel}
                {
                  url && this.props.formLink.savedFormStatus !== 'Incomplete'
                    ? this.renderFileLink(url)
                    : ''
                }
            </label>
          </div>
        );
      case 'Email':
        return <input value={value} onChange={onValueChange} placeholder={field.defaultValue}
                type="email" className='field' disabled={!this.props.canEditValues} />
      case 'Date':
      case 'Financial statement date':
        return <input value={value} onChange={onValueChange} placeholder={field.defaultValue}
                type="date" className='field' disabled={!this.props.canEditValues} />
      case 'DropDown':
      case 'Source of financial statement':
      case 'Period':
      case 'Company Type':
        return (
          <select value={value} onChange={onValueChange} style={{backgroundColor: 'white'}}
           className='field' disabled={!this.props.canEditValues}>
            <option value="">{field.defaultValue}</option>
            {
              possibleValues.map((item, idx) => {return (
                <option key={idx} value={item.id || item.Id}>{item.name}</option>
              )})
            }
          </select>
        );
      case 'Multi Select':
        const multiSelectOptions = [];
        possibleValues.forEach((el) => {
          // add new option
          multiSelectOptions.push({
            label: el.name,
            value: el.id || el.Id
          })
        });
        const currentSelection = getMultiSelectSelection(multiSelectOptions, value);
        return (
          <Select
            value={currentSelection}
            onChange={onMultiSelectChange}
            options={multiSelectOptions}
            closeMenuOnSelect={false}
            isMulti={true}
            isDisabled={!this.props.canEditValues}
            className={'multi-select-field'}
            classNamePrefix={'multi-select'}
            placeholder={field.defaultValue}
           />
        );
      default:
        return <input value={value} onChange={onValueChange} placeholder={field.defaultValue}
                type="text" className='field' disabled={!this.props.canEditValues}
                onBlur={onFieldBlur} />

    }
  }

  renderSection (section, idx) {
    const field = this.getLastElementInSection(section);
    const y = field? this.getSize(field.rowPos * formGrid.columnSize):0;
    const height = field? this.getSize(field.rowsCount * formGrid.columnSize):0;
    const sectionHeight = y + height + this.getSize(sectionSpacing);
    // order the fields so the tab index works
    const fields = _.orderBy(section.fields, ['rowPos','columnPos']);

    return (
      <div style={{position:"relative", height:sectionHeight }}>
        {fields.map(this.renderField)}
      </div>
    );
  }

  renderField (field, idx) {
    const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
    const x = this.getSize(field.columnPos * formGrid.columnSize);
    const y = this.getSize(field.rowPos * formGrid.columnSize);
    let width = this.getSize(field.fieldLength * formGrid.columnSize);
    if (field.type === 'File Upload') {
      width = '400px';
    }
    const height = this.getSize(field.rowsCount * formGrid.columnSize);
    const fieldStyle = {
      top: 0,
      left: 0,
      //display: 'inline-block',
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      width,
      height,
    };
    const labelStyle = {
      minWidth: this.getSize(150),
      width: this.getSize(150),
      marginLeft: '5px',
      marginRight: '5px',
      whiteSpace: 'initial'
    };
    fieldStyle.transform = `translate(${x}px, ${y}px)`;

    // check incomplete
    let className = "";
    const index = _.findIndex(this.props.fieldValues, function(o) { return o.key === field.key; });
    if(index !== -1){ //&& this.state.showErrors){
      const value = this.props.fieldValues[index].value;
      if(!this.checkValueConstraints(field, value)) {
        className = "incomplete";
      }
      if (Utils.parseBoolean(field.isMandatory)) {
        if (type === "File Upload") {
          if(!this.hasValidFile("file-field-"+field.key, value)){
            className = "incomplete";
          }
        } else if (type === "CheckBox") {
          const { form } = this.state;
          const { page } = this.props.formPreviewer;
          const sections = _.orderBy(form.formSections, 'positionIndex', 'asc');
          if(!this.checkGroupHasValue(sections[page], field.controlGroup)){
            className = "incomplete";
          }
        } else if (value === undefined || value === null || value === "") {
          className = "incomplete";
        }
      }
    }

    if (field.isConditional && field.triggerFieldName) {
      const { form } = this.state;
      const { page } = this.props.formPreviewer;
      const triggered = this.checkTriggerValue(form.formSections[page], field.triggerFieldName);
      if(!triggered)return null;
    }
    return (
      <div key={idx} id={`field-${field.Id}`} style={fieldStyle} className={className} name={type} >
        {
          Definitions.hasLabel(type)?
          <label className='labelField' style={labelStyle}>{field.caption}</label>
          :null
        }
        {this.inputType(field)}
      </div>
    );
  }

  renderPageNumber(section, idx) {
    const { page } = this.props.formPreviewer;
    let className = 'page-number-btn';
    className += idx === page? ' selected-page':'';
    //className += idx > page? ' disabled-page':'';

    return (
      <button key={idx} id={'page-'+idx} className={className} >{idx+1}</button>
    );
  }

  renderLogo = (logoPath) => {
    return (
      <img className='logo formLogo2' src={logoPath} alt=''></img>
    )
  }

  render () {
    const
      { form }            = this.state,
      { page }            = this.props.formPreviewer,
      { logo }            = this.props.hcprofile.profileData,
      logoPath            = `data:image/jpeg;base64,${logo}`,
      sections            = _.orderBy(form.formSections, 'positionIndex', 'asc'),
      currentSection      = sections[page],
      btnText             = page < sections.length-1? "CONTINUE":"SAVE & SUBMIT",
      showContinueBtn     =  this.props.canSubmit || page < sections.length-1

    return (
      <div style={{minWidth: '600px'}} >
        <div className="headerContainer2">
          <div className="form-header-container item" id="form-page-top">
            <label className="form-title logoTitle">{form.name}</label>
          </div>
          <div className="formViewLogoWrapper item">
            { logo ? this.renderLogo(logoPath) : ''}
          </div>
        </div>
        <div className="form-header-container" >
          <label className="form-description">{form.description}</label>
        </div>
        <div className="formSheetContainer" id="formSheetContainer" >
          {this.renderSection(currentSection)}
        </div>
        <div className="form-footer-container">
          <div className="btn-col">
            {
              page > 0
                ? <button className="gray-btn" onClick={this.onPreviousPage}>BACK</button>
                : null
            }
            {
              this.props.canSubmit
                ? <button className="blue-btn" onClick={this.onSaveForLater}>SAVE</button>
                : null
            }
            {
              this.props.onCancel && this.props.fromTab
                ? <button className="blue-btn" onClick={this.onCancel}>CANCEL</button>
                : null
            }
          </div>
          <div className="page-row" id="pages-container">
            {sections.map(this.renderPageNumber)}
          </div>
          <div className="btn-row">
            {
              showContinueBtn
                ? <button className="continue-btn" onClick={this.onContinue}>{btnText}</button>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}

FormView.defaultProps = {
  canEditValues: true,
  canSubmit: true,
  fromTab: false,
};

FormView.propTypes = {
  form: PropTypes.object.isRequired,
  fieldValues: PropTypes.array.isRequired,
  saveFieldValue: PropTypes.func.isRequired,
  saveRadioButtonValues: PropTypes.func.isRequired,
  submitFormValues: PropTypes.func,
  saveForLater: PropTypes.func,
  canSubmit: PropTypes.bool,
  canEditValues: PropTypes.bool,
  fromTab: PropTypes.bool,
  onCancel: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
    hcprofile: state.HCProfile,
    formPreviewer: state.formPreviewer,
    local: state.localization,
    login: state.login,
    formLink: state.formLink,
    files: state.files
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(formActions, dispatch),
    hcProfileActions: bindActionCreators(hcProfileActions, dispatch),
    fileActions: bindActionCreators(fileActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormView));
