import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, ButtonGroup } from 'react-bootstrap';
import * as commonActions from '../../common/actions';
import TypeAheadAndSearch from '../../common/typeAheadAndSearch';
import Utils from '../../../lib/utils';

import * as insuredViewActions from './actions';
import RolAccess from './../../common/rolAccess';

class InsuredInfo extends Component {

  setTab = (index, defaultValue) => {
    switch (index) {
      case 2:
        this.props.selectTab(index, true, false, null);
        break;
      case 3:
        this.props.selectTab(index, false, true, defaultValue);
        break;
      default:
    }
  }

  componentDidMount() {
    if (this.props.insuredDetails.insuredData) {
      this.setBreadcrumb();
    }
  }

  renderIconAddNewTask(value) {
    let component = (
      <span onClick={() => this.setTab(value)} className="linear-icon-circle-checkmark" />
    );
    return component;
  }

  renderIconAddNewNoteFile(value) {
    let component = (
      <span onClick={() => this.setTab(value, "1")} className="linear-icon-file" />
    );
    return component;
  }

  renderIconAddNewNotePhone(value) {
    let component = (
      <span onClick={() => this.setTab(value, "2")} className="linear-icon-phone" />
    );
    return component;
  }

  setBreadcrumb = () => {
    if (this.props.insuredDetails.insuredData.HolderId && this.props.insuredDetails.insuredData.HolderName) {
      this.props.commonActions.setBreadcrumbItems([
        {
          pathName: this.props.holderSelected.name,
          hrefName: '/certfocus/holders/' + this.props.holderSelected.id
        },
        {
          pathName: this.props.insuredDetails.insuredData.InsuredName,
          hrefName: window.location.pathname
        }
      ]);
    } else {
      this.props.commonActions.setBreadcrumbItems([
        {
          pathName: this.props.insuredDetails.insuredData.InsuredName,
          hrefName: window.location.pathname
        }
      ]);
    }
  }

  render() {
    const { insuredDetails, deleteTag, openModal } = this.props;

    if (insuredDetails.fetching) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner mb-4" />
        </div>
      );
    }

    if (insuredDetails.errorInsured) {
      return (
        <div className="d-flex justify-content-center">
          {insuredDetails.errorInsured}
        </div>
      );
    }

    const {
      editBtn,
      legalNameLabel,
      addressLabel,
      contactNameLabel,
      contactPhoneLabel,
      contactFaxLabel,
      contactEmailLabel,
      taxIdLabel,
    } = this.props.local.strings.insured.insuredView;

    const {
      InsuredName,
      LegalName,
      Address,
      Address2,
      City,
      State,
      PostalCode,
      CountryID,
      ContactName,
      ContactPhone,
      ContactFax,
      ContactEmail,
      TaxID,
      ComplianceStatus,
    } = insuredDetails.insuredData;

    const { fetchingTags } = insuredDetails;

    const tagsButtons = insuredDetails.tags.assignedTags ? insuredDetails.tags.assignedTags.data.map((tag) => {
      const isLoading = fetchingTags.find(fetchingTag => fetchingTag === tag.Id);

      return (
        <ButtonGroup className="mr-1 mb-1" key={tag.Id}>
          <Button bsStyle="primary">{tag.Name}</Button>
          <Button
            bsStyle="primary"
            className="d-flex tag-btn"
            onClick={isLoading ? null : () => deleteTag(tag)}
          >
            {isLoading ?
              (
                <div className="spinner-wrapper mt-0 d-flex">
                  <div className="spinner" />
                </div>
              ) :
              <span className="linear-icon-cross" />
            }
          </Button>
        </ButtonGroup>
      );
    }) : [];

    const country = this.props.common.countries.find(country => country.id === CountryID);

    return (
      <div>
        <div className="section-header my-3">
          <h2 className="profile-view-info-header-title">{InsuredName}</h2>
          <div className="d-flex">
            <TypeAheadAndSearch />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm mt-2">
            <div className="main-information">
              <div className="main-information-table">
                <table className="table table-hover profile-view-info-table">
                  <tbody>
                    <tr>
                      <td>{legalNameLabel}:</td>
                      <td>{LegalName}</td>
                    </tr>
                    <tr>
                      <td>{addressLabel}:</td>
                      <td>
                        {Address || <span>&nbsp;</span>}<br />
                        {Address2 || <span>&nbsp;</span>}<br />
                        <span>{City && `${City},`} {State && `${State},`} {PostalCode}</span><br />
                        {(country ? country.name : '') || <span>&nbsp;</span>}<br />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="main-information-tags">
                <div className="tags-group">
                  {tagsButtons}
                  <Button bsStyle="primary" className="mr-1 mb-1 tag-btn" title="Add Tag" onClick={() => openModal('tags')}>
                    <span className="icon-add" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm mt-2">
            <div className="compliance-status">
              Compliance Status: {ComplianceStatus}
            </div>
            <div className="row">
              <div className="col-sm-8">
                <table className="table table-hover profile-view-info-table">
                  <tbody>
                    <tr>
                      <td>{contactNameLabel}:</td>
                      <td>{ContactName}</td>
                    </tr>
                    <tr>
                      <td>{contactPhoneLabel}:</td>
                      <td>{Utils.formatPhoneNumber(ContactPhone)}</td>
                    </tr>
                    <tr>
                      <td>{contactFaxLabel}:</td>
                      <td>{ContactFax}</td>
                    </tr>
                    <tr>
                      <td>{contactEmailLabel}:</td>
                      <td>{ContactEmail}</td>
                    </tr>
                    <tr>
                      <td>{taxIdLabel}:</td>
                      <td>{TaxID}</td>
                    </tr>
                    <tr>
                      <td> Total number of active  projects:</td>
                      <td>{this.props.amountProjectInsureds}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-sm insured-actions">
                <button onClick={() => openModal('edit')} className="header-primary-button">{editBtn}</button>
                <div className="insured-actions-icons">
                  <RolAccess
                    masterTab="tasks"
                    sectionTab="create_tasks"
                    component={() => this.renderIconAddNewTask(2)}>
                  </RolAccess>

                  <RolAccess
                    masterTab="notes"
                    sectionTab="create_notes"
                    component={() => this.renderIconAddNewNoteFile(2)}>
                  </RolAccess>

                  <RolAccess
                    masterTab="notes"
                    sectionTab="create_notes"
                    component={() => this.renderIconAddNewNotePhone(2)}>
                  </RolAccess>


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
    amountProjectInsureds: state.projectInsureds.totalProjectNonArchived,
    holderSelected: state.insuredDetails.holderSelected
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(insuredViewActions, dispatch),
    selectTab: (tab, showTask, showNote, defaultValueContactType) => dispatch(insuredViewActions.setTagTab({ tab: tab, showModalAddTask: showTask, showModalAddNote: showNote, defaultValueContactType: defaultValueContactType })),
    hideAddTask: () => dispatch(insuredViewActions.setHideAddTask()),
    commonActions: bindActionCreators(commonActions, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InsuredInfo);
