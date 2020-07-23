import React from 'react';
import { connect } from 'react-redux';

const LocationQuickView = (props) => {
  const {
    labelAddress,
    labelCity,
    labelState,
    labelZipCode,
    labelCountry,
    labelComments,
    labelActive,
    labelPrimaryShort,
    labelPhone,
    labelFax,
    labelContactNameShort,
    labelContactEmailShort
  } = props.local.strings.scProfile.ChangeLocationsModal.modal;

  const {
     Address, 
     City, 
     State, 
     ZipCode, 
     CountryName, 
     Comments, 
     Active, 
     PrimaryLocation, 
     Phone, 
     Fax, 
     ContactName, 
     ContactEmail
  } = props.location

  const labelCol = 3 
  const itemCol = 9

  return (
    <div
      id={`popover-positioned-bottom-user-${props.idx}`}
      className={`quickview-popover popover ${props.idx}-role top locationPopover`}>
      <div className="popover-content">
        <div className="popoverheader">
          <h4 className="item-name">
            {City}, {State != 'N/A' && State ? State : CountryName} Location
          </h4>
        </div>
        <div className="popoverbody location">
          <div className='locationRowTop'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelAddress}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{Address}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelCity}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{City}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelZipCode}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{ZipCode}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelState}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{State != 'null' && State ? State : 'N/A'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelCountry}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{CountryName}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelActive}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{Active ? 'Yes' : 'No'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelPrimaryShort}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{PrimaryLocation ? 'Yes' : 'No'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelPhone}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{Phone != 'null' && Phone ? Phone : 'Not Provided'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelFax}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{Fax != 'null' && Fax ? Fax : 'Not Provided'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelContactNameShort}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{ContactName != 'null' && ContactName ? ContactName : 'Not Provided'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRow'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelContactEmailShort}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{ContactEmail != 'null' && ContactEmail ? ContactEmail : 'Not Provided'}</span>
          </div>
          <div className="empty-separator"></div>
          <div className='locationRowBottom'>
            <span className={`item-location-label col-sm-${labelCol}`}>{labelComments}:</span>
            <span className={`item-location col-sm-${itemCol}`}>{Comments != 'null' && Comments ? Comments : 'Not Provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization
  }
};

export default connect(mapStateToProps)(LocationQuickView);
