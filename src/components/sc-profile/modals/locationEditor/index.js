import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LocationForm from './form';
import * as actions from '../../actions';
import Utils from '../../../../lib/utils'
import './locationeditor.css';

class LocationEditorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingNoteId: false,
    }

    this.saveLocation = this.saveLocation.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
  };
 

  saveLocation(values) {

    console.log('values.State = ', values.State)

      const countriesWithSubsectors = new Set([1,34,'1','34'])

      const Address = Utils.sanitizeQuotes(values.Address)
      const City = Utils.sanitizeQuotes(values.City)
      let   State = values.State ? Utils.sanitizeQuotes(values.State) : null
      const ZipCode = values.ZipCode
      const CountryID = values.CountryID ? values.CountryID : null
            
            State = !countriesWithSubsectors.has(CountryID) ? 'N/A' : (State ? State : 'prohibited') 
      const Comments = values.Comments ? Utils.sanitizeQuotes(values.Comments) : null
      const Active = values.Active ? 1 : 0
      const Primary = values.Primary ? 1 : 0
      const Phone = values.Phone ? values.Phone : null
      const Fax = values.Fax ? values.Fax : null
      const ContactName = values.ContactName ? Utils.sanitizeQuotes(values.ContactName) : null
      const ContactEmail = values.ContactEmail ? values.ContactEmail : null
      
    const payload = {
      LocationId: this.props.locationId ? this.props.locationId : 0,
      Address,
      City,
      State,
      ZipCode,
      CountryID,
      Comments,
      Active,
      Primary,
      Phone,
      Fax,
      ContactName,
      ContactEmail,
      userId: this.props.login && this.props.login.userId ? this.props.login.userId : null,
      SubcontractorID: this.props.subcontractorId
    };

    if ((this.props.modaltype && this.props.modaltype != 'edit' || payload.LocationId) && State != 'prohibited') {
      payload.modaltype = this.props.modaltype
      this.props.actions.saveLocation(payload, () => {
        this.props.callback() // calls scProfileActions.fetchLocations() with default query to refresh the page with all existing locations
      });
    } else {
      console.log('this.props.modaltype = ', this.props.modaltype)
      if (payload.LocationId) {
        console.log('payload.LocationId = ', payload.LocationId)
      }
      console.log('State = ', State)
      if (State = 'prohibited') {
        this.props.actions.setPrimaryMessage(`Please fill out the State your Company is located in`);
      }
    }

    this.props.closeAndRefresh();

  }

  deleteLocation(id) {
    const payload = {
      id: id,
      userId: (this.props.login && this.props.login.userId) ? this.props.login.userId : null,
    };
    this.props.actions.deleteLocation(payload)
    this.props.closeAndRefresh();
  }

  render() {
    const {
      titleCreate,
      titleEdit
    } = this.props.local.strings.scProfile.ChangeLocationsModal.modal;

    const title = this.props.location ? titleEdit : titleCreate;

    return (
      <div>
        <header>
          <div className="noteEditorTitle">{title}</div>
        </header>
        <LocationForm 
          onSubmit={this.saveLocation}
          onDelete={this.deleteLocation}
          provAndTerr={this.props.provAndTerr}
          states={this.props.states}
          countries={this.props.countries} 
          dismiss={this.props.close} 
          location={this.props.location} 
          scId={this.props.subcontractorId}
          isPQuser={this.props.modaltype == 'edit' ? this.props.isPQuser : null} 
        />
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    scProfile: state.SCProfile,
    local: state.localization,
    login: state.login,
    isPQuser: state.login.profile.Role.IsPrequalRole
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationEditorModal);
