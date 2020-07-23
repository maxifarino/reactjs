import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as actions from '../actions';

import Utils from '../../../lib/utils';

let TimeOut = null;
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRecipient: '',
      showSuggestions: false
    };

    this.onSearchRecipientChange = this.onSearchRecipientChange.bind(this);
    this.getSuggestedRecipients = this.getSuggestedRecipients.bind(this);

    this.renderRecipient = this.renderRecipient.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
    this.hideSuggestions = this.hideSuggestions.bind(this);

  }

  componentDidMount() {
    const {holderId, recipients, templateId} = this.props.mailData;
    if (holderId && this.props.system == 'cf') {
      this.props.setMailHiringClientId(holderId);

      if (recipients.length > 0) {
        this.props.setMailRecipeints(recipients);
      }

      if (templateId) {
        setTimeout(() => {
          this.props.actions.setMailTemplate(templateId, this.props.templates.list)
        },500)
      }

    }
  }

  onSearchRecipientChange (e) {
    this.setState({searchRecipient: e.target.value});
  }

  getSuggestedRecipients () {
    let suggestions = Utils.searchItems(this.props.mailComposer.possibleRecipients, this.state.searchRecipient);
    suggestions = _.differenceWith(suggestions, this.props.mailComposer.recipients, function(a,b){
      return a.id === b.id;
    });

    return suggestions;
  }

  renderSuggestion(suggestion, idx) {
    const self = this;
    const label = `${suggestion.fullName} (${suggestion.Mail})`;

    const addRecipient = function() {
      const recipients = self.props.mailComposer.recipients;
      const index = _.findIndex(recipients, function(r) { return r.id === suggestion.id; });
      if (index === -1) {
        recipients.push(suggestion);
        self.props.setMailRecipeints(recipients);
        self.setState({searchRecipient: ''});
      }
    }

    return (
      <div key={idx} className="recipientSuggestion" onClick={addRecipient} >
        {label}
      </div>
    );
  }

  renderRecipient(recipient, idx) {
    const self = this;
    const label = `${recipient.fullName} (${recipient.Mail})`;

    const removeRecipient = function() {
      const recipients = self.props.mailComposer.recipients;
      const index = _.findIndex(recipients, function(r) { return r.id === recipient.id; });
      if (index !== -1) {
        recipients.splice(index, 1);
        self.props.setMailRecipeints(recipients);
      }
    }

    return (
      <span key={idx} className="used-email" >
        {label}
        <i className="linear-icon-cross clear-email" onClick={removeRecipient} />
      </span>
    );
  }

  // use timeout to give the ui time to click users
  showSuggestions() {
    if(TimeOut){
      clearTimeout(TimeOut);
      TimeOut = null;
    }
    this.setState({showSuggestions: true});
  }
  hideSuggestions() {
    if(TimeOut){
      clearTimeout(TimeOut);
      TimeOut = null;
    }
    const self = this;
    TimeOut = setTimeout(function() {
      self.setState({showSuggestions: false});
    }, 200);
  }

  render() {
    const {system} = this.props;

    let header = this.props.local.strings.mailComposer.header
    if (system == 'cf') {
      header = this.props.local.strings.mailComposer.headerCF
    }

    const {
      hiringClientLabel,
      recipientsLabel,
      recipientsPlaceholder,
      pickHCFirstLabel,
      subjectLabel,
      subjectPlaceholder,
      selectHCHolder,
      subcontractorLabel,
      subcontractorPlaceholder,
      dueDateLabel,
      taskDetailLabel,
      templateLabel,
      templatePlaceholder,
      projectsLabel,
      selectProjectHolder,
    } = header;

    const suggestions = this.getSuggestedRecipients();

    let hint = "";
    if(this.props.mailComposer.hiringClientId === ""){
      hint = pickHCFirstLabel;
    }

    const recipientsLabelClass = this.props.mailComposer.recipients.length > 0?"":"mandatory";
    const subjectLabelClass = this.props.mailComposer.mail.subject !== ""?"":"mandatory";

    const { projectId, insuredId, templateId} = this.props.mailData;

    return (
      <div className="row mailHeader" >

        <div className="col-md-6">
          <div className="hcContainer" >
            <div>
              <label>{hiringClientLabel}:</label>
            </div>
            <select
              value={this.props.mailComposer.hiringClientId}
              onChange={(e) => {this.props.setMailHiringClientId(e.target.value)}}>
              <option value="">--{selectHCHolder}--</option>
              {
                this.props.common.userHiringClients.map((item, idx) => {return (
                  <option key={idx} value={item.id}>{item.name}</option>
                )})
              }
            </select>
          </div>
          <div className="recipientsContainer" >
            <div>
              <label className={recipientsLabelClass} >{recipientsLabel}: {hint}</label>
            </div>
            <input
              type="text"
              placeholder={recipientsPlaceholder}
              onChange={this.onSearchRecipientChange}
              value={this.state.searchRecipient}
              onFocus={this.showSuggestions}
              onBlur={this.hideSuggestions}
            />
            {
              this.state.showSuggestions && suggestions.length > 0?
                <div className="suggestions-container">
                  {suggestions.map(this.renderSuggestion)}
                </div>
                :null
            }
            {
              this.props.mailComposer.recipients.length > 0?
                <div className="emails-container">
                  {this.props.mailComposer.recipients.map(this.renderRecipient)}
                </div>
                :null
            }
          </div>

          <div className="subjectContainer" >
            <div>
              <label className={subjectLabelClass} >{subjectLabel}:</label>
            </div>
            <input
              type="text"
              placeholder={subjectPlaceholder}
              onChange={(e) => {this.props.setMailSubject(e.target.value)}}
              value={this.props.mailComposer.mail.subject} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="scContainer" >
            <div>
              <label>{subcontractorLabel}: {hint}</label>
            </div>
            <select
              onChange={(e) => {this.props.setMailSubcontractorId(e.target.value)}}>
              <option value="">--{subcontractorPlaceholder}--</option>
              {
                this.props.mailComposer.possibleSubcontractors.map((item, idx) => {return (
                  <option key={idx} value={item.id} selected={(item.id == insuredId)}>{item.name}</option>
                )})
              }
            </select>
          </div>
          {(system == 'cf')?
            <div className="hcContainer" >
              <div>
                <label>{projectsLabel}:</label>
              </div>
              <select>
                <option value="">--{selectProjectHolder}--</option>
                {
                  this.props.mailComposer.possibleProjects.map((item, idx) => {
                    return (
                    <option key={idx} value={item.id} selected={(projectId == item.id)} >{item.name}</option>
                  )}
                  )
                }
              </select>
            </div>
            :
            <React.Fragment>
              <div className="dueDateContainer" >
                <div>
                  <label>{dueDateLabel}:</label>
                </div>
                <input
                  type="date"
                  onChange={(e) => {this.props.setMailDueDate(e.target.value)}}
                  value={this.props.mailComposer.dueDate} />
              </div>
              {
                this.props.mailComposer.dueDate !== ""?
                  <div className="taskDetailContainer" >
                    <div>
                      <label>{taskDetailLabel}:</label>
                    </div>
                    <input
                      type="text"
                      onChange={(e) => {this.props.setMailTaskDetail(e.target.value)}}
                      value={this.props.mailComposer.taskDetail} />
                  </div>:null
              }
            </React.Fragment>
          }
          <div className="scContainer" >
            <div>
              <label>{templateLabel}</label>
            </div>
            <select
              onChange={(e) => {this.props.actions.setMailTemplate(e.target.value, this.props.templates.list)}}>
              <option value="">--{templatePlaceholder}--</option>
              {
                 this.props.templates.list.map((item, idx) => {return (
                  <option key={idx} value={item.id} selected={(item.id == templateId)}>{item.templateName}</option>
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
  const { mailComposer, common, localization, templates } = state;
  return {
    mailComposer,
    common,
    templates,
    local: localization
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
