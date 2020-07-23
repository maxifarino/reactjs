import React from 'react';
import { withRouter } from 'react-router-dom';

const ProfileSidebar = (props) => {
  const { header, sections } = props.sidebar;
  const { logo } = header;

  return (
    <div className="profile-sidebar profile-column-inner">
      <div className="profile-sidebar-content">
        {logo &&
          <section className="sidebar-header col-sm-4">
            <div className="logo-wrapper">
              <img
                className="logo"
                src={logo}
                alt="logo"
              />
            </div>
          </section>
        }
        {sections.map((section, idx) => {
          const { subsections } = section;
          return(
            <section className="sidebar-section col-sm-9" key={idx}>

              {subsections.map((subsection, jdx) => {
                const { label, value } = subsection;
                return (
                  value ?
                  <div className="sidebar-item col-sm-6" key={jdx}>
                    { label && <span className="item-label">{label}</span> }
                    <span className="item-value">{value}</span>
                  </div> :
                  null
                );
              })}
              <div className="col-sm-6" />
              <button onClick={props.onEditProfile} className="sidebar-button col-sm-3">Edit Profile</button>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default withRouter(ProfileSidebar);
