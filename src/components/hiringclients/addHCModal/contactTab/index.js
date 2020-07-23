import React from 'react';
import { connect } from 'react-redux';
import serialize  from 'form-serialize';
import { addSerializedHcData } from '../../actions';
import ContactForm from './form';

class ContactTab extends React.Component {

  submit = values => {
    let form = document.querySelector('.contact-info-form');
    let _serializedHcObj = serialize(form, { hash: true });
    this.props.addSerializedHcData({ contactInfo: _serializedHcObj });
    this.props.continueHandler();
  };

  render() {
    const {
      title
    } = this.props.local.strings.hiringClients.addHCModal.contactTab;
    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <h2 className="step-title">{title}</h2>
          <ContactForm
            close={this.props.close}
            onSubmit={this.submit}
            profile={this.props.profile} />
          <div className="save-hc-modal-error">{this.props.hc.errorHC}</div>
        </div>
      </section>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    hc: state.hc
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSerializedHcData: (serializedHcObj) => {
      dispatch(addSerializedHcData(serializedHcObj))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactTab);
