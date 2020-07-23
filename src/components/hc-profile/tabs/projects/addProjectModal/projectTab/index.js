import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setAddProjectData } from '../../actions';
import ProjectForm from './form';

class ProjectTab extends React.Component {
  submit(data) {
    if (this.props.project) {
      data.id = this.props.project.id;
    }

    this.props.setAddProjectData({ projectInfo: data });
    this.props.continueHandler();
  };

  render() {
    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <ProjectForm
            close={this.props.close}
            onSubmit={this.submit.bind(this)}
            project={this.props.project}
            isSubmitting={this.props.projects.fetchingProjects} />
          <div className="save-hc-modal-error">{this.props.projects.error}</div>
        </div>
      </section>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    projects: state.projects
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAddProjectData: bindActionCreators(setAddProjectData, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTab);
