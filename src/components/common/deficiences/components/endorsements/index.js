import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from './../../actions/actions';
import { bindActionCreators } from 'redux';

class DeficiencesEndorsements extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  dispatchConfirm(id) {
    this.props.actions.fetchConfirmDeficiences([id]);
  }

  dispatchWaive(id) {
    this.props.actions.setSelectWaiver(id);
    this.props.showWaivedModal();    
  }

  dispatchUndo(id) {
    this.props.actions.fetchUndoWaiverDeficiences(id);
  }

  renderBtnConfirm(id, status) {
    let component = null;
    if (status == null) {
      component = (
        <td><a href="javascript:void(0)" style={{ color: "red" }} onClick={() => this.dispatchConfirm(id)}>Confirm</a></td>
      )
    }
    else if (status === 'confirmed') {
      component = (
        <td><span style={{ color: "green" }}>Confirmed</span></td>
      )
    }
    return component;
  }

  renderBtnWaive(id, status) {
    let component = null;

    if (status == null) {
      component = component = (
        <td><a href="javascript:void(0)" style={{ color: "red" }} onClick={() => this.dispatchWaive(id)}>Waive</a></td>
      )
    }
    else if (status === 'waived') {
      component = (
        <td><span style={{ color: "green" }}>waived</span></td>
      )
    }

    return component;
  }

  renderBtnUndo(id, status) {
    let component = null;
    if (status === 'confirmed' || status === 'waived')
      component = (
        <td><a href="javascript:void(0)" onClick={() => this.dispatchUndo(id)}>Undo</a></td>
      )
    return component;
  }


  render() {
    const deficiencesEndorsements = !this.props.data ? [] : this.props.data.filter(deficiences => deficiences.type == 'endorsement');
    const tableBody = deficiencesEndorsements.map(deficiences => {
      return (
        <tr>
          <td>{deficiences.name}</td>
          {this.renderBtnConfirm(deficiences.id, deficiences.status)}
          {this.renderBtnWaive(deficiences.id, deficiences.status)}
          {this.renderBtnUndo(deficiences.id, deficiences.status)}
        </tr>
      )
    });

    return (
      <Accordion defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} variant="text" eventKey="1">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <span><h5>Additional Requirements</h5></span>
              </div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body style={{ padding: 0 }}>
              <table class="table" style={{ fontSize: 14 }}>
                <thead>
                  <tr>
                    <th scope="col">Endorsements Name</th>
                    <th scope="col ml-2"></th>
                    <th scope="col ml-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {tableBody}
                </tbody>
              </table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};
export default connect(null, mapDispatchToProps)(DeficiencesEndorsements);