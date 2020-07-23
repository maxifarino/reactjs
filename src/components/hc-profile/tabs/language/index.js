import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Utils from '../../../../lib/utils';

import * as listActions from '../../../communication-templates/list/actions';
import * as ProfileActions from '../../actions'

import PTable from '../../../common/ptable';

const _ = require('lodash');

class Language extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      lastSearchText: null
    };
  };

  onUnload = (event)=> { // the method that will be used for both add and remove event
    alert("hellooww");
    event.returnValue = "Hellooww"
  }

  componentWillReceiveProps(newProps) {
    window[`${newProps.HCProfile.modifiedItems.length ? 'add' : 'remove'}EventListener`]("beforeunload", this.onUnload);

    // to reset pages on new search
    if (newProps.HCProfile.searchText !== this.state.lastSearchText) {
      this.setState({
        pageNumber: 1
      });
    }

    // fetch languages using the hiring client id
    if (newProps.HCProfile.profileData) {
      if(newProps.HCProfile.profileData.id !== this.props.HCProfile.profileData.id) {
        this.props.actions.fetchLanguages(newProps.HCProfile.profileData.id);
      }
    }
  }

  setPageFilter = (e, pageNumber) => {
    this.setState({
      pageNumber
    })
  };

  saveLanguages = () => {
    if (this.props.HCProfile.profileData && this.props.HCProfile.profileData.id &&
        this.props.HCProfile.modifiedItems.length > 0) {
      this.props.actions.saveLanguages(this.props.HCProfile.profileData.id);
    }
  }

  renderMessage = ()=> {
    return this.props.HCProfile.message.visible ?
      <p className={`${this.props.HCProfile.message.type}-message`}>
        {this.props.HCProfile.message.text}
      </p>
      : null
  };

  render() {
    const languageTableMetadata = {
      fields: [
        'terminology',
        'changesTo'
      ],
      header: {
        terminology: 'Terminology...',
        changesTo: 'Changes to...'
      }
    };

    const { languagesList, searchText } = this.props.HCProfile;
    const orderedLanguagesList = _.orderBy(languagesList, [o => o.defaultValue? o.defaultValue.toLowerCase():""], 'asc');

    const languageTableBody = Utils.searchItems(orderedLanguagesList, searchText).map((item) => {
      return {
        terminology: <span className="terminology">{item.defaultValue}</span>,
        changesTo: (
          <input
            className="item-field"
            type="text"
            defaultValue={item.value || item.defaultValue}
            onChange={(e)=> this.props.actions.editLanguageItem({...item, value:e.target.value})}
            key={item.keyId}
          />
        ),
      };
    });
    const start = (this.state.pageNumber-1) * 10;
    const end = start + 10;
    const languageTableData = {
      fields: languageTableMetadata.fields,
      header: languageTableMetadata.header,
      body: languageTableBody.slice(start, end)
    };

    const paginationSettings = {
      total: languageTableBody.length,//total elements rendered after search is applied
      itemsPerPage: 10,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.pageNumber,
    };

    const colsWidth = [
      '60%',
      '40%'
    ];

    return (
      <div className="list-view admin-view-body">
        <section className="list-view-header templates-view-header">
          <div className="row">
            <div className="col-sm-6 message-row">
              <button className="save-lng-btn" onClick={this.saveLanguages}>
                <span className="icon-save"/>
                <span>Save Changes</span>
              </button>
              {this.renderMessage()}
            </div>
            <div className="col-sm-6">
              <nav className="list-view-nav search-field-wrapper">
                <ul>
                  <li>
                    <input
                      className="search-field"
                      value={this.props.HCProfile.searchText}
                      placeholder="Filter..."
                      onChange={(e)=> this.props.actions.setSearchText(e.target.value)}
                    >
                    </input>
                    <span className="icon-search_icon"/>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <PTable
          sorted={false}
          items={languageTableData}
          wrapperState={this.state}
          clickOnColumnHeader={null}
          isFetching={this.props.HCProfile.fetchingLanguages}
          customClass='templates-list'
          pagination={paginationSettings}
          colsConfig={colsWidth}
        />
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    templates: state.templates,
    HCProfile: state.HCProfile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({...listActions, ...ProfileActions}, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Language);
