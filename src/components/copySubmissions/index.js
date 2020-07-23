import React from 'react';
import { connect } from 'react-redux';
import * as actions from './actions';
import PTable from './../common/ptable';
import Utils from './../../lib/utils';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';

class CopySubmissions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hiringClientSelected: null,
      formIdSelected: null,
      disabledDWLFormName: false,
      parameter: { formId: null },
      paginationSettings: {
        total: 0,
        itemsPerPage: 10,
        currentPageNumber: 1
      },
      showModalMessage: false
    }
  }

  componentDidMount() {
    this.props.actions.fetchHiringClient({ scId: this.props.subContractorId, formId: this.props.formId, hiringClientId: this.props.hiringClientId });
  }

  renderOptionsHC = () => {
    let component = this.props.hiringClients.map(x => {
      return <option value={x.Id}>{x.Name}</option>
    })
    return component;
  }

  renderOptionsFN = () => {
    let component = this.props.forms.map(x => {
      return <option value={x.Id}>{x.Name}</option>
    })
    return component;
  }

  handleChangeHC = (event) => {
    const selectedValue = event.target.value;
    this.setState({ hiringClientSelected: selectedValue });
    if (selectedValue != 0) {
      let parameter = {
        hcId: selectedValue,
        pageSize: 10, pageNumber: 1, subContractorIdSelected: this.props.subContractorId,
        formIdSelected: this.props.formId
      };

      this.props.actions.fetSubmissionsByFormId(parameter);
    }
    else
      this.props.actions.setClearFormSubmission();
  };

  handleChangeFN = (event) => {
    const selectedValue = event.target.value;
    this.setState({ formIdSelected: selectedValue });
    if (selectedValue != 0) {
      let parameter = {
        formId: selectedValue, hcId: this.state.hiringClientSelected,
        pageSize: 10, pageNumber: 1, subContractorIdSelected: this.props.subContractorId,
        formIdSelected: this.props.formId
      };

      this.props.actions.fetSubmissionsByFormId(parameter);
    }
    else
      this.props.actions.setClearFormSubmission();
  }

  isfetchingForms = () => {
    return this.props.fetchingTable;
  }

  sendCopy = (copyFromSubmissionId) => {
    this.openAlertMessage(copyFromSubmissionId);
  }
  
  hideModal = () => {    
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  saveSubmission = (copyFromSubmissionId) => {
    let self = this;
    let parametersCopy = { formIdIncomplete: this.props.formIdIncomplete, copyFromSubmissionId: copyFromSubmissionId };

    let parameterFilter = {
      formId: this.state.formIdSelected, hcId: this.state.hiringClientSelected,
      pageSize: 10, pageNumber: 1, subContractorIdSelected: this.props.subContractorId,
      formIdSelected: this.props.formId
    };
    this.props.actions.fetchCopySubmission(parametersCopy, parameterFilter, function () {
      Swal({
        title: "Form Copy Success!",
        text: "Please review the form before submitting as all fields may not have copied over because of difference between forms. Please ensure all fields are accurate and click Submit at the bottom of the last page.Thank you",
        icon: "success",
        button: "OK!",
      }).then((result) => {        
        if (result.value) {
          self.hideModal();
        }
      });
    });

  }

  openAlertMessage = (copyFromSubmissionId) => {
    Swal({
      title: `Copy Submission`,
      text: `The form submission will be copied and the existing data in the destination form may be cleared/replaced`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.saveSubmission(copyFromSubmissionId);
      }
    });
  }  

  render() {

    const paginationSettings = {}
    const formsTableMetadata = {
      fields: [
        'formName',
        //'submitterUserName',
        'submissionDate',
        'status',
        'copy'
      ],
      header: {
        formName: 'Name',
        //submitterUserName: 'SubmittedBy',
        submissionDate: 'SubmissionDate',
        status: 'Status',
        Copy: ''
      }
    };
    const colsWidth = [
      '30%',
      '30%',
      '20%',
      '20%',
    ];



    const savedFormsTableBody = this.props.formSubmissions.map((savedForm) => {
      const { id, formName, submitterUserName, submissionDate, status } = savedForm;
      return {
        formName,
        //submitterUserName,
        submissionDate: Utils.getFormattedDate(submissionDate, true),
        status: (
          <span className={`status-cell ${status && status.toLowerCase()}`} >
            {status}
          </span>
        ),
        copy: (
          <a
            className='icon-log cell-table-link'
            onClick={() => this.sendCopy(id)}
          >
            {'Auto-fill From'}
          </a>
        )
      }
    });

    const formsTableData = {
      fields: formsTableMetadata.fields,
      header: formsTableMetadata.header,
      body: savedFormsTableBody
    };

    let disabledStyle = { 'opacity': this.state.disabledDWLFormName ? '0.6' : '100' };
    return (
      <div>
        <header>
          <div className="noteEditorTitle">Please select eligible form to copy data previously submitted to different Hiring Client</div>
        </header>
        <form>
          <div className="container mt-3 mb-5">
            <div className="row">
              <div className="col-sm">
                <div className="row">
                  <div className="col-4">
                    <label htmlFor="title">
                      Hiring Client:
                                    </label>
                  </div>
                  <div className="col-8 ml-0">
                    <select name="type" onChange={this.handleChangeHC}>
                      <option value="0">--Select Hiring Client--</option>
                      {this.renderOptionsHC()}
                    </select>
                  </div>
                </div>

              </div>
              <div className="col-sm">
                <div className="row">
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col 12">
                <PTable
                  items={formsTableData}
                  pagination={paginationSettings}
                  colsConfig={colsWidth}
                  isFetching={this.isfetchingForms()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('state.copySubmissions', state.copySubmissions)
  return {
    hiringClients: state.copySubmissions.hiringClients,
    forms: state.copySubmissions.forms,
    formSubmissions: state.copySubmissions.formSubmissions,
    subContractorId: state.copySubmissions.subContractorSelected,
    formId: state.copySubmissions.formIdSelected,
    formIdIncomplete: state.copySubmissions.formIdIncomplete,
    fetchingTable: state.copySubmissions.fetchingTable,
    hiringClientId: state.copySubmissions.hiringClientId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CopySubmissions);