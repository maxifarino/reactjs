import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import { bindActionCreators } from 'redux';

import * as insuredActions from '../../actions';

import 'react-toggle/style.css';

class AddTagsToInsuredModal extends Component {
  onToggleChange = (e, tag) => {
    this.props.insuredActions.sendTag(tag, e.target.checked);
  }

  renderTags = (tags) => {
    const { fetchingTags } = this.props.insuredDetails;

    return tags.map((tag, idx) => {
      const assignedTags = this.props.insuredDetails.tags.assignedTags.data;

      const checked = assignedTags.find(el => el.Id === tag.Id);
      const isLoading = fetchingTags.find(fetchingTag => fetchingTag === tag.Id);

      return (
        <div className="col-md-6 mb-3" key={idx}>
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <div>{tag.Name}</div>
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <Toggle
                disabled={isLoading ? true : false}
                checked={checked ? true : false}
                onChange={(e) => this.onToggleChange(e, tag)}
              />
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    const {
      title,
      closeBtn,
    } = this.props.local.strings.insured.addTagToInsuredModal;

    if (this.props.insuredDetails.fetchingAllTags) {
      return (
        <div className="spinner-wrapper">
          <div className="spinner" />
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
                  {this.renderTags(this.props.insuredDetails.tags.allTags.data)}
                </div>                
              </div>  
              { this.props.insuredDetails.tags.allTags.data.length === 0 &&
                <span className="label">There is no available tags to add.</span>
              }            
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
    insuredDetails: state.insuredDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    insuredActions: bindActionCreators(insuredActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTagsToInsuredModal);
