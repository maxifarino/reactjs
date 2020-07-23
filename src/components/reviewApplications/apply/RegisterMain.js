import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as applyActions from './actions';
import ApplyRegister from './applyRegister';

class RegisterMain extends React.Component {

  render() {
    let {
      title,
      instruction,
      suggestion,
    } = this.props.local.strings.register.applyMain;

    return (
      <div className="col-sm-12 col-md-8 register-main">
        <div className="register-main-header">
          <h1 className="register-title">{title}</h1>
          <p className="register-instr">{instruction}</p>
          <p className="register-instr">{suggestion}</p>
        </div>
        <div className="tabs-frame">

          <div className="tab-content">
            <div className={`tab-pane step1 active`}>
              <ApplyRegister />
            </div>
          </div>

        </div>
      </div>

    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    apply: state.apply,
    local: state.localization
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(applyActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMain);
