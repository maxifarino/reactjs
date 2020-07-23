import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as formActions from '../actions';

const Definitions = require('../../formBuilder/definitions');

class FormTableOfContents extends React.Component {
  constructor(props){
    super(props);

    this.renderContentItems = this.renderContentItems.bind(this);
    this.onItemClicked = this.onItemClicked.bind(this);
  }

  onItemClicked(item) {
    //console.log("item clicked:",item.caption);
    const { page } = this.props.formPreviewer;
    const type = item.type || Definitions.getFieldTypeNameById(item.typeId);
    let element = null;

    if (type === 'FormTitle'){
      element = document.getElementById('form-page-top');
    } else if (type === 'FormPage') {
      this.props.actions.setFormPreviewerPage(item.page);
    } else {
      if (page === item.page) {
        element = document.getElementById(`field-${item.id}`);
      } else {
        this.props.actions.setFormPreviewerPage(item.page);
        setTimeout(function () {
          element = document.getElementById(`field-${item.id}`);
          element.scrollIntoView(true);
        }, 200);
      }
    }

    if(element){
      element.scrollIntoView(true);
    }
  }

  renderContentItems(item, idx) {
    const type = item.type || Definitions.getFieldTypeNameById(item.typeId);
    let caption = '';
    let className = 'table-of-contents-item';
    switch (type) {
      case 'FormTitle':
        caption = `- Form title: ${item.caption}`;
        className += ' title-item';
        break;
      case 'FormPage':
        caption = `- ${item.caption}`;
        className += ' page-item';
        break;
      case 'SectionDivider':
        caption = `- ${item.caption}`;
        className += ' section-item';
        break;
      case 'Sub Section Divider':
        caption = `- ${item.caption}`;
        className += ' sub-section-item';
        break;
      default:

    }

    return (
      <div
        key={idx}
        className={className}
        onClick={()=>{this.onItemClicked(item)}}>
        {caption}
      </div>
    );
  }

  render() {
    const contentItems = this.props.formPreviewer.tableOfContentItems;

    const tabStyle = this.props.fromTab? {height: 'auto'}:{}

    return (
      <div className="col-sm-12 col-md-4 bg-blue-gradient form-table-of-contents" style={tabStyle}>
        {
          contentItems.length>0?
            <div className="table-of-contents-title">
              Table of Contents
            </div>:null
        }
        <div className="table-of-contents-list">
          {contentItems.map(this.renderContentItems)}
        </div>
      </div>
    );
  }

}

  const mapStateToProps = (state, ownProps) => {
    return {
      formPreviewer: state.formPreviewer,
      local: state.localization,
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(formActions, dispatch)
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(FormTableOfContents);
