import React from 'react';
import {connect} from 'react-redux';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LogoButton from './logoButton';

import Utils from '../../../../lib/utils';

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
    this.state = {
      searchText: ''
    };
    this.setDomEditorRef = ref => this.domEditor = ref;
    let editorState;

    if (props.templateBuilder.template.bodyHTML) {
      const blocksFromHTML = convertFromHTML(props.templateBuilder.template.bodyHTML);
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

    props.setTemplateEditorState(editorState);

    this.onChange = (editorState) => {
      props.setTemplateEditorState(editorState);
    };
  };

  componentDidMount(){
    this.domEditor.focusEditor();
  };

  focus = () => {
    this.domEditor.focusEditor();
  }

  onSearchTextChange = (e) => {
    const newState = this.state;
    newState.searchText = e.target.value;
    this.setState(newState);
  }

  renderPlaceholder = (ph, idx) => {
    const onDragStart = function(e) {
      let txt = `<%= ${ph.placeholder} %>`;
      e.dataTransfer.setData("text", txt);
    };

    return <a key={idx} className='side-menu-btn' draggable="true" onDragStart={onDragStart} >{ph.name}</a>
  }

  getSuggestedPlaceholders = () => {
    const suggestions = Utils.searchItems(this.props.templateBuilder.commPlaceholders, this.state.searchText);
    return suggestions.slice(0,9);
  }

  render() {
    const placeholders = this.getSuggestedPlaceholders();

    return (
      <div className="editorContainer">
        <div className="editor-column">
          <div className="editor" onClick={this.focus} >
            <Editor
              editorState={this.props.templateBuilder.editorState}
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
        <div className="editor-side-menu">
          <p className="side-menu-subtitle">INSERT PLACEHOLDER:</p>
          <input
            value={this.state.searchText}
            placeholder="Search Placeholder"
            onChange={this.onSearchTextChange}
          />
          <p>Suggested Placeholders:</p>
          <div className="placeholdersContainer">
            { placeholders.map(this.renderPlaceholder) }
          </div>
        </div>
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  const { templateBuilder } = state;
  return {
    templateBuilder
  };
};

export default connect(mapStateToProps)(TemplateEditor);
