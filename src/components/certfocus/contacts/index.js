import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import AddContactModal from '../modals/addContactModal';

import PTable from '../../common/ptable';
import TypeAheadAndSearch from '../../common/typeAheadAndSearch';
import * as commonActions from '../../common/actions';

import Utils from '../../../lib/utils';
import FilterContacts from './filter';

import * as contactsActions from './actions';
import RolAccess from './../../common/rolAccess';

import './Contacts.css';

class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      filterBox: {
        firstNameTerm: '',
        lastNameTerm: '',
        entityTerm: '',
        entityType: '',
        typeId: '',
      },
      tableOrderActive: 'firstName',
      showFilterBox: false,
      order: {
        contactId: 'desc',
        firstName: 'asc',
        lastName: 'desc',
        phoneNumber: 'desc',
        mobileNumber: 'desc',
        emailAddress: 'desc',
        contactType: 'desc',
        entity: 'desc',
        entityType: 'desc',
      },
      currentContact: null,
    };
  }

  componentDidMount() {
    const preQuery = { orderBy: 'firstName', orderDirection: 'ASC' };

    const query = this.addId(preQuery)
    this.props.contactsActions.fetchContacts(query);

    // if (window.location.pathname.includes(this.props.local.strings.breadcrumb.contacts)) {
    //   this.props.commonActions.addPage(
    //     {
    //       pathName: this.props.local.strings.breadcrumb.contacts,
    //       hrefName: window.location.pathname
    //     }
    //   );
    // }
  }

  addId = (query) => {
    const { insuredId, holderId } = this.props;

    if (insuredId) {
      return { ...query, insuredId }
    } else if (holderId) {
      return { ...query, holderId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.contactsActions.fetchContacts(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        contactId: field === 'id' ? 'asc' : 'desc',
        firstName: field === 'firstName' ? 'asc' : 'desc',
        lastName: field === 'lastName' ? 'asc' : 'desc',
        phoneNumber: field === 'phoneNumber' ? 'asc' : 'desc',
        mobileNumber: field === 'mobileNumber' ? 'asc' : 'desc',
        emailAddress: field === 'emailAddress' ? 'asc' : 'desc',
        contactType: field === 'contactType' ? 'asc' : 'desc',
        entity: field === 'entity' ? 'asc' : 'desc',
        entityType: field === 'entityType' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.contactsActions.fetchContacts(query);

      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  toggleFilterBox = () => {
    this.setState({ showFilterBox: !this.state.showFilterBox });
  }

  submitFilterForm = (values) => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      firstNameTerm: values.firstNameTerm || '',
      lastNameTerm: values.lastNameTerm || '',
      entityTerm: values.entityTerm || '',
      entityType: values.entityType || '',
      typeId: values.typeId || '',
    };

    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.contactsActions.fetchContacts(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openAddContactsModal = () => {
    this.setState({ currentContact: null });
    this.props.contactsActions.setShowModal(true);
  }

  closeContactsModal = () => {
    this.props.contactsActions.setShowModal(false);
  }

  closeContactsModalAndRefresh = () => {
    this.props.contactsActions.setShowModal(false);
    this.setPageFilter(null, 1, true);
  }

  openEditContactsModal = (contact) => {
    this.setState({ currentContact: contact });
    this.props.contactsActions.setShowModal(true);
  }

  renderButtonAddContact() {
    let component = (
      <div>
        <a onClick={this.openAddContactsModal}
          className="nav-btn nav-bn icon-add">
          {this.props.local.strings.contacts.contactsList.addBtn}
        </a>
      </div>);

    return component;
  }

  renderButtonEditContact(contact) {
    let component = (
      <div>
        <a
          className='cell-table-link icon-edit'
          onClick={() => this.openEditContactsModal(contact)}
        >
          {this.props.local.strings.contacts.contactsList.editContact}
        </a>
      </div>
      );

    return component;
  }

  render() {
    let {
      filterBtn,
      firstNameColumn,
      lastNameColumn,
      phoneColumn,
      mobileColumn,
      emailColumn,
      contactTypeColumn,
      entityColumn,
      entityTypeColumn,
      addBtn,
      editContact,
    } = this.props.local.strings.contacts.contactsList;

    let {
      totalAmountOfContacts,
      contactsPerPage,
      errorContacts,
      showModal,
    } = this.props.contacts;

    const { insuredId, holderId } = this.props;

    const showMobile = !!(insuredId || holderId); // I don't know if there is a possibility of both being null
    const showEntity = !insuredId && !holderId;
    const showEntityType = !insuredId && !holderId;
    const showContactType = holderId ? true : false;
    const showEdit = insuredId || holderId;

    const tableMetadata = {
      fields: [
        'firstName',
        'lastName',
        'phoneNumber',
        ...showMobile ? ['mobileNumber'] : [],
        'emailAddress',
        ...showContactType ? ['contactType'] : [],
        ...showEntity ? ['entity'] : [],
        ...showEntityType ? ['entityType'] : [],
        ...showEdit ? ['edit'] : [],
      ],
      header: {
        firstName: firstNameColumn,
        lastName: lastNameColumn,
        phoneNumber: phoneColumn,
        mobileNumber: mobileColumn,
        emailAddress: emailColumn,
        contactType: contactTypeColumn,
        entity: entityColumn,
        entityType: entityTypeColumn,
        edit: '',
      }
    };

    const tableBody = this.props.contacts.list.map((contact, idx) => {
      return {
        firstName: contact.FirstName,
        lastName: contact.LastName,
        phoneNumber: contact.phoneNumber ? Utils.formatPhoneNumber(contact.phoneNumber) : '',
        mobileNumber: contact.mobileNumber ? Utils.formatPhoneNumber(contact.mobileNumber) : '',
        emailAddress: contact.emailAddress,
        contactType: contact.contactType,
        entity: contact.entity,
        entityType: contact.entityType,
        edit: (
          <RolAccess
            masterTab="hiring_client_holder_contacts"
            sectionTab="edit_contact"
            component={() => this.renderButtonEditContact(contact)}>
          </RolAccess>
        )
      };
    });

    const tableData = {
      fields: tableMetadata.fields,
      header: tableMetadata.header,
      body: tableBody
    };

    const paginationSettings = {
      total: totalAmountOfContacts,
      itemsPerPage: contactsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body contacts-list">
        <Modal
          show={showModal}
          onHide={this.closeContactsModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddContactModal
              onHide={this.closeContactsModal}
              close={this.closeContactsModalAndRefresh}
              profile={this.state.currentContact}
              insuredId={insuredId}
              holderId={holderId}
            />
          </Modal.Body>
        </Modal>

        <div className="contacts-list-header">
          <div>
            <a onClick={this.toggleFilterBox}
              className="nav-btn icon-login-door">
              {filterBtn}
            </a>
          </div>

          {(insuredId || holderId) && (
            <RolAccess
              masterTab="hiring_client_holder_contacts"
              sectionTab="add_contact"
              component={() => this.renderButtonAddContact()}>
            </RolAccess>
          )}

          {!insuredId && !holderId ? <TypeAheadAndSearch /> : null}
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterContacts
              onSubmit={this.submitFilterForm}
              holderId={holderId}
              insuredId={insuredId}
            />
          </section>
        }

        {errorContacts ?
          (
            <div className="d-flex justify-content-center">
              {this.props.contacts.errorContacts}
            </div>
          ) :
          (
            <PTable
              sorted={true}
              items={tableData}
              wrapperState={this.state}
              tableOrderActive={this.state.tableOrderActive}
              clickOnColumnHeader={this.clickOnColumnHeader}
              isFetching={this.props.contacts.fetchingContacts}
              pagination={paginationSettings}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    contacts: state.contacts,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    contactsActions: bindActionCreators(contactsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
