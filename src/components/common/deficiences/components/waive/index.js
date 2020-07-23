import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/actions';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../../common/actions';
import * as certificateActions from './../../../../certfocus/certificates/actions';
import Accordion from './../../../../common/accordion';

class DeficiencesWaived extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  dispatchUndo(id) {
    this.props.commonActions.setLoading(true);
    let projectInsuredID = this.props.certificatesList[0].ProjectInsuredID;
    this.props.actions.fetchUndoWaiverDeficiences(id, projectInsuredID, () => {
      this.props.certificateActions.fetchCertificates(projectInsuredID);
      this.props.actions.fetchDeficiences(projectInsuredID);
      this.props.commonActions.setLoading(false);
    });
  }

  renderSectionContent(tableBody, hasValue) {
    let component = hasValue ? (
      <table className="table" style={{ fontSize: 14 }}>
        <thead>
          <tr>
            <th scope="col">Coverage</th>
            <th scope="col">Attribute</th>
            <th scope="col">Required</th>
            <th scope="col">Provided</th>
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
    const deficiencesWaive = !this.props.data ? [] : this.props.data.filter(deficiences => deficiences.DeficiencyStatusID == 2 && deficiences.DefTypeID != 3);
    const tableBody = deficiencesWaive.map(deficiences => {
      return (
        <tr>
          <td>{deficiences.CoverageType}</td>
          <td>{deficiences.AttributeName}</td>
          <td>{deficiences.ConditionValue}</td>
          <td>{deficiences.AttributeValue}</td>
          <td><a href="javascript:void(0)" onClick={() => this.dispatchUndo(deficiences.ProjectInsuredDeficiencyID)}>Undo</a></td>
        </tr>
      )
    });

    const title = <span className="accordionHeader d-flex justify-content-center">
        <span className="mt-2" style={{ paddingLeft: '227px' }}>
          <h5>Waived</h5>
        </span>
      </span>;

    const data = [
      {
        title: title,
        content: this.renderSectionContent(tableBody, deficiencesWaive.length > 0),
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
    showAll: state.deficiences.showAll
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    certificateActions: bindActionCreators(certificateActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeficiencesWaived);