import React from 'react';
import { reduxForm, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import renderSC from '../renderSC';

import * as scActions from '../../actions';

class UploadManuallyForm extends React.Component {

  componentWillUnmount() {
    this.props.reset();
  }

  onFileInputChange = () => {
    setTimeout(this.props.actions.sendSCFile, 0);
  }

  render() {
    const {handleSubmit} = this.props;
    const {
      buttonInvite,
      buttonCancel
    } = this.props.local.strings.subcontractors.addSCModal;

    return (
      <form
        onSubmit={handleSubmit}
        className="upload-file-form addsc-form-tab"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="array-forms-sc-wrapper">
                <FieldArray
                  name="newSCs"
                  component={renderSC}
                  rerenderOnEveryChange={true}
                  allowedToAddRows={true} />
              </div>
            </div>
          </div>
        </div>
        <div className="addsc-form-tab-buttons">
          <a onClick={this.props.close}>{buttonCancel}</a>
          <button className="bg-sky-blue-gradient bn">
            {buttonInvite}
          </button>
        </div>

      </form>
    );
  }
};

UploadManuallyForm = reduxForm({
  form: 'UploadManuallyForm',
  enableReinitialize: true,
})(UploadManuallyForm);

const mapStateToProps = (state, ownProps) => {
  const newSCs = state.sc.listOfSCManually;
  return {
    local: state.localization,
    sc: state.sc,
    initialValues: {
      newSCs
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(scActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadManuallyForm);