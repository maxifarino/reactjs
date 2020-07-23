import React from 'react';
import ProfileSidebar from './sidebar';
import './profile.css';

const ProfileFrame = (props) => {
  return (
    <div className="profile-view-wrapper">
      <div className="profile-view">
        <div className="col-sm-12 profile-sidebar-column profile-column">
          <ProfileSidebar onEditProfile={props.onEditProfile} sidebar={props.sidebar}/>
        </div>
        <div className="col-sm-12 profile-main-column profile-column">
          <div className="profile-main profile-column-inner">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFrame;