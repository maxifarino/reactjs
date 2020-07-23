import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Utils from '../../../../lib/utils'


import * as actions from '../../actions';

import './changeTier.css';

class ChangeTierModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tierId: ( props.currentTier && props.currentTier.charAt ) ? props.currentTier.charAt(0) : '',
      aggregateProjectExposure: props.aggregateProjectExposure,
      singleProjectLimit: props.singleProjectLimit,
      commentary: '',
      hcId: '',
      processing: false
    }

    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSave = this.onSave.bind(this);
    //this.deString
  };

  onChangeValue(key, e) {
    this.setState({ [key]: e});
  }

  onSave() {
    this.setState({ processing: true });
    const { 
      scId, 
      hcId 
    } = this.props;

    const {
      aggregateProjectExposure, 
      singleProjectLimit
    } = this.state
    
    const { tierId, commentary } = this.state;

    const APEnum = Utils.normalizeCurrency(aggregateProjectExposure)
    const SPLnum = Utils.normalizeCurrency(singleProjectLimit)

    const payload = {
      subcontractorId: scId,
      hcId,
      tierRatingId: tierId,
      aggregateProjectExposure: APEnum,
      singleProjectLimit: SPLnum,
      commentary
    };

    this.props.actions.changeTier(payload, (success) => {
      if (success) {
        this.props.successCallback(this.props.close);
      } else {
        this.setState({ processing: false });
      }
    });

  }

  render() {
    const {
      title,
      tierLabel,
      cancelBtn,
      saveBtn,
      singProjectLimit,
      aggProjectLimit,
      comment
    } = this.props.local.strings.scProfile.changeTierModal;

    let {
      tierId,
      aggregateProjectExposure,
      singleProjectLimit    
    } = this.state

    return (
      <div>
        <header>
          <div className="noteEditorTitle">{title}</div>
        </header>
        <form onSubmit={this.onSave} className="list-view-filter-form noteForm">
          

          <div className="change-status-content container-fluid filter-fields">
            <div className="row">
              <div className="col-md-12">
                {
                  this.state.processing
                    ? <div className="spinner-wrapper">
                        <div className="spinner"></div>
                      </div>
                    : <div className='fieldContainer'>
                        <div className="statusContainer" >
                          <div>
                            <label>{tierLabel}:</label>
                          </div>
                          <select
                            value={tierId}
                            onChange={(e) => {this.onChangeValue('tierId', e.target.value)}}>
                            {
                              this.props.sc.subcontratorTierRates.map((item, idx) => {return (
                                <option key={idx} value={item.Id}>{item.Name}</option>
                              )})
                            }
                          </select>
                        </div>
                        <div className="admin-form-field-wrapper">
                          <label htmlFor="title">{singProjectLimit}:
                          </label>
                          <input 
                            type="text"
                            value={singleProjectLimit}
                            onChange={(e) => {this.onChangeValue('singleProjectLimit', e.target.value)}}
                          />
                        </div>
                        <div className="admin-form-field-wrapper">
                          <label htmlFor="title">{aggProjectLimit}:
                          </label>
                          <input 
                            type="text"
                            value={aggregateProjectExposure}
                            onChange={(e) => {this.onChangeValue('aggregateProjectExposure', e.target.value)}}
                          />
                        </div>
                        <div className="admin-form-field-wrapper">
                          <label htmlFor="title">{comment}:
                          </label>
                          <input 
                            type="text"
                            onChange={(e) => {this.onChangeValue('commentary', e.target.value)}}
                          />
                        </div>

                      </div>
                }
              </div>
            </div>

            {
              !this.state.processing?
                <div className="text-right noteEditorButtons">
                  <a className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelBtn}</a>
                  <button className="bg-sky-blue-gradient bn action-button" type="submit">{saveBtn}</button>
                </div>
                :
                null
            }

          </div>
        </form>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    sc: state.sc,
    local: state.localization
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTierModal);
