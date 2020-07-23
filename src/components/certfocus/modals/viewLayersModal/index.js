import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

import * as coverageActions from './../../coverages/actions';
import * as processingActions from './../../processing/actions';
import * as commonActions from '../../../common/actions';

import '../addEntityModal.css';

class ViewLayersModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentData: null,
      fetching: true,
      error: false,
    };
  }

  componentDidMount() {
    const { layersData } = this.props;
    const payload = {
      projectInsuredId: layersData.projectInsuredId,
      coverageTypeId: layersData.coverageTypeId,
    }

    this.props.coverageActions.fetchCoveragesTopLayers(payload, (error, data) => {
      if (!error) {
        this.setState({ currentData: data, fetching: false });
      } else {
        this.setState({ error: true, fetching: false });
      }
    });    
  }

  hideModal = () => {
    const { onHide, close } = this.props;
    if (onHide) onHide();
    else close();
  }

  setAsTopLayer = (e, data) => {
    const { layersData } = this.props;
    e.preventDefault();
    Swal({
      title: `Top Layer Assignment`,
      text: `Are you sure you want to assign the Certificate # ${data.CertificateID} for the ${layersData.coverageTypeName} Coverage Type?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        const payload = {
          projectInsuredId: layersData.projectInsuredId,
          coverageTypeId: layersData.coverageTypeId,
          certificateId: data.CertificateID,
        };
        this.props.commonActions.setLoading(true);
        this.props.coverageActions.setTopLayer(payload, () => {
          this.props.processingActions.calculateDeficiencies(layersData.holderId, layersData.projectId, layersData.insuredId, data.DocumentID, data.CertificateID, () => {
            this.props.commonActions.setLoading(false);
            this.props.close();
          });  
        });
      }
    });
  }

  render() {
    const {
      title,
    } = this.props.local.strings.coverages.viewLayers;
    const { currentData, error, fetching } = this.state;
    const { layersData } = this.props;
    
    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">         

          {(error) ? (
            <div className="missing-data-container">
              <div className="alert alert-danger" role="alert">
                Cannot retrieve layers data. Please try again.
              </div>
            </div>
          ) : (
            (fetching) ? (
              <div className="spinner-wrapper mt-0">
                <div className="spinner" />
              </div>
            ) : (
              <div className="layers-table">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Certificate ID</th>
                      <th>Coverage Type</th>
                      <th>Uploaded Date</th>
                      <th>Top Layer</th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentData && currentData.length > 0 ? (
                    currentData.map(document => (
                    <tr key={document.CertificateID}>
                      <td>{document.CertificateID}</td>
                      <td>{(layersData) ? layersData.coverageTypeName : null}</td>
                      <td>{(document.UploadedDate) && moment(document.UploadedDate).format('MM/DD/YYYY')}</td>
                      <td>
                        {(document.TopLayer) ? 'Yes' : (
                          <a
                            onClick={(e) => this.setAsTopLayer(e, document)}
                            className="cell-table-link icon-edit">
                            Set as Top Layer
                          </a>
                        )}
                      </td>
                    </tr>
                    )
                  )) : (
                    <tr>
                      <td colSpan={4}>No layers available</td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            )
          )}  
          </div>
        </section>
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
    coverageActions: bindActionCreators(coverageActions, dispatch),
    processingActions: bindActionCreators(processingActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewLayersModal));
