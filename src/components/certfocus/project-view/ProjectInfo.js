import React, { Component } from 'react';
import { connect } from 'react-redux';

import TypeAheadAndSearch from '../../common/typeAheadAndSearch';
import Utils from '../../../lib/utils';

class ProjectInfo extends Component {
  render() {
    const {
      onEditProject,
      setToMyList,
      renderCustomFields,
      projectDetails,
      login,
    } = this.props;

    if (projectDetails.fetching || !login.profile.Id) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner mb-4" />
        </div>
      );
    }

    if (projectDetails.errorProject) {
      return (
        <div className="d-flex justify-content-center">
          {projectDetails.errorProject}
        </div>
      );
    }

    let {
      editBtn,
      addToMyListBtn,
      removeFromMyListBtn,
      holderLabel,
      addressLabel,
      requireSetLabel,
      contactNameLabel,
      contactPhoneLabel,
      projectNoteLabel,
      projectNumberLabel,
      projectDescriptionLabel
    } = this.props.local.strings.certFocusProjects.projectView;

    const {
      CFContactName,
      CFContactPhone,
      address1,
      address2,
      city,
      description,
      favorite,
      holderName,
      id,
      name,
      number,
      state,
      zipCode,
      RequirementSetName,
      CFNote,
      CountryName,
      projectCustomFields
    } = this.props.projectDetails.projectData;

    return (
      <div>
        <div className="section-header my-3">
          <h2 className="profile-view-header-title">{name}</h2>
          <div className="d-flex">
            <div className="mr-3">
              <button onClick={onEditProject} className="header-primary-button">{editBtn}</button>
            </div>

            {this.props.projectDetails.favoriteFetching ?
              <div className="spinner-wrapper mt-0 mx-5">
                <div className="spinner" />
              </div> : (favorite ?
                <div>
                  <button onClick={() => setToMyList(false, id)} className="header-primary-button">{removeFromMyListBtn}</button>
                </div> :
                <div>
                  <button onClick={() => setToMyList(true, id)} className="header-primary-button">{addToMyListBtn}</button>
                </div>
              )
            }

            <TypeAheadAndSearch />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm mt-3">
            <table className="table table-hover profile-view-info-table">
              <tbody>
                <tr>
                  <td>{holderLabel}:</td>
                  <td>{holderName}</td>
                </tr>
                <tr>
                  <td>{addressLabel}:</td>
                  <td>
                    {address1 || <span>&nbsp;</span>}<br/>
                    {address2 || <span>&nbsp;</span>}<br/>
                    {(city || state || zipCode) ? <span>{city}, {state}, {zipCode}</span> : <span>&nbsp;</span>}<br/>
                    {CountryName || <span>&nbsp;</span>}<br/>
                  </td>
                </tr>
                <tr>
                  <td>{requireSetLabel}:</td>
                  <td>{RequirementSetName}</td>
                </tr>
                <tr>
                  <td>{projectNoteLabel}:</td>
                  <td>{CFNote}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm mt-3">
            <table className="table table-hover profile-view-info-table">
              <tbody>
                <tr>
                  <td>{contactNameLabel}:</td>
                  <td>{CFContactName}</td>
                </tr>
                <tr>
                  <td>{contactPhoneLabel}:</td>
                  <td>{Utils.formatPhoneNumber(CFContactPhone)}</td>
                </tr>
                <tr>
                  <td>{projectNumberLabel}:</td>
                  <td>{number}</td>
                </tr>
                { projectCustomFields && projectCustomFields.map(renderCustomFields) }
                <tr>
                  <td>{projectDescriptionLabel}:</td>
                  <td>{description}</td>
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
    login: state.login,
  }
};

export default connect(mapStateToProps)(ProjectInfo);