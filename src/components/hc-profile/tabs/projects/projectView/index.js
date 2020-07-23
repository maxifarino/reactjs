import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class ProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.renderContracts = this.renderContracts.bind(this);
    this.renderContractCard = this.renderContractCard.bind(this);
  }

  renderContractCard (contract, idx) {
    const date = new Date(contract.startDate).toDateString() || '';
    const {
      scName,
      noScText,
      contractNumber,
      startDate,
      contractAmount
    } = this.props.local.strings.hcProfile.projects.projectView;

    return (
      <div key={idx} className="col-md-4" style={{marginBottom: '30px'}}>
        <div className="cards">
          <div className="card-title">
            <span>{contract.contractName}</span>
          </div>
          <div className="card-content">
            <span>{contract.subcontractorName || noScText}</span>
            <p>{scName}</p>
            <span>#{contract.number}</span>
            <p>{contractNumber}</p>
            <span>{date}</span>
            <p>{startDate}</p>
            <span>${contract.amount}</span>
            <p>{contractAmount}</p>
          </div>
        </div>
      </div>
    );
  }

  renderContracts () {
    const {
      noContractsFound
    } = this.props.local.strings.hcProfile.projects.projectView;
    const { contracts } = this.props.projects;

    if (contracts && contracts.length > 0) {
      return contracts.map(this.renderContractCard);
    }

    return (
      <div className="no-results-msg" style={{margin:0, width:'100%'}}>{noContractsFound}</div>
    );
  }

  render() {
    const { project } = this.props;
    const { fetchingContracts } = this.props.projects
    const {
      projectNumber,
      projectStatus,
      numberOfContracts,
      tradeTotal,
      contractsTitle
    } = this.props.local.strings.hcProfile.projects.projectView;

    return (
      <div className="project-view-container">
        <div className="col-md-12">
          <span className="project-view-title">{project.name}</span>
          <div className="divider"/>
          <div className="row">
            <div className="col-md-4">
              <div className="stats">
                <span>{project.number}</span>
                <p>{projectNumber}</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="stats">
                <span>{project.status}</span>
                <p>{projectStatus}</p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="stats">
                <span>{project.contractsCount}</span>
                <p>{numberOfContracts}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats">
                <span>${project.contractsTotalAmount}</span>
                <p>{tradeTotal}</p>
              </div>
            </div>
          </div>
          <span className="project-view-title">{contractsTitle}:</span>
          <div className="divider"/>
          <div className="row">
            {
              fetchingContracts?
                <div style={{width:'100%', height:'100%'}}>
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                  </div>
                </div>
                :
                this.renderContracts()
            }
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects,
    local: state.localization,
  };
};

export default withRouter(connect(mapStateToProps)(ProjectView));
