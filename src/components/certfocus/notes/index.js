import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import NoteEditorModal from '../modals/noteEditorModal';
import ViewNoteModal from '../modals/viewTaskModal';
import PTable from '../../common/ptable';
import Filter from './filter';
import Utils from '../../../lib/utils';

import * as userActions from '../../users/actions';
import * as actions from './actions';
import * as insuredViewAction from './../insured-view/actions';
import RolAccess from './../../common/rolAccess';
import './Notes.css';

class Notes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      filterBox: {
        searchTerm: '',
        name: '',
        contactTypeId: '',
      },
      tableOrderActive: 'enteredDate',
      order: {
        name: 'desc',
        description: 'desc',
        enteredByUser: 'desc',
        contactType: 'desc',
        enteredDate: 'desc',
      },
      showFilterBox: false,
      selectedNote: null,
      showNoteEditor: false,
      modal: '',
    };
  }

  componentDidMount() {
    const preQuery = Utils.getFetchQuery(this.state.tableOrderActive, 1, 'DESC');

    const query = this.addId(preQuery);

    this.props.actions.fetchNotes(query);
    this.props.actions.fetchRoles();
  }

  addId = (preQuery) => {
    const { insuredId } = this.props;

    let query = preQuery;

    if (insuredId) {
      query = { ...query, subcontractorId: insuredId, typeId: 3 };
    }

    return query;
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.insuredDetails && nextProps.insuredDetails.showModalAddNote) {
      this.onCreateNote();
    }
  }



  clickOnColumnHeader = (e, field) => {
    if (field === 'viewNote' || field === 'editNote') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        description: field === 'description' ? 'asc' : 'desc',
        enteredByUser: field === 'enteredByUser' ? 'asc' : 'desc',
        contactType: field === 'contactType' ? 'asc' : 'desc',
        enteredDate: field === 'enteredDate' ? 'asc' : 'desc',
      },
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);

    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    this.props.actions.fetchNotes(query);
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

      this.props.actions.fetchNotes(query);

      // Save page number
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  submitFilterForm = (values) => {
    // Get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // Add search filters
    const filterBox = {
      name: values.name || '',
      searchTerm: values.keywords || '',
      contactTypeId: values.contactTypeId || '',
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      },
    }, () => {
      this.props.actions.fetchNotes(query);
    });
  }

  onCreateNote = () => {
    this.setState({
      modal: 'new',
      selectedNote: null,
      showNoteEditor: true,
    });
  }

  onEditNote = (note, modal) => {
    this.setState({
      modal,
      selectedNote: note,
      showNoteEditor: true
    });
  }

  closeNoteEditor = () => {
    this.setState({
      showNoteEditor: false
    }, () => this.props.hideAddModalNote());
  }

  closeNoteEditorAndRefresh = () => {
    this.setPageFilter(null, 1, true);

    this.setState({
      showNoteEditor: false
    }, () => this.props.hideAddModalNote());
  }

  getTable = () => {
    const {
      nameColumn,
      descriptionColumn,
      userColumn,
      typeColumn,
      dateColumn,
      viewLink,
      editLink,
    } = this.props.local.strings.CFNotes.list;

    const notesTableMetadata = {
      fields: [
        'name',
        'description',
        'enteredByUser',
        'contactType',
        'enteredDate',
        'viewNote',
        'editNote',
      ],
      header: {
        name: nameColumn,
        description: descriptionColumn,
        enteredByUser: userColumn,
        contactType: typeColumn,
        enteredDate: dateColumn,
        viewNote: '',
        editNote: '',
      }
    };

    const notesTableBody = this.props.CFNotes.notes.map((note, idx) => {
      const {
        name,
        enteredDate,
        enteredByUser,
        contactType,
        description,
        status,
      } = note;

      return {
        name,
        description: (
          <div className="limitedWidthText">
            {description}
          </div>
        ),
        enteredByUser: enteredByUser,
        contactType: contactType,
        enteredDate: new Date(enteredDate).toLocaleString() || "",
        viewNote: (
          <RolAccess
            masterTab="notes"
            sectionTab="view_internal_notes"
            component={() => this.renderButtonViewInternalNote(note)}>
          </RolAccess>
        ),
        editNote: status !== 'Completed'
          ? (
            <RolAccess
              masterTab="notes"
              sectionTab="edit_note_only_if_created"
              component={() => this.renderButtonEditNote(note)}>
            </RolAccess>
          )
          : '',
      };
    });

    return {
      fields: notesTableMetadata.fields,
      header: notesTableMetadata.header,
      body: notesTableBody
    };
  }

  renderModalBody = () => {
    if (this.state.modal === 'view') {
      return (
        <ViewNoteModal
          closeAndRefresh={this.closeNoteEditorAndRefresh}
          close={this.closeNoteEditor}
          task={this.state.selectedNote}
        />
      );
    } else if (this.state.modal === 'edit' || this.state.modal === 'new') {
      return (
        <NoteEditorModal
          closeAndRefresh={this.closeNoteEditorAndRefresh}
          close={this.closeNoteEditor}
          note={this.state.selectedNote}
          fromNotes
          fromHolderTab={this.props.fromHolderTab}
          holderId={this.props.holderId}
          fromInsuredTab={this.props.fromInsuredTab}
          insuredId={this.props.insuredId}
          defaultValue={this.props.insuredDetails.showModalAddNote && this.state.modal === 'new' ? this.props.insuredDetails.defaultValueContactType : null}
        />
      );
    }
  }

  renderButtonCreateNote() {
    let component = (
      <a
        className="list-view-nav-link nav-bn icon-add no-overlapping"
        onClick={this.onCreateNote}
      >
        {this.props.local.strings.CFNotes.addBtn}
      </a>
    );

    return component;
  }

  renderButtonViewInternalNote(note) {
    let component = (
      <a
        onClick={() => this.onEditNote(note, 'view')}
        className="cell-table-link icon-quick_view" >
        {this.props.local.strings.CFNotes.list.viewLink}
      </a>
    );
    return component;
  }

  renderButtonEditNote(note) {
    let component = (
      <a
        onClick={() => this.onEditNote(note, 'edit')}
        className="cell-table-link icon-edit" >
        {this.props.local.strings.CFNotes.list.editLink}
      </a>
    );
    return component;
  }

  renderButtonFilter() {
    let component = (
      <a
        className="list-view-nav-link nav-bn icon-login-door no-overlapping"
        onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
      >
        {this.props.local.strings.CFNotes.filterBtn}
      </a>
    );
    return component;
  }

  render() {
    const {
      filterBtn,
      addBtn,
    } = this.props.local.strings.CFNotes;

    let { totalAmountOfNotes, notessPerPage, fetchingNotes } = this.props.CFNotes;

    const paginationSettings = {
      total: totalAmountOfNotes,
      itemsPerPage: notessPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body notes-list">
        <Modal
          show={this.state.showNoteEditor}
          onHide={this.closeNoteEditor}
          className="add-item-modal noteEditorModal"
        >
          <Modal.Body>
            {this.renderModalBody()}
          </Modal.Body>
        </Modal>

        <section className="list-view-header notes-list-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <RolAccess
                      masterTab="notes"
                      sectionTab="view_all_notes"
                      component={() => this.renderButtonFilter()}>
                    </RolAccess>
                  </li>
                  <li>
                    <RolAccess
                      masterTab="notes"
                      sectionTab="create_notes"
                      component={() => this.renderButtonCreateNote()}>
                    </RolAccess>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <Filter
              onSubmit={this.submitFilterForm}
            />
          </section>
        }

        <PTable
          sorted
          items={this.getTable()}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingNotes}
          pagination={paginationSettings}
        />

      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    CFNotes: state.CFNotes,
    local: state.localization,
    insuredDetails: state.insuredDetails
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    hideAddModalNote: () => dispatch(insuredViewAction.setHideAddNote())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notes));
