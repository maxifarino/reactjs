import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

import DataEntryForm from './form';
import * as actions from '../actions';
import * as commonActions from '../../../common/actions';
import * as projectInsuredsActions from '../../project-insureds/actions';

import './DataEntry.css';
class DataEntry extends Component {

  componentDidMount() {
    const { 
      certificateData,
      actions,
    } = this.props;
    
    if (certificateData) {
      actions.fetchDataEntryAgencies({ withoutPag: true });
      actions.fetchRequirementSetDetail({ 
        holderId: certificateData.holderId, 
        projectId: certificateData.projectId, 
        documentId: certificateData.documentId
      });

      this.setBreadcrumb();
    }    
  }

  setBreadcrumb = () => {
    this.props.commonActions.setBreadcrumbItems([
      {
        pathName: this.props.certificateData.holderName,
        hrefName: '/certfocus/holders/' + this.props.certificateData.holderId
      },
      {
        pathName: this.props.certificateData.projectName,
        hrefName: '/certfocus/projects/' + this.props.certificateData.projectId
      },
      {
        pathName: this.props.certificateData.insuredName,
        hrefName: '/certfocus/insureds/' + this.props.certificateData.insuredId
      }
    ]);
  }

  onSubmit = (data) => {
    console.log('SUBMIT! ', data);
    this.props.commonActions.setLoading(true);
    this.props.actions.addDataEntry(data, (certificateId) => {
      this.props.commonActions.setLoading(false);
      console.log('certificateId: ', certificateId);
      this.props.actions.calculateDeficiencies(data.holderId, data.projectId, data.insuredId, data.documentId, certificateId, () => {
        Swal({
          type: 'success',
          title: 'Data Entry',
          text: 'Deficiencies have been successfully calculated.',
        });
        this.props.history.push(`/certfocus/documents`);
      });
    });
  };

  render() {
    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <DataEntryForm
            onSubmit={this.onSubmit}
            toggleFileViewer={this.props.toggleFileViewer}
            enablePreview={this.props.enablePreview}
            isNew={this.props.isNew}
            certificateData={this.props.certificateData}
            formData={this.props.formData}
          />
        </div>
      </section>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    processing: state.processing,
    projectInsureds: state.projectInsureds,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    projectInsuredsActions: bindActionCreators(projectInsuredsActions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataEntry));