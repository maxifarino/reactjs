import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import ProjectInfo from './ProjectInfo';
import EditProjectModal from '../modals/addProjectModal';
import Tabs from './tabs';

import * as projectDetailsActions from './actions';
import * as projectsActions from './../projects/actions';
import * as commonActions from '../../common/actions';

import './projectView.css';

class ProjectView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    const { projectId } = this.props.match.params;
    this.props.actions.fetchProject(projectId);
  }

  componentWillUnmount() {
    this.props.commonActions.setHeaderTitle('');
  }

  componentDidUpdate() {
    if (this.props.projectDetails.projectData) {
      this.setBreadcrumb();
     }
  }

  onCloseEditProject = () => {
    this.setState({ showModal: false });
  }

  onCloseEditProjectAndRefresh = () => {
    const { projectId } = this.props.match.params;
    this.props.actions.fetchProject(projectId);

    this.setState({ showModal: false });
  }

  onEditProject = () => {
    this.setState({ showModal: true });
  }

  setToMyList = (condition, projectId) => {
    const { profile } = this.props.login;

    this.props.projectsActions.sendProjectFavorite(condition, { projectId, userId: profile.Id });
  }

  renderCustomFields = (field, idx) => {
    const { CustomFieldName, FieldValue, Archived } = field;
    if (Archived) {
      return null;
    }
    return (
      <tr key={idx}>
        <td>{CustomFieldName}:</td>
        <td>{FieldValue}</td>
      </tr>
    );
  }

  setBreadcrumb = () => {
    this.props.commonActions.setBreadcrumbItems([
      {
        pathName: this.props.projectDetails.projectData.holderName,
        hrefName: '/certfocus/holders/' + this.props.projectDetails.projectData.holderId
      },
      {
        pathName: this.props.projectDetails.projectData.name,
        hrefName: window.location.pathname
      }
    ]);
  }

  render() {
    return (
      <div className="project-view">
        {/* EDIT MODAL */}
        <Modal
          show={this.state.showModal}
          onHide={this.onCloseEditProject}
          className="add-item-modal add-hc">
          <Modal.Body className="add-item-modal-body mt-0">
            <EditProjectModal
              close={this.onCloseEditProjectAndRefresh}
              onHide={this.onCloseEditProject}
              project={this.props.projectDetails.projectData}
              fromProjectView
            />
          </Modal.Body>
        </Modal>

        <div className="container-fluid">
          <ProjectInfo
            projectDetails={this.props.projectDetails}
            onEditProject={this.onEditProject}
            setToMyList={this.setToMyList}
            renderCustomFields={this.renderCustomFields}
          />
          
          {!_.isEmpty(this.props.projectDetails.projectData) &&
            <Tabs 
              proyectArchived={this.props.projectDetails.projectData.archived}
              holderId={this.props.projectDetails.projectData.holderId}
              projectHolderName={this.props.projectDetails.projectData.holderName}
              projectName={this.props.projectDetails.projectData.name}
            />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projectDetails: state.projectDetails,
    local: state.localization,
    projects: state.holdersProjects,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(projectDetailsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    projectsActions: bindActionCreators(projectsActions, dispatch),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(ProjectView);
