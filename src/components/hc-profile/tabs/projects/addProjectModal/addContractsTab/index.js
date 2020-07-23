import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { setAddProjectData } from '../../actions';
import Form from './form';

class addContractsTab extends React.Component {

  submit(data) {
    // when editing from sc profile, the first page is ignored so the values are not populated
    if (this.props.project && this.props.fromScTab) {
      const projectInfo = {
        id: this.props.project.id,
        projectName: this.props.project.name,
        projectStatus: this.props.statusId
      }
      this.props.setAddProjectData({ projectInfo });
    }

    const filteredData = _.isArray(data.rows) ? data.rows.filter((item) => !_.isEmpty(item)) : [];
    this.props.setAddProjectData({ contracts: filteredData });
    this.props.continueHandler();
  };

  render() {
    const {
      title
    } = this.props.local.strings.hcProfile.projects.addProjectModal.AddContractsTab;

    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <h2 className="step-title">{title}</h2>
          <Form
            close={this.props.close}
            onSubmit={this.submit.bind(this)}
            project={this.props.project}
            isSubmitting={this.props.projects.fetchingProjects} />
          />
          <div className="save-hc-modal-error">{this.props.projects.error}</div>
        </div>
      </section>
    );
  }

};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    projects: state.projects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAddProjectData: bindActionCreators(setAddProjectData, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(addContractsTab);
