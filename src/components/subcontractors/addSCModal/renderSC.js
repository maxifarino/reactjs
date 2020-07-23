import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect'

class RenderSC extends React.Component {

  render() {
    const { error, submitFailed } = this.props.meta;
    const {
      listOfSCFromParsedFile,
      listOfSCManually,
      forms
    } = this.props.sc;

    const {
      renderSC
    } = this.props.local.strings.subcontractors;

    const {
      labelCompanyName,
      labelContactName,
      labelMail,
      labelPhone,
      labelSourceSystemId,
      labelRequestorName,
      labelRequestorEmail
    } = renderSC;

    const fieldsMetaData = [
      {
        name: 'companyName',
        error: 'companyNameError',
        label: labelCompanyName,
      },
      {
        name: 'contactName',
        error: 'contactNameError',
        label: labelContactName,
      },
      {
        name: 'mail',
        error: 'mailError',
        label: labelMail,
      },
      {
        name: 'phone',
        error: 'phoneError',
        label: labelPhone,
      },
      {
        name: 'sourceSystemId',
        error: 'sourceSystemError',
        label: labelSourceSystemId,
      },
      {
        name: 'requestorName',
        error: 'requestorNameError',
        label: labelRequestorName,
      },
      {
        name: 'requestorEmail',
        error: 'requestorEmailError',
        label: labelRequestorEmail,
      }
    ];

    // const isFileUpload = this.props.isFileUpload

    // if (isFileUpload) {
    //   fieldsMetaData.push({
    //     name: 'ShortName',
    //     error: 'ShortNameError',
    //     label: 'SC Form Name'
    //   })
    // }

    const renderXbutton = (index) => {
      return (
        <div className="remove-row-button">
          <label>
          </label>
          <button
            type="button"
            className="remove-contract-button btn btn-danger"
            title="remove"
            onClick={() => this.props.fields.remove(index)}>
            X
          </button>
        </div>
      )
    }

    return (
      <ul className="sc-fields-list">

        {this.props.fields.map((sc, index) => (
          <li id="list" key={index}>
            {
              fieldsMetaData.map((fieldItem, idx) => (
                <div className='sc-row-field-wrapper flush' key={idx}>
                  <label htmlFor={`${sc}.${fieldItem.name}`}>
                    {fieldItem.label}
                  </label>
                  <Field
                    name={`${sc}.${fieldItem.name}`}
                    type="text"
                    component={renderField}
                  />
                  {
                    this.props.allowedToAddRows ?
                      (
                        listOfSCManually.length && listOfSCManually[index] ?
                          <span className='error-sc-field'>
                            { listOfSCManually[index][fieldItem.error] }
                          </span> :
                          null
                      ) :
                      <span className='error-sc-field'>
                        { listOfSCFromParsedFile[index][fieldItem.error] }
                      </span>
                  }
                </div>
              ))
            }
            <div className="sc-row-field-wrapper flush">
              <div className='formItem'>
                <label htmlFor={`${sc}.formId`}>
                  {'SC Form Name'}
                </label>
                <Field
                  name={`${sc}.formId`}
                  className="formSelect"
                  options={forms}
                  type="select"
                  component={renderSelect} 
                />
              </div>
              { renderXbutton(index) }
            </div>
              
            
            { this.props.fields && this.props.fields.length && this.props.fields.length > 1
              ? <hr className='dividingHR' />
              : null
            }
          </li>
        ))}

        {
          this.props.allowedToAddRows ?
          <li className="add-new-sc-row-wrapper">
            <button
              type="button"
              onClick={() => this.props.fields.push({})}
              className="add-new-sc-row bn">
              Add a new line
            </button>
            {submitFailed && error && <span>{error}</span>}
          </li> : null
        }

      </ul>
    );
  }

};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    sc: state.sc
  };
};

export default connect(mapStateToProps)(RenderSC);
