import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/actions';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../../common/actions';
import * as certificateActions from './../../../../certfocus/certificates/actions';
import Accordion from './../../../../common/accordion';

class DeficiencesMajor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggle: ""
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {

  }

  dispatchConfirm(id) {
    this.props.commonActions.setLoading(true);
    let projectInsuredID = this.props.certificatesList[0].ProjectInsuredID;
    let deficienciesToConfirm = this.props.deficiences.filter((x) => (x.ProjectInsuredDeficiencyID != null && x.ProjectInsuredDeficiencyID == id));
    let deficienciesRemaining = this.props.deficiences;
    this.props.actions.fetchConfirmDeficiences(deficienciesToConfirm, projectInsuredID, deficienciesRemaining, () => {
      this.props.certificateActions.fetchCertificates(projectInsuredID);
      this.props.actions.fetchDeficiences(projectInsuredID);
      this.props.commonActions.setLoading(false);
    });
  }

  dispatchWaive(id) {
    this.props.actions.setSelectWaiver(id);
    this.props.showWaivedModal();
  }

  renderSectionContent(tableBody, hasValue) {
    let component = hasValue ? (
      <table class="table" style={{ fontSize: 14 }}>
        <thead>
          <tr>
            <th scope="col">Coverage</th>
            <th scope="col">Attribute</th>
            <th scope="col">Required</th>
            <th scope="col">Provided</th>
            <th scope="col ml-2"></th>
            <th scope="col ml-2"></th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
    ) : (<span className="d-flex justify-content-center align-items-center mt-2">No results</span>);

    return component;
  }

  render() {
    // DeficiencyStatusID = 1 //confirmed
    // DeficiencyStatusID = 2 //confirmed
    // DefTypeID = 1 //mayor
    const deficiencesMayor = !this.props.data ? [] : this.props.data.filter(deficiences => deficiences.DefTypeID == 1 && deficiences.DeficiencyStatusID == 0);
    const tableBody = deficiencesMayor.map(deficiences => {
      return (
        <tr>
          <td>{deficiences.CoverageType}</td>
          <td>{deficiences.AttributeName}</td>
          <td>{deficiences.ConditionValue}</td>
          <td>{deficiences.AttributeValue}</td>
          <td><a href="javascript:void(0)" style={{ color: "red" }} onClick={() => this.dispatchConfirm(deficiences.ProjectInsuredDeficiencyID)}>Confirm</a></td>
          <td><a href="javascript:void(0)" style={{ color: "red" }} onClick={() => this.dispatchWaive(deficiences.ProjectInsuredDeficiencyID)}>Waive</a></td>
        </tr>
      )
    });

    const title = <span className="accordionHeader d-flex justify-content-center">
        <span className="mt-2" style={{ paddingLeft: '230px' }}>
          <h5>Major</h5>
        </span>
      </span>;
    
    const data = [
      {
        title: title,
        content: this.renderSectionContent(tableBody, deficiencesMayor.length > 0),
        isShown: this.props.showAll
      }
    ]

    const headerStyle = {
      background: 'linear-gradient(to bottom right, #7ED0BC, #29AEA2)',
      color: '#FFFFFF',
      paddingTop: '5px',
      paddingBottom: '5px',
    };
    return (

      <div className="p-2" style={{ width: '100%' }}>
        <Accordion
          data={data}
          headerStyle={headerStyle}
        />
      </div>

    )
  }
}
const mapStateToProps = (state) => {
  return {
    certificatesList: state.certificates.certificatesList,
    showAll: state.deficiences.showAll,
    deficiences: state.deficiences.deficiencesList   
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    certificateActions: bindActionCreators(certificateActions, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DeficiencesMajor);