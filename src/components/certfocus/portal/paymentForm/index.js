import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import Utils from '../../../../lib/utils';

import validate from './validation';

class PaymentForm extends Component {
  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      options,
      conditional,
      show,
      type,
    } = element;

    const style = {};

    if (conditional && !show) {
      style.display = 'none';
    }

    if (Array.isArray(element)) {
      const renderedElement = element.map((item) => {
        return (
          <div key={item.name} className="col-md-6 col-sm-12">
            {item.options ?
              <div className="select-wrapper">
                <Field
                  name={item.name}
                  component={renderSelect}
                  options={item.options}
                />
              </div>
              :
              <Field
                name={item.name}
                type={item.type ? item.type : 'text'}
                placeholder={item.ph}
                component={renderField}
              />
            }
          </div>
        );
      });

      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${element[0].label}:`}</label>
          <div className="row">
            {renderedElement}
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {options ?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options}
            />
          </div>
          :
          <Field
            name={name}
            type={type ? type : 'text'}
            placeholder={ph}
            component={renderField}
          />
        }
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      portal,
    } = this.props;

    const {
      nameLabel,
      cardNumberLabel,
      expirationMonthLabel,
      expirationYearLabel,
      expirationDateLabel,
      securityCodeLabel,
      payBtn,
    } = this.props.local.strings.portal.paymentForm;

    const date = new Date();
    const year = date.getFullYear();
    let yearsList = [];

    for (let i = year; i <= year + 15; i++) {
      yearsList.push({
        year: i,
      });
    }

    const monthsOptions = [
      { label: `-- ${expirationMonthLabel} --`, value: '' },
      { label: 'January', value: 1 }, { label: 'February', value: 2 }, { label: 'March', value: 3 },
      { label: 'April', value: 4 }, {label:  'May', value: 5 }, { label: 'June', value: 6 },
      { label: 'July', value: 7 }, { label: 'August', value: 8 }, { label: 'September', value: 9 },
      { label: 'October', value: 10 }, { label: 'November', value: 11 }, { label: 'December', value: 12 },
    ];

    const yearsOptions = Utils.getOptionsList(`-- ${expirationYearLabel} --`, yearsList, 'year', 'year', 'year');

    const fields = [
      { name: 'name', label: nameLabel, ph: `-- ${nameLabel} --` },
      { name: 'cardNumber', label: cardNumberLabel, ph: `-- ${cardNumberLabel} --`, type: 'number' },
      [
        { name: 'expirationMonth', label: expirationDateLabel, options: monthsOptions },
        { name: 'expirationYear', options: yearsOptions },
      ],
      { name: 'securityCode', label: securityCodeLabel, ph: `-- ${securityCodeLabel} --`, type: 'number' },
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form wiz-form pt-3"
      >
        <div className="container-fluid">
          <div className="card mb-3">
            <div className="card-block">
              Text explaining the charges and the amount of the charges.
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12 offset-md-3">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        <div className="text-danger text-center">{portal.error}</div>
        <div className="wiz-buttons pr-0">
          <button type="submit" className="bn bg-blue-gradient">{payBtn}</button>
        </div>
      </form>
    );
  }
}

PaymentForm = reduxForm({
  form: 'PortalURLPaymentForm',
  validate,
})(PaymentForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
    portal: state.portal,
  };
};

export default connect(mapStateToProps)(PaymentForm);
