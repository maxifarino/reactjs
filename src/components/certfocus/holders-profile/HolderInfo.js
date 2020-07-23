import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as commonActions from './../../common/actions';
import TypeAheadAndSearch from '../../common/typeAheadAndSearch';
import Utils from '../../../lib/utils';
import { bindActionCreators } from 'redux';


class HolderInfo extends Component {

  render() {
    const { holderProfile, onEditProfile } = this.props;

    if (holderProfile.fetching) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner mb-4"></div>
        </div>
      );
    }

    if (holderProfile.errorHolderProfile) {
      return (
        <div className="d-flex justify-content-center">
          {holderProfile.errorHolderProfile}
        </div>
      );
    }

    const {
      name,
      address1,
      address2,
      contactName,
      city,
      state,
      country,
      phone,
      zipCode,
      logo,
      parentName,
      accountManagerName,
      intOfficeID,
      initialFee,
      initialCredits,
      addlFee,
      addlCredits,
    } = this.props.holderProfile.profileData;

    let {
      editBtn,
      parentHolderLabel,
      addressLabel,
      intOfficeLabel,
      contactNameLabel,
      contactPhoneLabel,
      accountManagerLabel,
      initialFeeAndCreditsLabel,
      addlFeeAndCreditsLabel,
    } = this.props.local.strings.holders.holdersProfile;

    return (
      <div>
        <div className="section-header my-3">
          <h2 className="profile-view-header-title">{name}</h2>
          <div className="d-flex">
            <div>
              <button onClick={onEditProfile} className="header-primary-button">{editBtn}</button>
            </div>

            <TypeAheadAndSearch />
          </div>
        </div>

        <div className="row mb-3">
          {logo &&
            <div className="col-sm-3 d-flex align-items-center justify-content-center">
              <img src={`data:image/jpeg;base64,${logo}`} alt="Logo" className="holder-logo" />
            </div>
          }
          <div className="col-sm mt-3">
            <table className="table table-hover profile-view-info-table">
              <tbody>
                <tr>
                  <td>{parentHolderLabel}:</td>
                  <td>{parentName}</td>
                </tr>
                <tr>
                  <td>{addressLabel}:</td>
                  <td>
                    {address1}<br />
                    {address2 || <span>&nbsp;</span>}<br />
                    {city}, {state}, {zipCode}<br />
                    {country}<br />
                  </td>
                </tr>
                <tr>
                  <td>{intOfficeLabel}:</td>
                  <td>{intOfficeID}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm mt-3">
            <table className="table table-hover profile-view-info-table">
              <tbody>
                <tr>
                  <td>{contactNameLabel}:</td>
                  <td>{contactName}</td>
                </tr>
                <tr>
                  <td>{contactPhoneLabel}:</td>
                  <td>{Utils.formatPhoneNumber(phone)}</td>
                </tr>
                <tr>
                  <td>{accountManagerLabel}:</td>
                  <td>{accountManagerName}</td>
                </tr>
                <tr>
                  <td>{initialFeeAndCreditsLabel}:</td>
                  <td>{initialFee ? `${Utils.formatCurrency(initialFee)} / ` : ''}{initialCredits ? Utils.formatCurrency(initialCredits) : ''}</td>
                </tr>
                <tr>
                  <td>{addlFeeAndCreditsLabel}:</td>
                  <td>{addlFee ? `${Utils.formatCurrency(addlFee)} / ` : ''}{addlCredits ? Utils.formatCurrency(addlCredits) : ''}</td>
                </tr>
                <tr>
                  <td>Total number of active projects:</td>
                  <td>{this.props.amountProjects}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    amountProjects: state.holdersProjects.totalAmountProjectArchive
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(HolderInfo);

