import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Utils from '../../../../lib/utils';

import '../addEntityModal.css';

import * as projectActions from '../../projects/actions';
import * as commonActions from '../../../common/actions';
import * as reqSetsActions from '../../requirement-sets/actions';
import { Field, reduxForm } from 'redux-form';
import renderTypeAhead from '../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../customInputs/renderRemovable';
import renderField from '../../../customInputs/renderField';
import renderSelect from  '../../../customInputs/renderSelect';
import  { isEmpty } from 'lodash';


class AddReqSetFromProyectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: props.project?props.project.id:null
		};
		props.reqSetsActions.fetchRequirementSetsPossibleValues({ holderId: props.project.holderId, archived: 0 });
  };

  componentDidMount() {
    const { common, commonActions } = this.props;
    if(common.countries.length <= 0) commonActions.fetchCountries();
    if(common.usStates.length <= 0) commonActions.fetchUSStates();
  }

  send = (values, sendProjectReqSet, id, setLoading, close) => {
		setLoading(true);
		const reqSetPayload = {
			projectId: id,
			requirementSetId: values.reqSet,
		};
		sendProjectReqSet(reqSetPayload, success => {
			if (isEmpty(success)) {
				setLoading(false);
				close();
			};
		});
  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
	}
	
	renderFormField = (element, idx) => {    
    const { type, name, label, ph, options, conditional, show } = element;
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (fieldType === 'typeAhead') {
      const { fetching, results, error, handleSearch, onSelect } = element;

      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            resetOnClick
            name={name}
            placeholder={ph}
            fetching={fetching}
            results={results}
            handleSearch={handleSearch}
            fetchError={error}
            component={renderTypeAhead}
            onSelect={onSelect}
          />
        </div>
      );
    } else if (fieldType === 'removable') {
      const { valueText, disabled, onRemove } = element;
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
                defaultValue={name == 'CFCountryId' ? '1' : null} />
            </div>
            :
            <Field
              name={name}
              type={fieldType}
              placeholder={ph}
              component={renderField} />
        }
      </div>
    );
  }

  render() {
		const { 
			holderRequirementSets: { possibleValuesFetching, possibleValuesResults },
			close,
			handleSubmit,
			projectActions: { sendProjectReqSet },
			project: { id },
			commonActions: { setLoading },
		} = this.props;
		const reqSetOptions = Utils.getOptionsList('--Select Req. Set.--', possibleValuesResults || [], 'Name', 'Id', 'Name');
		const leftFields = [
      { name: 'reqSet', label: 'Select Req Set', options: reqSetOptions },
		]
    return (
      <div className="new-entity-form wiz-wrapper">
				<form onSubmit={handleSubmit(values => this.send(values, sendProjectReqSet, id, setLoading, close))} className="entity-info-form wiz-form">
					<header className="small">
						<h2 className="modal-wiz-title">
							{'Select Requirement Set'}
						</h2>
					</header>
					<div className="steps-bodies add-item-view">
						<div className='step-body add-item-form-subsection active'>
							{possibleValuesFetching ?
								(<div className="spinner-wrapper">
									<div className="spinner" />
								</div>)  :
								leftFields.map(this.renderFormField)}
						</div>
					</div>
					<div className="wiz-buttons">
						<div>
							<a className="wiz-cancel-button" onClick={close}>{'Cancel'}</a>
							<button type="submit" className="wiz-continue-btn bg-sky-blue-gradient bn">{'Add Req Set'}</button>
						</div>
					</div>
				</form>
      </div>
    );
  }
};

AddReqSetFromProyectModal = reduxForm({
  form: 'AddReqSetFromProyectModalForm',
  // validate,
  //asyncValidate,
  //asyncBlurFields: ['projectName'],
})(AddReqSetFromProyectModal);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
		common: state.common,
		holderRequirementSets: state.holderRequirementSets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    reqSetsActions: bindActionCreators(reqSetsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddReqSetFromProyectModal);
