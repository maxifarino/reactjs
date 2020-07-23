import React from 'react';
import { Modal } from 'react-bootstrap';

import { connect } from 'react-redux';
import * as actions from './../../actions/actions';
import * as commonActions from './../../../../common/actions';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as certificateActions from './../../../../certfocus/certificates/actions';

class WaivedForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      note: '',
      approvedBy: 0,
      dueDate: null,
      disabledBtnSave: true
    }
  }

  componentDidMount() {
  }

  renderOptionsSelectUser() {
    const options = !this.props.users ? null : this.props.users.map(user => {
      return (
        <option value={user.Id}>{user.Name}</option>
      )
    });
    return options;
  }

  renderTrTable(data) {
    let trList = !data ? [] : data.map(row => {
      return (
        <tr>
          <td>{row && row.CoverageType}</td>
          <td>{row && row.AttributeName}</td>
          <td>{row && row.ConditionValue}</td>
          <td></td>
        </tr>
      )
    });
    return trList;
  }

  getWaiver() {
    let data = {
      waiverEndDate: this.state.dueDate,
      waiverStartDate: moment(new Date()).format('MM/DD/YYYY'),
      waiverSetBy: this.props.loggedInUser.Id,
      approvedBy: this.state.approvedBy != 0 ? this.state.approvedBy : null,
      note: this.state.note,
      deficiencesWaiver: this.props.deficiences.filter(data => data.selected && data.DeficiencyStatusID == 0 && data.ProjectInsuredDeficiencyID != null),
      deficienciesRemaining: this.props.deficiences,
      projectInsuredId: this.props.certificatesList[0].ProjectInsuredID
    }
    return data;
  }

  saveAndClose() {
    this.props.commonActions.setLoading(true);
    let deficiencesWaiver = this.getWaiver();
    // deficiencesWaiver.projectInsuredId = this.props.certificatesList[0].ProjectInsuredID;
    this.props.actions.fetchWaiverDeficiences(deficiencesWaiver, () => {
      this.props.onHide();
      this.props.certificateActions.fetchCertificates(this.props.certificatesList[0].ProjectInsuredID);
      this.props.actions.fetchDeficiences(this.props.certificatesList[0].ProjectInsuredID);
      this.props.commonActions.setLoading(false);
    });

  }

  cancelSave() {
    this.props.actions.setUnSelectAllWaiver();
    this.props.onHide();
  }

  handleChangeNote = (e) => {
    let disabledBtnSave = !(e.target.value.length > 0 && this.state.approvedBy != 0);
    this.setState({ note: e.target.value, disabledBtnSave: disabledBtnSave });
  }

  handleChangeApprovedBy = (e) => {
    let disabledBtnSave = !(this.state.note.length > 0 && e.target.value != 0);
    this.setState({ approvedBy: e.target.value, disabledBtnSave: disabledBtnSave });
  }

  setDueDate = (value) => {
    this.setState({ dueDate: value });
  }

  renderTrTableEndorsements(data) {
    let trList = !data ? [] : data.map(row => {
      return (
        <tr>
          <td>{row && row.name}</td>
        </tr>
      )
    });
    return trList;
  }


  render() {
    let deficiencesWaiver = this.props.deficiences.filter(data => data.ProjectInsuredDeficiencyID != null && data.selected == true && data.DeficiencyStatusID == 0 && data.DefTypeID != 3);
    let deficiencesEndorsements = this.props.deficiences.filter(data => data.selected == true && data.status == null && data.type == 'endorsement');
    return (
      <div>
        <header>
          <div className="noteEditorTitle">Waiver</div>
        </header>
        <form>
          <div className="container">
            <div className="row mt-2">
              <div className="col-4">
                <label>Holder Name</label>
                <input type="text" class="form-control" value={this.props.projectInsured && this.props.projectInsured.HolderName} disabled></input>
              </div>

              <div className="col-2">
                <label>Project Number</label>
                <input type="text" className="form-control" value={this.props.projectInsured && this.props.projectInsured.ProjectNumber} disabled></input>
              </div>

              <div className="col-3">
                <label>Project Name</label>
                <input type="text" className="form-control" value={this.props.projectInsured && this.props.projectInsured.ProjectName} disabled></input>
              </div>

              <div className="col-3">
                <label>Insured Name</label>
                <input type="text" className="form-control" value={this.props.projectInsured && this.props.projectInsured.InsuredName} disabled></input>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-3">
                <label>Req Set Name</label>
                <input type="text" className="form-control" value={this.props.projectInsured && this.props.projectInsured.RequirementSetName} disabled></input>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <label>Waiver Set By</label>
                <input type="text" class="form-control" value={this.props.loggedInUser.FirstName + " " + this.props.loggedInUser.LastName} disabled></input>
              </div>

              <div className="col-3">
                <label>Waiver Start Date</label>
                <input type="text" className="form-control" value={moment(new Date()).format('MM/DD/YYYY')} disabled></input>
              </div>

              <div className="col-3">
                <label>Waiver End Date</label>
                <input
                  className="form-control"
                  type="date"
                  onChange={(e) => { this.setDueDate(e.target.value) }}
                  value={this.state.dueDate} />

              </div>

              <div className="col-3">
                <label>Approved By</label>
                <select class="form-control" name="type" value={this.state.value} onChange={this.handleChangeApprovedBy}>>
                                    <option value="0">--Select User--</option>
                  {this.renderOptionsSelectUser()}
                </select>
              </div>
            </div>
            {deficiencesWaiver && deficiencesWaiver.length > 0 &&
              <div className="row mt-3">
                <div className="col-12">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">Coverage Name</th>
                        <th scope="col">Coverage Attribute</th>
                        <th scope="col">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTrTable(deficiencesWaiver)}
                    </tbody>
                  </table>
                </div>
              </div>
            }
            {/*{deficiencesEndorsements && deficiencesEndorsements.length > 0 &&
              <div className="row mt-3">
                <div className="col-12">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">Endorsements Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTrTableEndorsements(deficiencesEndorsements)}
                    </tbody>
                  </table>
                </div>
              </div>
            }*/}

            <div className="row mt-2">
              <div className="col-sm">
                <label>Note</label>
                <textarea type="text" class="form-control" value={this.state.note} onChange={this.handleChangeNote}></textarea>
              </div>
            </div>
            <div className="row mt-3 mb-3 float-right">
              <div className="col-sm">
                <button type="button" disabled={this.state.disabledBtnSave} onClick={() => this.saveAndClose()} class="btn btn-primary">Save & Close</button>
                <button type="button" onClick={() => this.cancelSave()} class="btn btn-default">Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.certificates.usersList,
    deficiences: state.deficiences.deficiencesList,
    loggedInUser: state.login.profile,
    projectInsured: state.certificates.projectInsured,
    certificatesList: state.certificates.certificatesList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    certificateActions: bindActionCreators(certificateActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaivedForm);