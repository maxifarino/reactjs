import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContactSummaryForm from "./form/contactSummaryForm";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux'
import {Field, change} from 'redux-form'

class CFTaskContacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contact: null,
      contactId: null,
    }

  }

  getUserName = (user) => `${user.FirstName} ${user.LastName}`

  renderContactTable = (items) => {
    return (<section className={`list-view-table`}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
            <tr>
              <th><span className="col-th-wrapper">Contact Type</span></th>
              <th><span className="col-th-wrapper">Name</span></th>
              <th><span className="col-th-wrapper">Email</span></th>
              <th><span className="col-th-wrapper">Phone</span></th>
              <th><span className="col-th-wrapper">Mobile</span></th>
            </tr>
            </thead>
            <tbody>
            {items.map((elem) => {
              return (
                <tr key={this.getUserName(elem)} onClick={() => this.setContactPerson(elem)}>
                  <td>{elem.contactType}</td>
                  <td>{this.getUserName(elem)}</td>
                  <td><a target={'_blank'} href={'mail'}>{elem.emailAddress}</a></td>
                  <td>{elem.phoneNumber}</td>
                  <td>{elem.mobileNumber}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </section>
    );
  }


  setContactPerson = (user) => {
    this.setState({
      contact: this.getUserName(user),
      contactUser: this.getUserName(user)
    });
    this.props.enableForm(this.getUserName(user));

  }

  render() {
    const {contactList, handleTaskSubmit} = this.props;
    const {contactType, contactName, contactEmail, contactPhone, contactMobile} = this.props.locale.table.header;
    const renderContactsTable = () => {
      const contactsTableMetadata = {
        fields: [
          'contactType',
          'contactName',
          'contactEmail',
          'contactPhone',
          'contactMobile',
        ],
        header: {
          contactType,
          contactName,
          contactEmail,
          contactPhone,
          contactMobile,
        }
      }

      const contactsTableBody = contactList.map((contact) => {
        return {
          contactType: contact.contactType,
          contactName: this.getUserName(contact),
          contactEmail: contact.emailAddress,
          contactPhone: contact.phoneNumber,
          contactMobile: contact.mobileNumber,
        }
      });

      return {
        fields: contactsTableMetadata.fields,
        header: contactsTableMetadata.header,
        body: contactsTableBody
      };

    }

    const paginationSettings = {
      total: contactList.length,
      currentPageNumber: 1,
      setPageHandler: () => null,
    }


    return (
      <React.Fragment>
        {(contactList.length > 0) ?
          <React.Fragment>
            <div className="row">
              <div className="col-12">
                {this.renderContactTable(contactList)}
              </div>
            </div>
          </React.Fragment>
          : null
        }
        <ContactSummaryForm
          items={contactList}
          onSubmit={handleTaskSubmit}
          dismiss={this.props.onHide}
          contact={this.state.contact}
          closeAndNew={this.props.closeAndNew}
        />
      </React.Fragment>
    );
  }
};

CFTaskContacts.propTypes = {};

const mapStateToProps = (state) => {
  return {
    locale: state.localization.strings.CFTasks.viewDetail.contacts,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    enableForm: (name) => change('taskContactSummaryForm', 'contactUser', name)
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CFTaskContacts);