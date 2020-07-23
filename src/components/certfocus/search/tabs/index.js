import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tabs extends Component { 

  constructor(props) {
    super(props);

    this.state = {
      activeTab: ''
    };
  }

  componentDidMount() {
    this.setState({
      activeTab: Object.keys(this.props.tabs)[0]
    });
  }

  setActiveTab = (e, activeTab) => {
    e.preventDefault();
    this.setState({
      activeTab: activeTab
    });

    this.props.onChangeTab(activeTab);
  };

  render() {
    const renderedTabs = this.props.tabs;

    return (
      <div className="tab-frame">
        <ul className="profile-tabs nav nav-tabs">
          {
            Object.keys(renderedTabs).map((tab) => {
              return (
                <li className="tab-item" key={tab}>
                  <a
                    className={`tab-button ${this.state.activeTab === tab ? 'active' : ''}`}
                    onClick={e => this.setActiveTab(e, tab)}>{this.props.tabs[tab].label}</a>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
};

Tabs.propTypes = {
  tabs: PropTypes.instanceOf(Object).isRequired,
  onChangeTab: PropTypes.func.isRequired,
}

export default Tabs;