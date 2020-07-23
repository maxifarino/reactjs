import React from 'react';
import {Link, withRouter} from 'react-router-dom';

class RenderList extends React.Component {
  render() {
    return (
      <div className="render-list">
        {this.props.toggled ? <span>Navigation</span> : null}
        <ul className={this.props.toggled ?  'nav-list-extended' : 'nav-list'}>
          {this.props.list.map((navlistItem, idx) => 
            <li key={idx} className={this.props.toggled ? 'extended-list' : ''}>
              <Link 
                onClick={()=> this.props.toggleSideBar(false)}
                className={`sidebar-link ${navlistItem.icon} parent`} 
                to={navlistItem.to}>
                {navlistItem.title}
              </Link>
              {this.props.toggled ? navlistItem.child.map((child, idc)=> (
                <Link
                  onClick={()=> {
                    this.props.toggleSideBar(false);

                    if(child.action) {
                      child.action()
                    }
                  }}
                  className="sidebar-link child"
                  key={idc}
                  to={child.to}>
                  {child.title}
                </Link>
              )) : null}
            </li>
          )}
        </ul>
      </div>
    )
  };
};

export default withRouter(RenderList);