import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import DeficiencyViewerForm from './form';

import * as actions from './actions';



class DeficiencyViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deficiencies: {},
      loading: true,
      error: false,
      documentUrl: null,
      toggleFileViewer: true,
      enablePreview: false,
    };
  };

  componentDidMount() {
    const { documentId } = this.props.match.params;   
    if (documentId) {
      this.props.actions.fetchDeficiencies(documentId, (holder, project) => {
        console.log('fetchDeficiencies', holder, project);
          if (typeof holder !== 'undefined' && typeof project !== 'undefined') {
            this.props.actions.fetchRequirementSetDetail({ holderId: holder.id, projectId: project.id, documentId });
          }
          this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: false });
    }
  }

     
  render() {
    const {
      holderTypeAheadLabel,
      projectTypeAheadLabel,
      toggleViewer,
    } = this.props.local.strings.processing.filter;
    const {
      noDeficienciesText,
      showRequirementsBtn,
    } = this.props.local.strings.processing.deficiencyViewer;
    const { deficiency } = this.props;

    console.log('PROPS', this.props);

    if (deficiency.fetching.deficiencies) {
      return (
        <div className="text-center">
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        </div>
      );
    }
    //  else if (error) {
    //   return (
    //     <div className="text-center text-danger">
    //       ERROR
    //     </div>
    //   );
     else if (_.isEmpty(deficiency.deficiencies)) {
      return (
        <div className="text-center">
          {noDeficienciesText}
        </div>
      );
    }

    return (
      <div className="newhc-form wiz-wrapper processing-screen-container">
        <div className="entity-info-form">
          <div className="container-fluid">          
            <div className="row p-3">
              <div className="col-md-12">
                <div className="filter-form-field-wrapper">
                  <label htmlFor="holder">{holderTypeAheadLabel}</label>
                  <div className="form-removable-container">
                    <div className="value-container">
                      <div className="value-label">{deficiency.holder.name}</div>
                    </div>
                  </div>
                </div>
                <div className="filter-form-field-wrapper">
                  <label htmlFor="project">{projectTypeAheadLabel}</label>
                  <div className="form-removable-container">
                    <div className="value-container">
                      <div className="value-label">{deficiency.project.name}</div>
                    </div>
                  </div>
                </div>
                <div className="filter-form-field-wrapper">
                  <Link
                    to={`/certfocus/settings/${deficiency.reqSetId}`}
                    className="wiz-continue-btn bg-sky-blue-gradient bn"
                    target="_blank"
                  >
                    {showRequirementsBtn}
                  </Link>
                </div>                
              </div>
            </div>
          </div>
        </div>
        <hr className="my-0" />
        <section className="wiz-step white-section deficiency-viewer-container">
          <div className="admin-form-field-wrapper">
            <DeficiencyViewerForm
              deficiency={deficiency}
              documentId={deficiency.documentId}
            />
          </div>
        </section>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    deficiency: state.deficiency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DeficiencyViewer);
