import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import PDFViewer from './PDFViewer';
import Accordion from '../../common/accordion';
import * as actions from './actions';

class DeficiencyViewerForm extends Component {

  waiveDeficiency = (data) => {
    const { documentId, actions } = this.props;

    console.log('action: WAIVE', data, documentId);
    actions.sendDeficiencyStatus(data, documentId, 'waive');
  }

  acceptDeficiency = (data) => {
    const { documentId, actions } = this.props;

    console.log('action: ACCEPT', data, documentId);
    actions.sendDeficiencyStatus(data, documentId, 'accept');
  }

  renderSectionContent = (section) => {
    const { deficiency } = this.props;
    const {
      acceptBtn,
      waiveBtn,
    } = this.props.local.strings.processing.deficiencyViewer;
    console.log('renderSectionContent', section, deficiency.deficiencies[section]);
    if (section && deficiency.deficiencies[section]) {
      // Get an array of unique rule groups
      let deficienciesGroups = _.uniqBy(deficiency.deficiencies[section], 'RuleGroupName');
      console.log('deficienciesGroups', deficienciesGroups);
      return deficiency.deficiencies[section].map((data, key) => {
        console.log('data', data, key);

        const loading = deficiency.deficiencyUpdateFetching.find(deficiency => deficiency === data.ProjectInsuredDeficiencyID);
        const error = deficiency.deficiencyUpdateError.find(deficiency => deficiency.id === data.ProjectInsuredDeficiencyID);
        const result = deficiency.deficiencyUpdate.find(deficiency => deficiency.id === data.ProjectInsuredDeficiencyID);
        // Find the group name for this rule
        const deficiencyLine = deficienciesGroups.find(deficiency => deficiency.RuleGroupName === data.RuleGroupName);

        console.log('loading', loading);
        console.log('error', error);
        console.log('result', result);
        console.log('deficiencyLine', deficiencyLine);

        // If the title was found, remove it from the unique rule groups array so it doesn't appear on the next rules
        if (deficiencyLine) {
          deficienciesGroups = deficienciesGroups.filter(deficiency => deficiency.RuleGroupName !== data.RuleGroupName);
        }

        console.log('deficienciesGroups', deficienciesGroups);

        const renderButtons = () => {
          if (loading) {
            return (
              <div className="spinner-wrapper mt-0">
                <div className="spinner" />
              </div>
            );
          } else if (data.DeficiencyStatusID === 1 || (result && result.status === 'waive')) {
            return (
              <div className="p-2">Waived</div>
            );
          } else if (data.DeficiencyStatusID === 2 || (result &&  result.status === 'accept')) {
            return (
              <div className="p-2">Accepted</div>
            );
          } else {
            return (
              <Fragment>
                {/* TODO: SHOW BUTTONS */}
                <div className="p-2">
                  <button className="bn bn-small bg-green-dark-gradient" onClick={() => this.waiveDeficiency(data)}>{waiveBtn}</button>
                </div>
                <div className="p-2">
                  <button className="bn bn-small bg-green-dark-gradient" onClick={() => this.acceptDeficiency(data)}>{acceptBtn}</button>
                </div>
              </Fragment>
            );
          }
        };

        return (
          <Fragment key={key}>
            <div className="d-flex flex-row p-1" style={{ textDecoration: 'underline'}}>
              {deficiencyLine ? deficiencyLine.RuleGroupName : ''}
            </div>
            <div className="d-flex flex-row" key={key}>
              <div className="mr-auto p-2">
                {data.DeficiencyText}
              </div>
              {renderButtons()}
              {error && <div className="text-danger">{error.error}</div>}
            </div>
          </Fragment>
        );
      });
    }
  }

  render() {
    const {
      majorDeficienciesText,
      minorDeficienciesText,
      endorsementsText,
    } = this.props.local.strings.processing.deficiencyViewer;

    const { deficiency } = this.props;
    console.log('form props', this.props);
    const data = [
      {
        title: <span className="accordionHeader">{majorDeficienciesText}</span>,
        content: this.renderSectionContent(1),
        isShown: true
      },
      {
        title: <span className="accordionHeader">{minorDeficienciesText}</span>,
        content: this.renderSectionContent(2),
        isShown: true
      },
      {
        title: <span className="accordionHeader">{endorsementsText}</span>,
        content: this.renderSectionContent(3),
        isShown: true
      },
    ];

    const headerStyle = {
      background: 'linear-gradient(to bottom right, #7ED0BC, #29AEA2)',
      color: '#FFFFFF',
      paddingTop: '5px',
      paddingBottom: '5px',
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            {deficiency.documentUrl ? (
              <PDFViewer
                pdf={deficiency.documentUrl}
                height="75vh"
                width="100%"
                position="sticky"
                top="10px"
                frameBorder="1p solid #000"
              />
            ) : (
              <div className="spinner-wrapper">
                <div className="spinner" />
              </div>
            )}
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="d-flex align-items-end flex-column">

              <div className="p-2" style={{width: '100%'}}>
                <Accordion
                  data={data}
                  headerStyle={headerStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeficiencyViewerForm);
