import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as regex from '../../../../lib/regex';

class Header extends Component {

  render() {
    const {
      nameLabel,
      subjectLabel,
      fromAddressLabel,
      ownerLabel,
      communicationTypeLabel,
      activityLabel,
      emailPlaceHolder,
      ownerPlaceholder,
      commTypePlaceholder,
      activityPlaceholder,
    } = this.props.local.strings.templateBuilder.header;

    const {
      templateName,
      subject,
      fromAddress,
      ownerId,
      communicationTypeId,
      templateActivityId,
    } = this.props.templateBuilder.template;

    return (
      <div className="row templateHeader" >

        <div className="col-md-6">
          <div className="paramContainer" >
            <div>
              <label className={templateName!==""?"":"mandatory"} >{nameLabel}:</label>
            </div>
            <input
              type="text"
              onChange={(e) => {this.props.onSetTemplateField('templateName', e.target.value)}}
              value={templateName} />
          </div>
          <div className="paramContainer" >
            <div>
              <label className={subject!==""?"":"mandatory"} >{subjectLabel}:</label>
            </div>
            <input
              type="text"
              onChange={(e) => {this.props.onSetTemplateField('subject', e.target.value)}}
              value={subject} />
          </div>
          {
            false?
            <div className="paramContainer" >
              <div>
                <label className={regex.EMAIL.test(fromAddress)?"":"mandatory"} >{fromAddressLabel}:</label>
              </div>
              <input
                type="text"
                placeholder={emailPlaceHolder}
                onChange={(e) => {this.props.onSetTemplateField('fromAddress', e.target.value)}}
                value={fromAddress} />
            </div>:null
          }

        </div>

        <div className="col-md-6">
          <div className="paramContainer" >
            <div>
              <label className={ownerId!==""?"":"mandatory"} >{ownerLabel}:</label>
            </div>
            <select
              value={ownerId}
              onChange={(e) => {this.props.onSetTemplateField('ownerId', e.target.value)}}>
              <option value="">--{ownerPlaceholder}--</option>
              {
                this.props.common.userHiringClients.map((item, idx) => {return (
                  <option key={idx} value={item.id}>{item.name}</option>
                )})
              }
            </select>
          </div>
          <div className="paramContainer" >
            <div>
              <label className={communicationTypeId!==""?"":"mandatory"} >{communicationTypeLabel}:</label>
            </div>
            <select
              value={communicationTypeId}
              onChange={(e) => {this.props.onSetTemplateField('communicationTypeId', e.target.value)}}>
              <option value="">--{commTypePlaceholder}--</option>
              {
                this.props.templates.communicationTypesPossibleValues.map((item, idx) => {return (
                  <option key={idx} value={item.id}>{item.description}</option>
                )})
              }
            </select>
          </div>
          <div className="paramContainer" >
            <div>
              <label className={templateActivityId!==""?"":"mandatory"} >{activityLabel}:</label>
            </div>
            <select
              value={templateActivityId}
              onChange={(e) => {this.props.onSetTemplateField('templateActivityId', e.target.value)}}>
              <option value="">--{activityPlaceholder}--</option>
              {
                this.props.templates.templateActivitiesPossibleValues.map((item, idx) => {return (
                  <option key={idx} value={item.id}>{item.name}</option>
                )})
              }
            </select>
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { templateBuilder, templates, common, localization } = state;
  return {
    templateBuilder,
    templates,
    common,
    local: localization
  };
};

export default connect(mapStateToProps)(Header);
