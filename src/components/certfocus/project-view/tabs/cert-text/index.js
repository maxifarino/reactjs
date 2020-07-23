import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CertTextForm from './form';

import * as actions from './actions';

import './CertText.css';

class CertText extends Component {
  componentDidMount() {
    const { projectId } = this.props;

    this.props.actions.fetchCertText(projectId);
  }

  handleEdit = (data) => {
    const { projectId, projectCertText } = this.props;

    const payload = {
      ...data,
      ...(projectCertText.data.ProjectCertTextID ? { projectCertTextId: projectCertText.data.ProjectCertTextID } : {}),
      projectId,
    }

    this.props.actions.editCertText(payload, (success) => {
      if (success) {
        const { projectId } = this.props;

        this.props.actions.fetchCertText(projectId);
      }
    });
  }

  render() {
    if (this.props.projectCertText.fetching) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner mb-4" />
        </div>
      );
    }

    return (
      <div className="add-item-view add-entity-form-small project-cert-text">
        <section className="white-section">
          <div className="add-item-form-subsection">
            <div className="row">
              <div className="col-md-6">
                <CertTextForm
                  certText={this.props.projectCertText.data}
                  onSubmit={this.handleEdit}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    projectCertText: state.projectCertText,
    local: state.localization
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CertText);
