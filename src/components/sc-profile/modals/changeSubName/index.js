import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from '../../../../lib/utils'

import * as actions from '../../actions';

import './changeSubNameModal.css';

class ChangeSubNameModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subName: this.props.subName || '',
      processing: false
    }

    this.onChangeName = this.onChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  // componentDidMount() {
  //   this.setState({
  //     location: this.props.location
  //   })
  // }

  onChangeName(value) {
    this.setState({subName: value});
  }

  handleSubmit() {
    this.setState({ processing: true });
    const
      { scId } = this.props,
      { subName } = this.state;

    const payload = {
      scId,
      subName: utils.replaceQuotes(subName)
    }

    this.props.actions.changeSCname(payload, (success) => {
      if (success) {
        this.props.successCallback(this.props.close);
      } else {
        this.setState({ processing: false });
      }
    });

  }

  render() {
    const {
      title,
      nameLabel,
      cancelBtn,
      saveBtn
    } = this.props.local.strings.scProfile.changeSubNameModal;

    let displayName = utils.displayQuotes(this.state.subName)

    return (
      <div className="change-status-modal">
        <header className="change-status-modal-header">{title}</header>

        <div className="change-status-content container-fluid filter-fields">
          <div className="row">
            <div className="col-md-12">
              {
                this.state.processing?
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                  </div>
                  :
                  <div className="statusContainer" >
                    <div>
                      <label>{nameLabel}:</label>
                    </div>
                      <input
                        placeholder={displayName}
                        onChange={(e) => this.onChangeName(e.target.value)}
                        type="text"
                      />
                  </div>
              }
            </div>
          </div>

          {
            !this.state.processing?
              <div className="text-right">
                <button className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelBtn}</button>
                <button className="bg-sky-blue-gradient bn action-button" onClick={this.handleSubmit}>{saveBtn}</button>
              </div>
              :
              null
          }

        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    sc: state.sc,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeSubNameModal);
