import React, { Component } from 'react';
import { connect } from 'react-redux';

class QuickView extends Component {
  render() {
    const { idx, column, local, row } = this.props;

    const {
      projectsTitle,
      holdersTitle,
    } = local.strings.insured.insuredList.popOver;

    return (
      <div
        id={`popover-positioned-bottom-user-${idx}`}
        className={`quickview-popover popover ${idx > 4 ? 'top' : 'bottom'}`}
      >
        <div className="popover-content">
          <div className="popoverheader">
            <h4 className="item-name">
              {column === 'holder' ? holdersTitle : projectsTitle}
            </h4>
          </div>
          <div className="popoverbody">
            {row.map((el, pos) => {
              return (
                <div key={pos}>
                  <div className="empty-separator"/>
                    {el}
                  <div className="empty-separator"/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
  };
};

export default connect(mapStateToProps)(QuickView);
