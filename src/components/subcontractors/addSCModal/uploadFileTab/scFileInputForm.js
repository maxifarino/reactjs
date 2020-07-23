import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import fileInput from '../../../customInputs/fileInput';
import * as scActions from '../../actions';
import validate from './validation';

class SCFileInputForm extends React.Component {
  
  onFileInputChange = () => {
    setTimeout(this.props.actions.sendSCFile, 0);
  }

  render() {
    const {
      scFileLabel
    } = this.props.local.strings.subcontractors.addSCModal;

    return (
      <form 
        className="upload-file-form addsc-form-tab"
      >
        <div className="container-fluid">

          <div className="row">
            <div className="col-sm-12">
              <div className="upload-file-wrapper">
                <label htmlFor="csvSCDataFile" className='csv'>
                  {
                    this.props.sc.displayFileName 
                      ? `File to be uploaded: ${this.props.sc.displayFileName}`
                      : scFileLabel
                  }
                </label>
                <Field
                  name="csvSCDataFile"
                  id="csvSCDataFile"
                  component={fileInput}
                  onChange={this.onFileInputChange}
                  />
              </div>
            </div>  
          </div>
          
        </div>
        
      </form>
    );
  }
};

SCFileInputForm = reduxForm({
  form: 'SCFileInputForm',
  validate
})(SCFileInputForm);

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

export default connect(mapStateToProps, mapDispatchToProps)(SCFileInputForm);