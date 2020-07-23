import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Tabs from "react-draggable-tabs";
import * as formActions from './actions';
import * as previewerActions from '../formPreviewer/actions'
import * as commonActions from '../common/actions'
import * as hcProfileActions from '../hc-profile/actions'
import FormBuilderField from './fields';
import FieldDialog from './fields/fieldDialog';
import Utils from '../../lib/utils';
import './formBuilder.css';

const _ = require('lodash');
const Definitions = require('./definitions');
const Alerts = require ('../alerts');

const formGrid = Definitions.formGrid;
const BottomSpace = 250;
let TimeOut = null;
const DialogWidth = 300;
const DialogSpacing = 20;
const blankForm = {
  hiringClientId:"",
  name:"",
  description:"",
  needsUpdate: true,
  formSections: [{
    key: "0",
    title: "",
    needsUpdate: true,
    positionIndex: 0,
    fields: []
  }]
};

class FormBuilder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      form: null,
      currentSectionKey: null,
      fields: [],
      realContainerWidth: 0,
      Hide: false,
      scale: 0,
      SelectedField: null,
      redirectToPreviewer: false,
      hasFetchedHCid: false
    }

    props.commonActions.fetchUserHiringClients();
    props.previewerActions.fetchFormDropDownLists();
  }

  showFormBuilderAlerts (nextProps) {
    if(this.props.formBuilder.loading && !nextProps.formBuilder.loading){
      if(nextProps.formBuilder.error) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.formBuilder.error,
          'Accept',
          false,
          ()=>{}
        );
        this.props.actions.clearForm();
      } else if(nextProps.formBuilder.successMsg) {
        Alerts.showInformationAlert(
          'Success',
          nextProps.formBuilder.successMsg,
          'Accept',
          false,
          ()=>{}
        );
      }
    }

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.formBuilder.loading)return;
    this.showFormBuilderAlerts (nextProps);

    const propsForm = nextProps.formBuilder.form;
    const jsonForm = localStorage.getItem('formBuilderForm');
    const localForm = JSON.parse(jsonForm);

    let hcId, newForm

    if (propsForm) {
      this.formToState (propsForm);
      this.props.actions.clearForm();
    } else if (localForm && localForm.formSections) {
      this.formToState (localForm);
      hcId = localForm.hiringClientId
    } else {
      // create default blank form
      newForm = _.cloneDeep(blankForm);
      hcId = newForm.hiringClientId;
      this.formToState (newForm);
    }

    if ( ( (localForm && localForm.formSections) || newForm ) && !this.state.hasFetchedHCid ) {
      this.setState({
        hasFetchedHCid: true
      }, () => {
        this.props.hcProfileActions.fetchHCProfile(hcId)
      })
    }

  }

  // to parse from backend and local storage
  formToState = (form) => {
    let sections = form.formSections;
    sections = _.orderBy(sections, 'positionIndex', 'asc');
    // add keys to sections
    for (var i=0; i<sections.length; i++){
      sections[i].key = sections[i].key || i.toString();
    }
    // get current section id or assign one
    let currentSectionKey = this.state.currentSectionKey;
    if (!currentSectionKey) {
      currentSectionKey = sections[0].key;
    }
    // get the index of current section to get the fields
    const index = _.findIndex(sections, function(o) { return o.key === currentSectionKey; });
    const fields = this.getRenderableFields(sections[index].fields);

    this.setState({
      form,
      currentSectionKey,
      fields,
      Hide: true
    });

    this.refreshWithTimeout();
  }

  getRenderableFields = (fields) => {
    const renderables = [];
    for (var i=0; i<fields.length; i++) {
      const field = fields[i];
      const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
      const fieldDef = Definitions.getFieldDefinition(type);
      const newField = {
        caption: field.caption,
        referenceId: field.referenceId,
        possiblValues: field.possiblValues,
        internalName: field.internalName,
        controlGroup: field.controlGroup,
        urlTitle: field.urlTitle,
        urlTarget: field.urlTarget,
        key: field.key || i.toString(),
        id: field.id || field.Id,
        type,
        x: field.columnPos * formGrid.columnSize,
        y: field.rowPos * formGrid.columnSize,
        width: field.fieldLength * formGrid.columnSize,
        height: field.rowsCount * formGrid.columnSize,
        defaultValue: field.defaultValue,
        maxValue: field.maxValue,
        minValue: field.minValue,
        needsUpdate: field.needsUpdate,
        isMandatory: Utils.parseBoolean(field.isMandatory),
        hasBorder: Utils.parseBoolean(field.hasBorder),
        isConditional: Utils.parseBoolean(field.isConditional),
        triggerFieldName: field.triggerFieldName,
        minWidth: fieldDef.minWidth,
        minHeight: fieldDef.minHeight,
        maxWidth: fieldDef.maxWidth,
        maxHeight: fieldDef.maxHeight,
      };
      renderables.push(newField);
    }
    return renderables;
  }

  getPersistableFields = (fields) => {
    const persistables = [];
    for (var i=0; i<fields.length; i++) {
      const field = fields[i];
      const newField = {
        caption: field.caption,
        referenceId: field.referenceId,
        possiblValues: field.possiblValues,
        internalName: field.internalName,
        controlGroup: field.controlGroup,
        id: field.id,
        typeId: Definitions.getFieldTypeIdByName(field.type),
        defaultValue: field.defaultValue,
        columnPos: field.x / formGrid.columnSize,
        rowPos: field.y / formGrid.columnSize,
        fieldLength: field.width / formGrid.columnSize,
        rowsCount: field.height / formGrid.columnSize,
        maxValue: field.maxValue,
        minValue: field.minValue,
        isMandatory: field.isMandatory? 1:0,
        hasBorder: field.hasBorder? 1:0,
        isConditional: field.isConditional? 1:0,
        triggerFieldName: field.triggerFieldName,
        needsUpdate: field.needsUpdate,
        urlTitle: field.urlTitle,
        urlTarget: field.urlTarget,
      };
      persistables.push(newField);
    }
    return persistables;
  }

  componentDidUpdate = () => {
    //console.log("recalculating....")
    const container = document.getElementById('fieldsContainer');
    if(!container) return;

    const lastElement = this.getLastElement();
    if (lastElement) {
      const posY = this.getSize(lastElement.y + lastElement.height) + BottomSpace;
      if (container.offsetHeight < posY)
        container.style.height = posY + 'px';
    } else {
      container.style.height = '-webkit-fill-available';
    }
    // localStorage.setItem('fields', JSON.stringify(this.state.fields))
    const form = this.state.form;
    if(form && form.formSections && form.formSections.length) {
      localStorage.setItem('formBuilderForm', JSON.stringify(form));
    }
  }

  updateDimensions = () => {
    const container = document.getElementById('fieldsContainer');

    if (Math.abs(this.state.realContainerWidth - container.offsetWidth) > 0) {
      const scale = (container.offsetWidth)/formGrid.containerWidth;
      this.setState({scale: scale, realContainerWidth: container.offsetWidth});
      this.refreshWithTimeout();
    }
  }

  refreshWithTimeout = () => {
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

  scrollOptions = (position) => {
    const options = document.getElementById('options');
    //console.log(window.pageYOffset)

    if (window.pageYOffset > 100) {
      options.style.top = "-30px";
    } else {
      options.style.top = (65-window.pageYOffset)+"px";
    }
  }

  onMouseDown = (e) => {
    var container = document.getElementById('fieldDialog');
    // if the target of the click isn't the container nor a descendant of the container
    if (container && container !== e.target && !container.contains(e.target)){
      this.setState({SelectedField: null});
    }
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.scrollOptions);
    window.addEventListener("resize", this.updateDimensions);
    document.addEventListener('mousedown', this.onMouseDown);
    this.updateDimensions();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
    window.removeEventListener("scroll", this.scrollOptions);
    document.removeEventListener('mousedown', this.onMouseDown);
    if(TimeOut){
      clearTimeout(TimeOut);
      TimeOut = null;
    }
  }

  checkAllRadioButtonsGroups = (form) => {
    const sections = form.formSections;
    if (sections.length <= 1) return true;
    for (var i = 0; i < sections.length; i++) {
      const fields = sections[i].fields;
      for (var j = 0; j < fields.length; j++) {
        const field = fields[j];
        const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
        if (type === 'Radio Button') {
          if (!field.controlGroup || field.controlGroup === "") {
            return false;
          }
        }
      }
    }
    return true;
  }

  saveForm = () => {
    if(!this.checkAllRadioButtonsGroups(this.state.form)){
      Alerts.showInformationAlert(
        'Error',
        'One or more Radio Buttons need a group name',
        'Accept',
        false,
        ()=>{}
      );
      return;
    }

    if (this.state.form.hiringClientId && this.state.form.hiringClientId !== "") {
      this.props.actions.saveForm(this.state.form)
    } else {
      Alerts.showInformationAlert(
        'Error',
        'Please select a Hiring Client',
        'Accept',
        false,
        ()=>{}
      );
    }
  }

  resetForm = () => {
    const form = _.cloneDeep(blankForm);
    this.setState({form, currentSectionKey:"0", fields: [], SelectedField: null})
    localStorage.removeItem('formBuilderForm');
    //document.getElementById('formContainer').style.height = 'auto';
    document.getElementById('fieldsContainer').style.height = 'auto';
    window.scrollTo(0,0);
  }

  goToPreview = () => {
    this.props.previewerActions.assignForm(this.state.form);
    this.setState({redirectToPreviewer:true});
  }

  onHiringClientChange = (event) => {
    const form = this.state.form;
    let hcId = event.target.value;
    form.hiringClientId = hcId;
    form.needsUpdate = true;
    this.setState({form: form});
    this.props.hcProfileActions.fetchHCProfile(hcId)
  }

  onFormTitleChange = (event) => {
    const form = this.state.form;
    form.name = event.target.value;
    form.needsUpdate = true;
    this.setState({form: form});
  }

  onFormFeeChange = (event) => {
    const form = this.state.form;
    form.subcontractorFee = Utils.formatCurrency(event.target.value);
    form.needsUpdate = true;
    this.setState({form: form});
  }

  onFormDescriptionChange = (event) => {
    const form = this.state.form;
    form.description = event.target.value;
    form.needsUpdate = true;
    this.setState({form: form});
  }

  onSectionTitleChange = (event) => {
    const form = this.state.form;
    const currentSectionKey = this.state.currentSectionKey;
    const index = _.findIndex(form.formSections, function(o) { return o.key === currentSectionKey; });
    form.formSections[index].title = event.target.value;
    form.formSections[index].needsUpdate = true;
    this.setState({form: form});
  }

  getSize = (num) => {
    if(num === undefined || num == null){
      return null;
    }

    return num * this.state.scale;
  }

  /* Grid calculations */
  getLastElement = () => {
    let lastElement = null;
    let posY = 0;
    this.state.fields.forEach(function(field) {
      if(field.y + field.height >= posY){
        lastElement = field;
        posY = field.y + field.height;
      }
    });

    return lastElement;
  }

  getCollidingFieldsInArea = (x, y, width, height, key) => {
    const collisions = this.state.fields.filter((field, childIndex)=> {
      return (x < field.x + field.width && x + width > field.x &&
              y < field.y + field.height && y + height > field.y && field.key !== key);
    });

    return collisions;
  }

  checkFreeSpace = (element) => {
    if (element) {
      const collisions = this.getCollidingFieldsInArea(element.x+element.width, element.y, formGrid.containerWidth, element.height, element.key);

      if (collisions.length) {
        return false;
      }
    }

    return true;
  }

  calculateX = (width) => {
    const lastElement = this.getLastElement();
    const fieldSize = width;

    if (lastElement) {
      const spaceLeft = this.checkFreeSpace(lastElement);
      const xPos = lastElement.x + lastElement.width;

      if(spaceLeft){
        if(formGrid.containerWidth - xPos >= fieldSize + formGrid.spacing) {
          return xPos + formGrid.spacing;
        }
      }

      return 0;
    }

    return 0;
  }

  calculateY = (width)=> {
    const lastElement = this.getLastElement();
    const fieldSize = width;

    if (lastElement) {
      const spaceLeft = this.checkFreeSpace(lastElement);
      const xPos = lastElement.x + lastElement.width;

      if(spaceLeft){
        if(formGrid.containerWidth - xPos >= fieldSize + formGrid.spacing) {
          return lastElement.y;
        }
      }

      return lastElement.y + lastElement.height + formGrid.spacing;
    }

    return 0;
  }
  /* END Grid Calculations */

  /* Fields */
  getFieldName = (type) => {
    switch(type){
      case 'SectionDivider':
        return "";
      case 'Literal':
        return "";
      case 'Paragraph':
        return "textArea";
      case 'CheckBox':
        return "checkBox";
      case 'File Upload':
        return "fileUpload";
      case 'Email':
        return "email";
      case 'Date':
        return "date";
      default:
        return type;

    }
  }

  saveModifiedField = (modified) => {
    const form = this.state.form;
    const currentSectionKey = this.state.currentSectionKey;
    const index = _.findIndex(form.formSections, function(o) { return o.key === currentSectionKey; });

    const newList = this.state.fields.map(
      (field, index) => field.key === modified.key ?
        {
          ...field,
          x: modified.x,
          y: modified.y,
          width: modified.width,
          height: modified.height,
          defaultValue: modified.defaultValue,
          isMandatory: modified.isMandatory,
          isConditional: modified.isConditional,
          triggerFieldName: modified.triggerFieldName,
          internalName: modified.internalName,
          controlGroup: modified.controlGroup,
          referenceId: modified.referenceId,
          caption: modified.caption,
          urlTitle: modified.urlTitle,
          urlTarget: modified.urlTarget,
          needsUpdate: true
        } : field
    );

    form.formSections[index].fields = this.getPersistableFields(newList);

    this.setState({
      fields: newList,
      form
    });

    // fix to resize visible element on external resize
    const el = document.getElementById('draggable-field-'+modified.key);
    el.style.width = this.getSize(modified.width)+'px';
    el.style.height = this.getSize(modified.height)+'px';
  }

  onFieldClicked = (e, field) =>{
    this.setState({SelectedField: field});
  }

  addField = (type = 'text') => {
    const fieldDef = Definitions.getFieldDefinition(type);
    fieldDef.x = this.calculateX(fieldDef.width);
    fieldDef.y = this.calculateY(fieldDef.width);
    fieldDef.key = this.state.fields.length? + this.state.fields[this.state.fields.length-1].key+1:1;
    fieldDef.defaultValue = this.getLocalization(fieldDef.l18nHolder || fieldDef.type.replace(/\s+/g, ''));
    fieldDef.needsUpdate = true;
    fieldDef.isMandatory = fieldDef.isMandatory;
    fieldDef.isConditional = false;
    fieldDef.internalName = this.getFieldName(fieldDef.type);
    fieldDef.controlGroup = "";
    fieldDef.caption = this.getLocalization(fieldDef.l18nLabel || fieldDef.type.replace(/\s+/g, ''));

    const form = this.state.form;
    const currentSectionKey = this.state.currentSectionKey;
    const index = _.findIndex(form.formSections, function(o) { return o.key === currentSectionKey; });
    const newList = this.state.fields;
    newList.push(fieldDef);
    form.formSections[index].fields = this.getPersistableFields(newList);

    this.setState({
      fields: newList,
      form
    });

  }

  onDuplicateField = (field) =>{
    const fieldDef = Definitions.getFieldDefinition(field.type);
    fieldDef.width = field.width;
    fieldDef.height = field.height;
    fieldDef.x = this.calculateX(field.width);
    fieldDef.y = this.calculateY(field.width);
    fieldDef.key = this.state.fields.length? + this.state.fields[this.state.fields.length-1].key+1:1;
    fieldDef.defaultValue = field.defaultValue;
    fieldDef.needsUpdate = true;
    fieldDef.isMandatory = field.isMandatory;
    fieldDef.isConditional = field.isConditional;
    fieldDef.triggerFieldName = field.triggerFieldName;
    fieldDef.internalName = this.getFieldName(fieldDef.type);
    fieldDef.controlGroup = field.controlGroup;
    fieldDef.referenceId = field.referenceId;
    fieldDef.caption = field.caption;
    fieldDef.urlTitle = field.urlTitle;
    fieldDef.urlTarget = field.urlTarget;

    const form = this.state.form;
    const currentSectionKey = this.state.currentSectionKey;
    const index = _.findIndex(form.formSections, function(o) { return o.key === currentSectionKey; });
    const newList = this.state.fields;
    newList.push(fieldDef);
    form.formSections[index].fields = this.getPersistableFields(newList);

    this.setState({
      fields: newList,
      form
    });

  }

  onRemoveField = (field) =>{
    const self = this;
    const onRemoveConfirmation = (confirmed) => {

      const removeField = (setState) => {
        const form = self.state.form;
        const currentSectionKey = self.state.currentSectionKey;
        const index = _.findIndex(form.formSections, function(o) { return o.key === currentSectionKey; });
        const newList = self.state.fields.filter(e => e.key !== field.key);
        form.formSections[index].fields = self.getPersistableFields(newList);

        if (setState) {
          self.setState({
            SelectedField: null,
            fields: newList,
            form
          });
        }

        return {form, fields: newList};
      }


      if (confirmed) {
        if (field.id) {
          const { form } = removeField (false);
          self.props.actions.deleteField(field.id, form);
        } else {
          removeField (true);
        }
      }

    }

    const alertContent = {
      title: 'Delete Field',
      text: 'Are you sure you want to remove this field?',
      btn_no: 'Cancel',
      btn_yes: 'Accept'
    }
    Alerts.showActionConfirmation(alertContent, onRemoveConfirmation);
  }
  /* END Fields */

  /* SECTIONS */
  addSection = () => {
    // order by position index to get the last position
    const form = this.state.form;
    const sections = form.formSections;
    const lastIndex = sections.length;
    const newKey = Date.now().toString()
    const newSection = {
      key: newKey,
      title: "",
      needsUpdate: true,
      positionIndex: lastIndex,
      fields: []
    }
    sections.push(newSection);
    form.formSections = sections;
    this.setState({
      form,
      currentSectionKey: newKey,
      fields: []
    })
  }

  deleteSection = (removedIndex, removedID) => {
    const self = this;
    const form = self.state.form;
    let sections = form.formSections;
    // don't do anything if this is the last section
    if(sections.length <= 1)return;

    const onRemoveConfirmation = (confirmed) => {
      if (confirmed) {
        // order the sections using the position index to remove the right one
        sections = _.orderBy(sections, 'positionIndex', 'asc');
        const removedSection = sections[removedIndex];
        sections.splice(removedIndex, 1);
        // rebuild the positionIndex
        for (var i = 0; i < sections.length; i++) {
          sections[i].positionIndex = i;
          sections[i].needsUpdate = true;
        }
        // assign to the form
        form.formSections = sections;

        // check if deleted tab was the current tab
        let currentSectionKey = self.state.currentSectionKey;
        let fields = self.state.fields;
        if (removedSection.key === currentSectionKey) {
          // automatically select another tab if needed
          const newActive = removedIndex === 0 ? 0 : removedIndex - 1;
          currentSectionKey = sections[newActive].key;
          // and set the respective fields
          fields = self.getRenderableFields(sections[newActive].fields);
        }

        // if section had an ID then it was persisted
        if (removedSection.id) {
          // assign new selected section key if modified
          self.setState ({
            currentSectionKey,
            fields
          });
          self.props.actions.deleteSection(removedSection.id, form);
        } else {
          self.setState ({
            form,
            currentSectionKey,
            fields
          });
        }
      }

    }

    const alertContent = {
      title: 'Delete Section',
      text: 'Are you sure you want to remove this section? All the fields will also be deleted.',
      btn_no: 'Cancel',
      btn_yes: 'Accept'
    }
    Alerts.showActionConfirmation(alertContent, onRemoveConfirmation);

  }

  moveSection = (dragIndex, hoverIndex) => {
    const form = this.state.form;
    let sections = form.formSections;
    // order the sections using the position index to match tabs
    sections = _.orderBy(sections, 'positionIndex', 'asc');
    sections.splice(hoverIndex, 0, sections.splice(dragIndex, 1)[0]);
    form.formSections = sections;

    // rebuild the positionIndex
    for (var i = 0; i < sections.length; i++) {
      sections[i].positionIndex = i;
      sections[i].needsUpdate = true;
    }

    // select the moved section tab
    const selected = sections[hoverIndex];
    const fields = this.getRenderableFields(selected.fields);

    this.setState ({
      form,
      currentSectionKey: selected.key,
      fields
    });
    this.refreshWithTimeout();
  }

  selectSection = (selectedIndex, selectedID) => {
    const form = this.state.form;
    let sections = form.formSections;
    // order the sections using the position index to remove the right one
    sections = _.orderBy(sections, 'positionIndex', 'asc');
    const selected = sections[selectedIndex];
    const fields = this.getRenderableFields(selected.fields);

    this.setState ({
      currentSectionKey: selected.key,
      fields
    })

    this.refreshWithTimeout();
  }

  /* END Senctions */

  getDialogPosition = () => {
    const field = this.state.SelectedField;
    if(field){
      const fieldLeft = this.getSize(field.x);
      const fieldRight = this.getSize(field.x+field.width);
      let y = this.getSize(field.y);
      let left = true;
      let x = fieldLeft - DialogWidth - DialogSpacing;
      if (this.getSize(formGrid.containerWidth) - fieldRight > DialogWidth + DialogSpacing) {
        left = false;
        x = fieldRight + DialogSpacing;
      }

      // add offset for section divider
      if (field.type === 'SectionDivider'){
        y += this.getSize(20);
      } else if (field.type === 'Sub Section Divider'){
        y += this.getSize(15);
      }

      return {x, y, left};
    }
    return null;
  }

  getLocalization = (name) => {
    return this.props.local.strings.formBuilder[name] || '';
  }

  renderSectionTabs = () => {
    const form = this.state.form;
    let sections = [];
    let sectionsTabs = [];
    if(form) {
      sections = form.formSections || [];
    }
    sections = _.orderBy(sections, 'positionIndex', 'asc');

    for (var i = 0; i < sections.length; i++) {
      const isActive = sections[i].key === this.state.currentSectionKey;
      sectionsTabs.push (
        {
          id: i,
          active: isActive,
          content: sections[i].title || 'Page '+(i+1)
        }
      );
    }

    return (
      <Tabs
        tabs={sectionsTabs}
        selectTab={this.selectSection}
        moveTab={this.moveSection}
        closeTab={this.deleteSection} >
        <button className="addTabButton" onClick={this.addSection}>
          +
        </button>
      </Tabs>
    );

  }

  renderField = (field) => {
    return (
      <FormBuilderField
        key={field.key}
        field={field}
        containerSelector={".fieldsContainer"}
        columnSize={formGrid.columnSize}
        scale={this.state.scale}
        saveChanges={this.saveModifiedField}
        getCollidingFieldsInArea={this.getCollidingFieldsInArea}
        getScaledSize={this.getSize}
        onFieldClicked={this.onFieldClicked}
      />
    );
  }

  renderLogo = (logoPath) => {
    return (
      <img className='logo formLogo' src={logoPath} alt=""></img>
    )
  }

  render() {
    if (!this.props.common.checkingAuthorizations) {
      if(!this.props.common.formBuilderAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    if (this.state.redirectToPreviewer) {
      return <Redirect push to="/forms/preview" />;
    }

    const form = this.state.form;
    let dateCreated = '';
    let creator = '';
    let formTitle = '';
    let formFee = '';
    let formDescription = '';
    if (form) {
      dateCreated = new Date(form.dateCreated).toDateString() || '';
      creator = form.creator || '';
      formTitle = form.name || '';
      formDescription = form.description || '';
      formFee = form.subcontractorFee ? Utils.formatCurrency(form.subcontractorFee) : '';
    }
    const dPos = this.getDialogPosition();
    const {
      elements,
      //section,
      hiringClientLabel,
      formTitleLabel,
      formFeeLabel,
      formTitlePlaceholder,
      formDescriptionLabel,
      formFeeLabelPlaceholder,
      formDescriptionPlaceholder,
      formCreated,
      formOwner,
      previewForm,
      saveForm,
      clearForm,
    } = this.props.local.strings.formBuilder;

    let
      { logo } = this.props.hcprofile.profileData,
      logoPath = `data:image/jpeg;base64,${logo}`

    return (
      <div className="builder">
        <div className="options" id="options">
          <div className="optionTabs">
            <button className="tab" style={{width:'100%'}}>{elements}</button>
          </div>
          <div className="optionList">
            <button className="list-button" onClick={()=> this.addField('SectionDivider')}>{this.getLocalization('sectionDivider')}</button>
            <button className="list-button" onClick={()=> this.addField('Sub Section Divider')}>{this.getLocalization('subSectionDivider')}</button>
            <button className="list-button" onClick={()=> this.addField('Literal')}>{this.getLocalization('Literal')}</button>
            <button className="list-button" onClick={()=> this.addField('Text')}>{this.getLocalization('textbox')}</button>
            <button className="list-button" onClick={()=> this.addField('Radio Button')}>{this.getLocalization('radioButton')}</button>
            <button className="list-button icon-checkbox" onClick={()=> this.addField('CheckBox')}>{this.getLocalization('checkbox')}</button>
            <button className="list-button icon-date" onClick={()=> this.addField('Date')}>{this.getLocalization('datePicker')}</button>
            <button className="list-button icon-if_upload_103738" onClick={()=> this.addField('File Upload')}>{this.getLocalization('fileUpload')}</button>
            <button className="list-button" onClick={()=> this.addField('Paragraph')}>{this.getLocalization('paragraph')}</button>
            <button className="list-button" onClick={()=> this.addField('Email')}>{this.getLocalization('email')}</button>
            <button className="list-button" onClick={()=> this.addField('Phone')}>{this.getLocalization('phone')}</button>
            <button className="list-button" onClick={()=> this.addField('Currency')}>{this.getLocalization('currency')}</button>
            <button className="list-button" onClick={()=> this.addField('DropDown')}>{this.getLocalization('dropDown')}</button>
            <button className="list-button" onClick={()=> this.addField('Multi Select')}>{this.getLocalization('multiSelect')}</button>
            <button className="list-button" onClick={()=> this.addField('Source of financial statement')}>{this.getLocalization('Sourceoffinancialstatement')}</button>
            <button className="list-button" onClick={()=> this.addField('Financial statement date')}>{this.getLocalization('Financialstatementdate')}</button>
            <button className="list-button" onClick={()=> this.addField('Period')}>{this.getLocalization('Period')}</button>
            <button className="list-button" onClick={()=> this.addField('Company Type')}>{this.getLocalization('CompanyType')}</button>
          </div>
        </div>
        <div className="form">
          <div className="formHeader">
            <div className="headerContainer">
              <div className="item fieldContainer">
                <span className="italic item2">{hiringClientLabel}: </span>
                <select className="item2" value={form? form.hiringClientId:""} onChange={this.onHiringClientChange}>
                  <option value="">-- Select a Hiring Client --</option>
                  {
                    this.props.common.userHiringClients.map((item, idx) => {return (
                      <option key={idx} value={item.id}>{item.name}</option>
                    )})
                  }
                </select>

                <span className="italic item2">{formTitleLabel}: </span>
                <input type="text" value={formTitle} onChange={this.onFormTitleChange} placeholder={formTitlePlaceholder} className='formTitle item2'/>

                <span className="italic item2">{formFeeLabel}: </span>
                <input type="text" value={formFee} onChange={this.onFormFeeChange} placeholder={formFeeLabelPlaceholder} className='formTitle item2'/>
              </div>
              <div className="logo-wrapper formLogoWrapper item">
                { logo ? this.renderLogo(logoPath) : ''}
              </div>
            </div>
            <span className="italic">{formDescriptionLabel}: </span>
            <textarea value={formDescription} onChange={this.onFormDescriptionChange} placeholder={formDescriptionPlaceholder} className='formDescription'/>
          </div>
          {this.renderSectionTabs()}
          <div className="formContainer" id="formContainer">
            <div className="fieldsContainer" id="fieldsContainer" >
              {this.state.Hide? null:this.state.fields.map(this.renderField)}
              {
                this.state.SelectedField &&
                <FieldDialog
                  field={this.state.SelectedField}
                  x={dPos.x}
                  y={dPos.y}
                  left={dPos.left}
                  width={DialogWidth}
                  onDuplicate={this.onDuplicateField}
                  onRemove={this.onRemoveField}
                  saveChanges={this.saveModifiedField}
                  getCollidingFieldsInArea={this.getCollidingFieldsInArea}
                  containerWidth={formGrid.containerWidth}
                  columnSize={formGrid.columnSize}
                  dropDownLists={this.props.formPreviewer.formFieldsLists}
                />
              }
            </div>
          </div>
          <div className="formFooter">
            <div className="column">
              {
                dateCreated === ''? null:
                <div className="formRow">
                  <span className="text">{formCreated}: </span> <span className="text2"> {dateCreated}</span>
                </div>
              }
              {
                creator === ''? null:
                <div className="formRow">
                  <span className="text">{formOwner}: </span> <span className="text2"> {creator}</span>
                </div>
              }
            </div>
            <div className="formRow">
              <button className="footerBtn" onClick={()=> this.goToPreview()} >{previewForm}</button>
              <button className="footerBtn" onClick={()=> this.saveForm()} >{saveForm}</button>
              <button className="footerBtn" onClick={()=> this.resetForm()}>{clearForm}</button>
            </div>
          </div>
        </div>
        {this.props.formBuilder.loading?
          <div style={{position:'fixed', top:'0', left:'0', backgroundColor:'#80808087', width:'100%', height:'100%'}}>
            <div className="spinner-wrapper">
              <div className="spinner"></div>
            </div>
          </div>:null}
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    hcprofile: state.HCProfile,
    common: state.common,
    formBuilder: state.formBuilder,
    formPreviewer: state.formPreviewer,
    local: state.localization,
    login: state.login
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(formActions, dispatch),
    hcProfileActions: bindActionCreators(hcProfileActions, dispatch),
    previewerActions: bindActionCreators(previewerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormBuilder));
