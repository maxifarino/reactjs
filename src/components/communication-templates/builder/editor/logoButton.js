import React, { Component } from 'react';
import { AtomicBlockUtils } from 'draft-js';
import PropTypes from 'prop-types';

class LogoButton extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addLogo = () => {
    const { editorState, onChange } = this.props;
    const entityData = {
      src: "http://www.prequalusa.com/wp-content/uploads/2015/08/logo.png",
      height: "auto",
      width: "215px",
      alt: "logo"
    };
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('IMAGE', 'MUTABLE', entityData)
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' ',
    );
    onChange(newEditorState);
  };

  render() {
    return (
      <div className="rdw-link-wrapper editor-btn-group">
        <div className="editorLogoButton" onClick={this.addLogo}>INSERT LOGO</div>
      </div>
    );
  }
}

export default LogoButton;
