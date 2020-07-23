import React from 'react';
import { connect } from 'react-redux';

const UserQuickView = (props) => {
  let { HCTitle, SCTitle, buttonMoreLogs } = props.local.strings.users.rowPopOver;

  const { Role, CFRole } = props.login.profile;
  const { popoverSubContractors, popoverLogs } = props.users;
  const statusClass = (props.row.status.toLowerCase()).replace(/\s/g, '');
  const statusLabel = props.row.status.length > 11 ? `${props.row.status.substring(0, 11)}...` : props.row.status;
  const nameLabel = props.row.name.length > 11 ? `${props.row.name.substring(0, 11)}...` : props.row.name;
  const AssociatedHCsOfSC = props.row.AssociatedHCsOfSC ? props.row.AssociatedHCsOfSC : ''
  // console.log('AssociatedHCsOfSC =  ', AssociatedHCsOfSC)
  // console.log('popoverSubContractors = ', popoverSubContractors)

  const HCsOfSCsList = AssociatedHCsOfSC.split(', ')

  const popoverHiringClients = []

  if (AssociatedHCsOfSC) {
    for (let i=0; i<HCsOfSCsList.length; i++) {
      popoverHiringClients.push({
        HiringClientsIdx: i,
        name: HCsOfSCsList[i]
      })
    }
  }

  return (
    <div
      id={`popover-positioned-bottom-user-${props.idx}`}
      className={`quickview-popover popover ${statusClass}-role ${props.idx > 4 ? 'top' : 'bottom'}`}>
      <div className="popover-content">
        <div className="popoverheader">
          <h4 className="item-name">
            {nameLabel}
          </h4>
          <span className={`item-status ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
        <div className="popoverbody">
          {
            Role && props.row.extraUserInfo.role &&
            <span className="item-role">{props.row.extraUserInfo.role}</span>
          }
          {
            CFRole && props.row.extraUserInfo.cfRole &&
            <span className="item-role">{props.row.extraUserInfo.cfRole}</span>
          }
          <span className="item-email">{props.row.email}</span>
          <span
            className="item-phone"
            style={{display: props.row.extraUserInfo.phone ? 'inline-block' : 'none'}}>{props.row.extraUserInfo.phone}</span>
          {
            props.users.fetchingPopOverHC || props.users.fetchingPopOverSC ?
            <div className="spinner-wrapper fetching-popover">
              <div className="spinner"></div>
            </div> :
            null
          }
          <div></div>
          {
            (popoverHiringClients && popoverHiringClients.length > 0) ?
            <div className="hiringclients quickview-list-wrapper">
              <h5>{HCTitle}</h5>
              <ul className="hiringclients-list quickview-list">
                {popoverHiringClients.map((hc, HiringClientsIdx) => <li key={HiringClientsIdx}> {hc.name} </li>)}
              </ul>
            </div> :
            null
          }

          <div className="empty-separator"></div>

          {
            (popoverSubContractors && popoverSubContractors.length > 0)
              ? <div className="subcontractors quickview-list-wrapper">
                  <h5>{SCTitle}</h5>
                  <ul className="subcontractors-list quickview-list">
                    {popoverSubContractors.map((sc, SubContractorsIdx) => <li key={SubContractorsIdx}> {sc.name} </li>)}
                  </ul>
                </div>
              :
            null
          }

          {
            (popoverLogs && popoverLogs.length > 0) ?
              <div>
                <div className="item-log-quickview quickview-list-wrapper">
                  <h5 className="icon-log">User log:</h5>
                  <ul className="user-log-list quickview-list">
                    {popoverLogs.map((logItem, userLogIdx) => {
                      return (
                        <li key={userLogIdx}>
                          <span className="item-log-itemname">
                            {
                              `${logItem.name}`
                            }
                          </span>
                          <span className="log-activity">
                            {/* {
                              ` ${logItem.eventType === 1 ? 'created the form' : 'something happened to'} `
                            }  */}
                            {
                              ` ${logItem.description} `
                            }
                          </span>
                          <span className="target-link">
                            {
                              logItem.payload === '12' ? 'S-C-invite' : 'target placeholder'
                            }
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="line-separator"></div>
                <div className="more-logs">
                  <button className="bn-more-logs nav-bn">
                    {buttonMoreLogs}
                  </button>
                </div>
              </div> : null
          }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    local: state.localization,
    login: state.login
  }
};

export default connect(mapStateToProps)(UserQuickView);
