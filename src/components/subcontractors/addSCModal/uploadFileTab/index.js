import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UploadFileForm from './form';
import SCFileInputForm from './scFileInputForm';
import * as scActions from '../../actions';

class UploadFileTab extends React.Component {

  submit = values => {
    // console.log('values = ', values)
    this.props.actions.sendSCList(values.newSCs, this.props.close);
    // this.props.actions.sendSCList(values.newSCs, null);
  };

  render() {
    return (
      <section className="addsc-tab-body">
        <div className="admin-form-field-wrapper">
          <SCFileInputForm />
          <UploadFileForm
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileTab);
