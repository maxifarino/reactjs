/*eslint no-loop-func: 0*/
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as formActions from './actions';
import FormView from './formView';
import './previewer.css';

const formToPdf = require('./formToPdf/formToPdf');
const formPreviewerUtils = require('./utils');
const _ = require('lodash');

class FormPreviewer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      form: null,
      fieldValues: []
    }

    this.saveFieldValue = this.saveFieldValue.bind(this);
    this.saveRadioButtonValues = this.saveRadioButtonValues.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const propsForm = nextProps.formPreviewer.form;
    const jsonForm = localStorage.getItem('formBuilderForm');
    const localForm = JSON.parse(jsonForm);
    let form = null;

    if (propsForm) {
      form = propsForm;
      this.props.actions.clearForm();
    } else if (localForm && localForm.formSections) {
      form = localForm;
    } else {
      return;
    }

    const fieldValues = formPreviewerUtils.getFormFieldValues(form);
    this.setState({form, fieldValues});
  }

  saveFieldValue (key, value, internalName) {
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

  backToBuilder () {
    this.props.history.push('/forms/new-form');
  }

  viewPDF () {
    if(!this.state.form)return;

    formToPdf.setPreviewer(this.props.formPreviewer);
    const doc = formToPdf.getPdfDoc(this.state.form);
    var string = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }

  downloadPDF () {
    if(!this.state.form)return;

    const doc = formToPdf.getPdfDoc(this.state.form);
    doc.save(this.state.form.name + '_' + Date.now() + '.pdf');
  }

  render () {
    if (!this.props.common.checkingAuthorizations) {
      if(!this.props.common.formBuilderAuth) {
        return <Redirect push to="/dashboard" />;
      }
    }

    return (
      <div style={{height:'100%'}}>
        <div className="pdf-buttons-container">
          <button className="pdf-button" onClick={()=> this.backToBuilder()}>Back to Builder</button>
          <button className="pdf-button" onClick={()=> this.viewPDF()}>View PDF</button>
          <button className="pdf-button" onClick={()=> this.downloadPDF()}>Download PDF</button>
        </div>
        <div style={{ padding: '30px 60px', margin: '30px 100px', borderStyle: 'solid', overflowX:'scroll'}}>
          {
            this.state.form ?
              <FormView
                form={this.state.form}
                fieldValues={this.state.fieldValues}
                saveFieldValue={this.saveFieldValue}
                saveRadioButtonValues={this.saveRadioButtonValues}
                canEditValues={true}
                canSubmit={false}
              />
              :null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    formPreviewer: state.formPreviewer,
    local: state.localization,
    login: state.login,
    common: state.common
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(formActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormPreviewer));
