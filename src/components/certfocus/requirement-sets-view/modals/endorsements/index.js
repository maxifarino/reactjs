import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import { bindActionCreators } from 'redux';

import * as reqSetsViewActions from '../../actions';

import 'react-toggle/style.css';

class AddEndorsementsModal extends Component {
  componentDidMount() {
    const { requirementSet, holderId } = this.props;
    
    this.props.reqSetsViewActions.fetchEndorsements(requirementSet.Id, holderId);
  }

  handleEndorsementChange = (e, endorsement, requirementSetEndorsementId) => {
    const { Id } = this.props.requirementSet;

    this.props.reqSetsViewActions.sendEndorsement({
      checked: e.target.checked,
      endorsementId: endorsement,
      requirementSetId: Id,
      requirementSetEndorsementId,
    });
  }

  renderEndorsements = (endorsements) => {
    const { reqSetEndorsements, endorsementsFetching } = this.props.holderRequirementSetsView;

    return endorsements.map((endorsement) => {
      const selected = reqSetEndorsements.find(reqSetEndorsement => reqSetEndorsement.EndorsementID === endorsement.Id);
      const loading = endorsementsFetching.find(endorsementId => endorsementId === endorsement.Id);

      return (
        <div className="col-md-6 d-flex align-items-center" key={endorsement.Id}>
          <Toggle
            onChange={(e) => this.handleEndorsementChange(e, endorsement.Id, selected ? selected.RequirementSet_EndorsementID : undefined)}
            checked={selected ? true : false}
            disabled={loading ? true : false}
          />
          <h5 className="mb-0 ml-2">{endorsement.Name}</h5>
        </div>
      );
    });
  }

  render() {
    const {
      title,
      closeBtn,
    } = this.props.local.strings.holderRequirementSetsView.addEndorsementModal;

    if (this.props.holderRequirementSetsView.allEndorsementsFetching) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner" />
        </div>
      );
    } else if (this.props.holderRequirementSetsView.allEndorsementsError) {
      return (
        <div className="text-center text-danger">
          {this.props.holderRequirementSetsView.allEndorsementsError}
        </div>
      );
    }

    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header ml-0">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <div className="entity-info-form">
              <div className="color-green-dark">
                <div className="row">
                  {this.renderEndorsements(this.props.holderRequirementSetsView.allEndorsements)}
                </div>
              </div>

              <div className="add-item-bn">
                <button className="bn bn-small bg-green-dark-gradient create-item-bn" onClick={this.props.close}>
                  {closeBtn}
                </button>
              </div>
            </div>
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
    holderRequirementSetsView: state.holderRequirementSetsView,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reqSetsViewActions: bindActionCreators(reqSetsViewActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEndorsementsModal);
