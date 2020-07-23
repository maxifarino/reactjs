import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Utils from '../../../../../../../lib/utils';
import * as coverageActions from '../../actions';

import './AgencyModal.css';

class AgencyModal extends Component {
  componentDidMount() {
    this.props.coverageActions.fetchAgency(this.props.agencyId);
  }

  componentWillUnmount() {
    this.props.coverageActions.setAgencyError('');
    this.props.coverageActions.setAgency({});
  }

  render() {
    const {
      title,
      nameLabel,
      addressLabel,
      mainPhoneLabel,
      mainEmailLabel,
      faxNumberLabel,
      closeBtn,
    } = this.props.local.strings.coverages.agencyModal;

    const {
      Name,
      address,
      address2,
      City,
      State,
      ZipCode,
      countryName,
      MainPhone, 
      FaxNumber,
      MainEmail,
    } = this.props.coverages.agency;

    const { agencyFetching, agencyError } = this.props.coverages

    if (agencyFetching || agencyError) {
      return (
        agencyError ? (
          <div className="text-danger" >{agencyError}</div>
        ) : (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        )
      );
    }

    return (
      <div className="add-item-view add-entity-form-small insured-coverages-agency-modal">
        <div className="add-item-header ml-0">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <div className="entity-info-form">
              <div className="row">
                <div className="col-md-6">
                  <table className="table table-hover agency-view-info-table">
                    <tbody>
                      <tr>
                        <td>{nameLabel}:</td>
                        <td>{Name}</td>
                      </tr>
                      <tr>
                        <td>{addressLabel}:</td>
                        <td>
                          <span>{City}, {State}, {ZipCode}</span>
                          {countryName || <span>&nbsp;</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <table className="table table-hover agency-view-info-table">
                    <tbody>
                      <tr>
                        <td>{mainPhoneLabel}:</td>
                        <td>{MainPhone ? Utils.formatPhoneNumber(MainPhone) : ''}</td>
                      </tr>
                      <tr>
                        <td>{faxNumberLabel}:</td>
                        <td>{FaxNumber}</td>
                      </tr>
                      <tr>
                        <td>{mainEmailLabel}:</td>
                        <td>{MainEmail}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="add-item-bn">
                <button className="bn bn-small bg-green-dark-gradient create-item-bn" onClick={() => this.props.close(false)}>
                  {closeBtn}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    coverages: state.coverages,
    local: state.localization,
    common: state.common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    coverageActions: bindActionCreators(coverageActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AgencyModal);
