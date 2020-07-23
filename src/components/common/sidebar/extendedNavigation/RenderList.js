import React from 'react';
import {Link, withRouter} from 'react-router-dom';

class RenderList extends React.Component {
  render() {
    return (
      <div className="render-list">
        <ul className="nav-list">
          {this.props.list.map((navlistItem, idx) =>
            <li key={idx}>
              <Link className="sidebar-link icon-record" to="/">{navlistItem.title}</Link>
            </li>
          )}
        </ul>
      </div>
    )
  };
};

export default withRouter(RenderList);