import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UploadManuallyForm from './form';
import * as scActions from '../../actions';

class UploadManuallyTab extends React.Component {

  submit = values => {
    // console.log('values = ', values)
    this.props.actions.sendSCList(values.newSCs, this.props.close, true);
    // this.props.actions.sendSCList(values.newSCs, null, true);
  };

  render() {
    return (
      <section className="addsc-tab-body">
        <div className="admin-form-field-wrapper">
          <UploadManuallyForm
            close={this.props.close}
            onSubmit={this.submit} />
        </div>
      </section>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    sc: state.sc
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(scActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadManuallyTab);
