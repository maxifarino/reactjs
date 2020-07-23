import React from 'react';
import {connect} from 'react-redux';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LogoButton from '../../communication-templates/builder/editor/logoButton';

const toolbar = {
  options: ['inline', 'list', 'textAlign', 'link', 'image',],
  inline: {
    inDropdown: false,
    className: 'editor-btn-group',
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline',],
    bold: { className: 'editor-btn-left' },
    italic: { className: 'editor-btn' },
    underline: { className: 'editor-btn-right' }
  },
  list: {
    inDropdown: false,
    className: 'editor-btn-group',
    component: undefined,
    dropdownClassName: undefined,
    options: ['unordered', 'ordered', 'indent', 'outdent'],
    unordered: { className: 'editor-btn-left' },
    ordered: { className: 'editor-btn  icon-numbered-list' },
    indent: { className: 'editor-btn icon-increase-indent' },
    outdent: { className: 'editor-btn-right icon-decrease-indent' },
  },
  textAlign: {
    inDropdown: false,
    className: 'editor-btn-group',
    component: undefined,
    dropdownClassName: undefined,
    options: ['left', 'center', 'right', 'justify'],
    left: { className: 'editor-btn-left' },
    center: { className: 'editor-btn' },
    right: { className: 'editor-btn' },
    justify: { className: 'editor-btn-right' },
  },
  link: {
    inDropdown: false,
    className: 'editor-btn-group ',
    component: undefined,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_self',
    options: ['link'],
    link: { className: 'editor-btn-alone icon-link' }
  },
  image: {
    className: 'editor-action-btn icon-img',
    component: undefined,
    popupClassName: undefined,
    urlEnabled: true,
    uploadEnabled: false,
    alignmentEnabled: true,
    uploadCallback: undefined,
    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: 'auto',
      width: 'auto',
    },
  }
};

class TemplateEditor extends React.Component {
  constructor(props) {
    super(props);
    this.setDomEditorRef = ref => this.domEditor = ref;
    this.updateMailProps = this.updateMailProps.bind(this)
    this.onChange = this.onChange.bind(this)
  };

  componentDidMount(){
    this.domEditor.focusEditor();
  };

  componentDidUpdate(prevProps) {
    if (this.props.mailComposer.template !== prevProps.mailComposer.template) {
      this.updateMailProps(this.props.mailComposer.template.bodyHTML)
    }
  }

  onChange(editorState){
    const text = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    this.props.setMailEditorState(editorState, text);
  };

  updateMailProps(mailBodyHtml) {
    let editorState;
    if (mailBodyHtml) {
      const blocksFromHTML = convertFromHTML(mailBodyHtml);
      if(blocksFromHTML.contentBlocks){
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        editorState = EditorState.createWithContent(state);
      } else {
        editorState = EditorState.createEmpty();
      }
    } else {
      editorState = EditorState.createEmpty();
    }
    const text = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    this.props.setMailEditorState(editorState, text);
  }

  focus = () => {
    this.domEditor.focusEditor();
  }

  render() {
    return (
      <div className="editorContainer">
        <div className="editor-column">
          <div className="editor" onClick={this.focus} >
            <Editor
              editorState={this.props.mailComposer.editorState}
              toolbarClassName="editorHeader"
              wrapperClassName="wrapperClassName"
              editorClassName="editor-class"
              onEditorStateChange={this.onChange}
              toolbar={toolbar}
              toolbarCustomButtons={[<LogoButton />]}
              ref={this.setDomEditorRef}
            />
          </div>
        </div>
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  const { mailComposer, templateBuilder } = state;
  return {
    mailComposer,
    templateBuilder
  };
};

export default connect(mapStateToProps)(TemplateEditor);
