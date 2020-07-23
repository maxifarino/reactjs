import React, { Component } from 'react';
import {connect} from 'react-redux';

class Footer extends Component {

  render() {
    const {
      saveBtn,
      discardBtn,
      dateLabel,
      creatorLabel,
    } = this.props.local.strings.templateBuilder.footer;

    const {
      templateCreator,
      dateCreation
    } = this.props.templateBuilder.template;

    let date = dateCreation && dateCreation!==''? new Date(dateCreation).toDateString():'';

    return(
      <div className="builderFooter">
        <div className="column">
          {
            date && date !== ""?
              <div className="builderRow">
                <span className="text">{dateLabel}: </span> <span className="text2">{date}</span>
              </div>:null
          }
          {
            templateCreator && templateCreator !== ""?
              <div className="builderRow">
                <span className="text">{creatorLabel}: </span> <span className="text2">{templateCreator}</span>
              </div>:null
          }
        </div>
        <div className="builderRow">
          <button className="btn-transparent" onClick={this.props.onDiscardTemplate}>{discardBtn}</button>
          <button className="button2" onClick={this.props.saveTemplate}>{saveBtn}</button>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  const { templateBuilder, localization } = state;
  return {
    templateBuilder,
    local: localization
  };
};

export default connect(mapStateToProps)(Footer);
