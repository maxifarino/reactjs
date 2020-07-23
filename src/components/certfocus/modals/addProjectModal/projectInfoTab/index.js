import React from 'react';
import { connect } from 'react-redux';
import ProjectInfoForm from './form';

class ProjectInfoTab extends React.Component {

  submit = (values) => {
    this.props.continueHandler(values);
  };

  render() {
    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <ProjectInfoForm
            close={this.props.close}
            onSubmit={this.submit}
            project={this.props.project}
            fromHolderTab={this.props.fromHolderTab}
            fromProjectView={this.props.fromProjectView}
          />
          <div className="save-entity-modal-error">{this.props.projects.addProjectError}</div>
        </div>
      </section>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    projects: state.holdersProjects,
    local: state.localization,
  };
};

export default connect(mapStateToProps)(ProjectInfoTab);
