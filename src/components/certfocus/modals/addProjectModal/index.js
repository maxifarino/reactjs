import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProjectInfoTab from './projectInfoTab';
import Utils from '../../../../lib/utils';

import '../addEntityModal.css';

import * as projectActions from '../../projects/actions';
import * as commonActions from '../../../common/actions';

class AddProjectModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: props.project?props.project.id:null
    };
  };

  componentDidMount() {
    const { common, commonActions } = this.props;

    if(common.countries.length <= 0){
      commonActions.fetchCountries();
    }

    // if(common.projectStatus.length <= 0){
    //   commonActions.fetchProjectStatus();
    // }

  }

  send = (values) => {
    const { sendProject, sendCustomFieldValues, sendProjectReqSet } = this.props.projectActions;
    const serializedProjectObj = { ...values, holderId: values.holderId.value };
    const { contactPhone } = serializedProjectObj;
    // format contact phone
    let formattedPhone;
    if (contactPhone) {
      formattedPhone = Utils.normalizePhoneNumber(contactPhone);
    }
    serializedProjectObj.contactPhone = formattedPhone;
    // Get custom values if any
    const customValues = [];
    for (const key in values){
      if(key.includes('customField-')){
        customValues.push({
          customFieldId: key.split('customField-')[1],
          fieldValue: values[key]
        });
      }
    }
    // add project id when editing
    if (this.state.projectId) {
      serializedProjectObj.id = this.state.projectId;
    }
    //POST project
    this.props.commonActions.setLoading(true);
    sendProject(serializedProjectObj, (project) => {      
      if (project && customValues.length > 0) {
        this.setState({ projectId: project.projectId });

        // if project has a requirementSet
        if (values.reqSet) {        
          const reqSetPayload = {
            projectId: project.projectId,
            requirementSetId: values.reqSet,
          };
          sendProjectReqSet(reqSetPayload, (success) => {
            if (success) {
              const payload = {
                projectId: project.projectId,
                customFields: customValues
              };

              sendCustomFieldValues(payload, (success) => {
                this.props.commonActions.setLoading(false);
                if (success) this.props.close();
              });
            } else {
              this.props.commonActions.setLoading(false);
            }
          });
        } else {
          this.props.commonActions.setLoading(false);
          this.props.close();
        } 
      } else if (project) {         
        // if project has a requirementSet
        if (values.reqSet) { 
          const reqSetPayload = {
            projectId: project.projectId,
            requirementSetId: values.reqSet,
          };
          sendProjectReqSet(reqSetPayload, (success) => {
            if (success) {
              this.setState({ projectId: project.projectId });

              this.props.commonActions.setLoading(false);
              this.props.close();
            } else {
              this.props.commonActions.setLoading(false);
            }
          });
        } else {
          this.props.commonActions.setLoading(false);
          this.props.close();
        } 
      } else {
        this.props.commonActions.setLoading(false);
      }
    });

  };

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  render() {
    const {
      title,
      titleEditProject
    } = this.props.local.strings.hcProfile.projects.addProjectModal;
		const { project, fromHolderTab, fromProjectView } = this.props;
		const titleText = project ? titleEditProject : title;

    return (
      <div className="new-entity-form wiz-wrapper">
        <header className="small">
          <h2 className="modal-wiz-title">
            {titleText}
          </h2>
        </header>

        <div className="steps-bodies add-item-view">
          <div className='step-body add-item-form-subsection active'>
            <ProjectInfoTab
              close={this.hideModal}
              continueHandler={this.send}
              fromHolderTab={fromHolderTab}
              project={project}
              fromProjectView={fromProjectView}
            />
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    common: state.common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators(projectActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProjectModal);
