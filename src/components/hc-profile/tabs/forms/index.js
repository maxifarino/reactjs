import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';

import { showErrorAlert } from '../../../alerts/index';

import * as listActions from '../../../formList/actions';
import * as builderActions from '../../../formBuilder/actions';
import * as formSubmissionActions from '../../../formSubmissions/actions';

import Utils from '../../../../lib/utils';
import PTable from '../../../common/ptable';
import FormOptions from './formOptions';
import HideScorecardsFieldsModal from './modals/HideScorecardsFieldsModal';

import './forms.css';

const headerStyle = {
  marginTop: '-20px',
  height: '20px',
  marginBottom: '5px',
}

class Forms extends React.Component {
  constructor(props) {
    super(props);
    const hiringClientId = props.match.params.hcId;
    this.state = {
      filter: {
        pageNumber: 1
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        creatorFullName: 'desc',
      },
      hiringClientId,
      showModalDA: false,
      formSelected: null,
      discreetAccountsSelected: [],
      discreetAccountByForm: [],
      oldDiscreetAccountByForm: [],
      accountDisplayTypeSelected: null,
      loadingDiscreteAccounts: false,
      showHideScorecardsFieldsModal: false,
    };

    props.actions.fetchForms({ hiringClientId, orderBy: 'name', orderDirection: 'ASC', justFormData: true });
  }

  componentDidUpdate(prevProps) {
    const { list, discreetAccounts } = this.props.forms;

    const listChanged = list !== prevProps.forms.list;
    const discreetAccountsChanged = discreetAccounts !== prevProps.forms.discreetAccounts;

    if (listChanged || discreetAccountsChanged) {
      console.log('SET DISCRETE ACCOUNTS');
      this.setDiscreetAccounts();
    }
  }

  handleMouseEnter = (e, userId) => {
    // console.log('mouse enter')
    // TO DO: set callback in the previous fetch resources actions so you can execute the resizing once the async was actually solved
  }

