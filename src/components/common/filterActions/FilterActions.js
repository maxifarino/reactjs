import React from 'react';
import { reset } from 'redux-form';

import './FilterActions.css';

class ResetFormButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.dispatch(reset(this.props.formName));
  }

  render() {
    return (
      <div className="filter-actions">
        <div className="list">
          <div className="list-item">
            <button className="list-view-nav-link nav-bn filter-button" type="submit">SEARCH</button>
          </div>
          <div className="list-item">
            <button className="list-view-nav-link nav-bn filter-button" type="submit" onClick={this.handleClick}>RESET</button>
          </div>
        </div>
      </div>
    );
  }
};

export default ResetFormButton;