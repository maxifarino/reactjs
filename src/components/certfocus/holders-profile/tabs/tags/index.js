import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../../common/ptable';
import AddTagModal from '../../../modals/addTagModal';
import FilterTags from './filter';
import Utils from '../../../../../lib/utils';
import * as actions from './actions';
import RolAccess from './../../../../common/rolAccess';

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        tagName: '',
        CFdeletedFlag: '',
      },
      tableOrderActive: 'tagName',
      order: {
        tagName: 'asc',
        CFdisplayOrder: 'desc',
        CFdeletedFlag: 'desc'
      },
      showFilterBox: false,
      currentTag: null,
      holderId: props.holderId
    };

    let query = Utils.getFetchQuery('CFdisplayOrder', 1, 'ASC');
    query.CFHolderId = props.holderId;
    props.actions.fetchTags(query);
  }

  addId = (query) => {
    const { holderId } = this.state;
    query.CFHolderId = holderId;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'editTag') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchTags(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        tagName: field === 'tagName' ? 'asc' : 'desc',
        CFdisplayOrder: field === 'CFdisplayOrder' ? 'asc' : 'desc',
        CFdeletedFlag: field === 'CFdeletedFlag' ? 'asc' : 'desc',
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
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      this.addId(query);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.actions.fetchTags(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  submitFilterForm = (values) => {
    // get base query
    console.log(values);
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);
    // add search filters
    const filterBox = {
      tagName: values.name || "",
      CFdeletedFlag: values.archived
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchTags(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openModal = () => {
    this.setState({ currentTag: null });
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);
  }

  closeModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.setPageFilter(null, 1, true);
  }

  editTag = (tag) => {
    this.setState({ currentTag: tag });
    this.props.actions.setShowModal(true);
  }

  renderButtonAddTag() {
    let component = (
      <li>
        <a onClick={this.openModal}
          className="list-view-nav-link nav-bn icon-add no-overlapping" >
          {this.props.local.strings.tags.tagsList.addBtn}
        </a>
      </li>
    );
    return component;
  }

  renderButtonEditTag(tag) {
    let component = (
      <a
        onClick={() => this.editTag(tag)}
        className="cell-table-link icon-edit" >
        {this.props.local.strings.tags.tagsList.editTag}
      </a>
    );
    return component;
  }

  render() {
    const {
      editTag,
      filterBtn,
      addBtn,
      headers
    } = this.props.local.strings.tags.tagsList;

    const {
      nameColumn,
      orderColumn,
      archivedColumn
    } = headers;

    const tagsTableMetadata = {
      fields: [
        'tagName',
        'CFdisplayOrder',
        'CFdeletedFlag',
        'editTag'
      ],
      header: {
        tagName: nameColumn,
        CFdisplayOrder: orderColumn,
        CFdeletedFlag: archivedColumn,
        editTag: ''
      }
    };

    const tagsTableBody = this.props.tags.list.map((tag, idx) => {
      const { tagName, CFdisplayOrder, CFdeletedFlag } = tag;
      return {
        tagName,
        CFdisplayOrder,
        CFdeletedFlag: CFdeletedFlag ? 'True' : 'False',
        editTag: (
          <RolAccess
            masterTab="tags"
            sectionTab="edit_tag"
            component={() => this.renderButtonEditTag(tag)}>
          </RolAccess>
        ),
      };
    });

    const templatesTableData = {
      fields: tagsTableMetadata.fields,
      header: tagsTableMetadata.header,
      body: tagsTableBody
    };

    let { totalAmountOfTags, tagsPerPage, fetchingTags, showModal } = this.props.tags;
    const paginationSettings = {
      total: totalAmountOfTags,
      itemsPerPage: tagsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddTagModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              tag={this.state.currentTag}
              holderId={this.state.holderId}
            />
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li className="">
                    <a
                      className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                      onClick={() => { this.setState({ showFilterBox: !this.state.showFilterBox }) }}
                    >
                      {filterBtn}
                    </a>
                  </li>
                  <RolAccess
                    masterTab="tags"
                    sectionTab="add_tag"
                    component={() => this.renderButtonAddTag()}>
                  </RolAccess>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterTags onSubmit={this.submitFilterForm} />
          </section>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingTags}
          customClass='tags-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.tags,
    local: state.localization
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tags));