  handleMouseLeave = (e) => {
    // const sidebar = document.querySelector('.viewport .sidebar-col');
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'options') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    query.hiringClientId = this.state.hiringClientId;
    query.justFormData = true;
    // fetch using query
    this.props.actions.fetchForms(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        creatorFullName: field === 'creatorFullName' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber) => {
    if (this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      query.hiringClientId = this.state.hiringClientId;
      query.justFormData = true;

      // fetch using query
      this.props.actions.fetchProjects(query);

      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  onAddNewForm = () => {
    this.props.builderActions.clearForm();
    localStorage.removeItem('formBuilderForm');
    this.props.history.push('/forms/new-form');
  }
  onEditForm = (form) => {
    this.props.builderActions.getFormById(form.id);
    this.props.history.push('/forms/new-form');
  }
  goToSubmissions = (form) => {
    this.props.formSubmissionActions.setFormIdForFetching(form.id);
    this.props.history.push('/forms/submissions');
  }

  showModalAssignAccount = (form) => {
    const { discreetAccountByForm } = this.state;

    const selectedForm = discreetAccountByForm.find(discreteForm => discreteForm.formId === form.id);

    this.setState({
      showModalDA: true,
      formSelected: form.id,
      accountDisplayTypeSelected: selectedForm.accountDisplayTypeId,
    }, () => this.renderDiscreetAccounts(form.id));
  }

  renderLinkAssingDiscreetAccounts = (form) => {
    let component = (
      <a
        onClick={() => this.showModalAssignAccount(form)}
        className="cell-table-link icon-edit"
      >
        Assing
      </a>
    );

    return component;
  }

  handleChange = (formId, value) => {
    const { discreetAccountByForm } = this.state;

    const updatedDiscreetAccountByForm = discreetAccountByForm.map(form => {
      if (form.formId === formId) {
        return {
          ...form,
          data: form.data.map(discreteAccount => {
            if (discreteAccount.daId === value) {
              return {
                ...discreteAccount,
                selected: !discreteAccount.selected,
              };
            } else {
              return discreteAccount;
            }
          }),
        };
      } else {
        return form;
      }
    });

    this.setState({ discreetAccountByForm: updatedDiscreetAccountByForm });
  }

  setDiscreetAccounts = () => {
    let resultlist = [];

    if (this.props.forms.list) {
      let selected = false;
      let oldSelected = false;
      let dataList = [];

      this.props.forms.list.forEach(form => {
        this.props.forms.discreetAccounts.forEach(da => {
          selected = false;
          oldSelected = false;

          form.selected.forEach(element => {
            if (element == da.Id) {
              selected = true;
              oldSelected = true;
            }
          })

          let data = {
            daId: da.Id,
            daName: da.Name,
            selected,
            oldSelected,
          };

          dataList.push({ ...data });
        });

        resultlist.push({
          formId: form.id,
          accountDisplayTypeId: form.accountDisplayTypeId,
          data: [...dataList],
        });
        dataList = [];
      });
    }

    this.setState({
      discreetAccountByForm: resultlist,
    });
  }

  setAccountDisplayTypeValue = (val) => {
    const { discreetAccountByForm, formSelected } = this.state;

    if (val === 1) {
      const updatedDiscreetAccountByForm = discreetAccountByForm.map(form => {
        if (form.formId === formSelected) {
          return {
            ...form,
            data: form.data.map(discreteAccount => ({
              ...discreteAccount,
              selected: false,
            })),
          };
        } else {
          return form;
        }
      });

      this.setState({
        accountDisplayTypeSelected: val,
        discreetAccountByForm: updatedDiscreetAccountByForm,
      });
    } else {
      this.setState({ accountDisplayTypeSelected: val });
    }
  }

  renderDiscreetAccounts = () => {
    const { accountDisplayTypeSelected, loadingDiscreteAccounts } = this.state;

    const selectedForm = this.state.discreetAccountByForm.find(x => x.formId === this.state.formSelected);
    const formDiscreteAccountsChunks = _.chunk(selectedForm.data, 3);

    const disabledFields = (accountDisplayTypeSelected === 1) || loadingDiscreteAccounts;

    const discreteAccountsGrid = formDiscreteAccountsChunks.map((chunk, index) => (
      <div className="row mt-3" key={index}>
        {chunk.map(discreteAccount => (
          <div className="col col-4" key={discreteAccount.daId}>
            <div className='row'>
              <div className="col col-10">
                {discreteAccount.daName}
              </div>

              <div className="col col-2">
                <input
                  disabled={disabledFields}
                  type="checkbox"
                  onChange={() => this.handleChange(this.state.formSelected, discreteAccount.daId)}
                  checked={discreteAccount.selected}
                >
              </input>
              </div>
            </div>
          </div>
        ))}
      </div>
    ));

    return (
      <Fragment>
        <div className="row mt-3">
          <div className="col col-4 discrete-acounts-modal-header">
            <div className="row">
              <div className="col col-10 discrete-acounts-modal-header-title">
                Regular Accounts Only:
              </div>

              <div className="col col-2">
                <input
                  disabled={loadingDiscreteAccounts}
                  type="checkbox"
                  onChange={() => this.setAccountDisplayTypeValue(1)}
                  checked={accountDisplayTypeSelected === 1}
                />
              </div>
            </div>
          </div>
          <div className="col col-4 discrete-acounts-modal-header">
            <div className="row">
              <div className="col col-10 discrete-acounts-modal-header-title">
                Discrete Accounts Only:
              </div>

              <div className="col col-2">
                <input
                  disabled={loadingDiscreteAccounts}
                  type="checkbox"
                  onChange={() => this.setAccountDisplayTypeValue(2)}
                  checked={accountDisplayTypeSelected === 2}
                />
              </div>
            </div>
          </div>
          <div className="col col-4 discrete-acounts-modal-header">
            <div className="row">
              <div className="col col-10 discrete-acounts-modal-header-title">
                Both Accounts:
              </div>

              <div className="col col-2">
                <input
                  disabled={loadingDiscreteAccounts}
                  type="checkbox"
                  onChange={() => this.setAccountDisplayTypeValue(3)}
                  checked={accountDisplayTypeSelected === 3}
                />
              </div>
            </div>
          </div>
        </div>

        {discreteAccountsGrid}
      </Fragment>
    );
  }

  closeModal = () => {
    this.setState({
      accountDisplayTypeSelected: null,
      showModalDA: false,
    });
  }

  cancelClick = () => {
    const { formSelected, discreetAccountByForm } = this.state;

    this.closeModal();

    const updatedDiscreetAccountByForm = discreetAccountByForm.map(form => {
      if (form.formId === formSelected) {
        return {
          ...form,
          data: form.data.map(discreteAccount => ({
            ...discreteAccount,
            selected: discreteAccount.oldSelected ? true : false,
          })),
        };
      } else {
        return form;
      }
    });

    this.setState({
      discreetAccountByForm: updatedDiscreetAccountByForm,
    });
  }

  saveClick = () => {
    const {
      accountDisplayTypeSelected,
      discreetAccountByForm,
      formSelected,
    } = this.state;

    let form = discreetAccountByForm.find(x => x.formId == formSelected);

    this.setState({ loadingDiscreteAccounts: true });
    this.props.actions.fetchSaveFormByDiscreetAccount({ ...form, accountDisplayTypeId: accountDisplayTypeSelected }, (error, response) => {
      this.setState({ loadingDiscreteAccounts: false });

      if (error) {
        this.cancelClick();

        showErrorAlert('Error', 'There was an error setting the discrete accounts');
      } else {
        this.setState({ loadingDiscreteAccounts: false });

        const modifiedDiscreetAccountByForm = discreetAccountByForm.map(discreetAccountsForm => {
          if (discreetAccountsForm.formId === form.formId) {
            return {
              ...discreetAccountsForm,
              accountDisplayTypeId: response.accountDisplayTypeId,
              data: discreetAccountsForm.data.map(discreetAccount => {
                return { ...discreetAccount, oldSelected: !!discreetAccount.selected }
              }),
            };
          }

          return discreetAccountsForm;
        });

        this.setState({ discreetAccountByForm: modifiedDiscreetAccountByForm });
        this.props.actions.updateDiscreteAccountsProps({ ...form, accountDisplayTypeId: accountDisplayTypeSelected });

        this.closeModal();
      }
    });
  }

  showHideScorecardsFields = (form) => {
    this.setState({
      showHideScorecardsFieldsModal: true,
      formSelected: form.id,
    });
  }

  handleHiddenScorecardFieldsSave = (form) => {
    this.props.actions.fetchSaveFormHiddenScorecardField(form, () => {
      this.onHideScorecardsFieldsModal();
    });
  }

  onHideScorecardsFieldsModal = () => {
    this.setState({ showHideScorecardsFieldsModal: false, formSelected: null })
  }

  render() {
    let {
      // buttonFormSubmissions,
      // buttonEditForm,
      tableHeaderName,
      tableHeaderCreator,
      buttonOptions,
      // buttonSendForm,
      buttonAddForm
    } = this.props.local.strings.formList;

    const formsTableMetadata = {
      fields: [
        'name',
        'creatorFullName',
        'options',
        'assignAccount'
      ],
      header: {
        name: tableHeaderName,
        creatorFullName: tableHeaderCreator,
        options: '',
        assignAccount: ''
      }
    };

    const formsTableBody = this.props.forms.list.map((form, idx) => {
      const { name, creator } = form;

      return {
        name,
        creatorFullName: creator,
        options: (
          <a
            className="cell-table-link icon-edit"
            onMouseEnter={(e) => { this.handleMouseEnter(e) }}
            onMouseLeave={(e) => { this.handleMouseLeave(e) }}
          >
            {buttonOptions}

            <FormOptions
              idx={idx}
              editForm={() => { this.onEditForm(form) }}
              checkSubmissions={() => { this.goToSubmissions(form) }}
              hideScorecardsFields={() => this.showHideScorecardsFields(form)}
            />
          </a>
        ),
        assignAccount: (this.renderLinkAssingDiscreetAccounts(form))
      };
    });

    const formsTableData = {
      fields: formsTableMetadata.fields,
      header: formsTableMetadata.header,
      body: formsTableBody
    };

    let { totalAmountOfForms, formsPerPage, fetchingForms } = this.props.forms;
    const paginationSettings = {
      total: totalAmountOfForms,
      itemsPerPage: formsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    const colsWidth = [
      '30%',
      '30%',
      '40%',
    ];

    const selectedForm = this.props.forms.list.find(form => form.id === this.state.formSelected)

    return (
      <div className="list-view admin-view-body hc-profile-forms-container">
        {/* Hide scorecard's fields modal */}
        <HideScorecardsFieldsModal
          show={this.state.showHideScorecardsFieldsModal}
          onHide={this.onHideScorecardsFieldsModal}
          scorecardsFields={this.props.forms.scorecardsFields}
          selectedFields={selectedForm && selectedForm.scorecardHiddenFields}
          selectedFormId={selectedForm && selectedForm.id}
          loading={this.props.forms.fetchingHiddenScorecardFields}
          handleHiddenScorecardFieldsSave={this.handleHiddenScorecardFieldsSave}
        />

        {/* Discrete accounts modal */}
        {/* TODO: move this modal to modals folder */}
        <Modal
          show={this.state.showModalDA}
          onHide={this.cancelClick}
          className="add-item-modal add-hc hc-profile-forms-modal"
        >
          <Modal.Body className="add-item-modal-body">
            <div className="newhc-form wiz-wrapper">
              <header style={headerStyle}>
                <h2 className="modal-wiz-title">
                  Assing Discreet Accounts
                </h2>
              </header>

              <div className="steps-bodies add-item-view">
                <div className="container">
                  {this.state.formSelected && this.renderDiscreetAccounts()}
                </div>
              </div>
            </div>

            <div className="container">
              <div className='row mb-2 mt-3'>
                {this.state.loadingDiscreteAccounts ? (
                  <div className='col mb-2'>
                    <div className="spinner-wrapper">
                      <div className="spinner" />
                    </div>
                  </div>
                ) : (
                  <Fragment>
                    <div className='col'>
                      <button
                        className="float-right bn bn-small bg-green-dark-gradient create-item-bn icon-save"
                        type="button"
                        onClick={() => this.saveClick()}
                      >
                        Save
                      </button>
                    </div>

                    <div className='col'>
                      <button
                        type="button"
                        className="bn bn-small bg-green-dark-gradient create-item-bn icon-cancel"
                        onClick={() => this.cancelClick()}
                      >
                        Cancel
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <section className="list-view-header templates-view-header">
          <div className="row">
            <div className="col-sm-6" />

            <div className="col-sm-6">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a
                      className="list-view-nav-link nav-bn icon-add"
                      onClick={this.onAddNewForm}
                    >
                      {buttonAddForm}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <PTable
          sorted={true}
          items={formsTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingForms}
          customClass='templates-list'
          pagination={paginationSettings}
          colsConfig={colsWidth}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {

  return {
    local: state.localization,
    forms: state.forms,
    formSubmissions: state.formSubmissions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(listActions, dispatch),
    builderActions: bindActionCreators(builderActions, dispatch),
    formSubmissionActions: bindActionCreators(formSubmissionActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forms));
