import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchSubcontractors } from '../../subcontractors/actions'

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchTerm: '',
      searchPlaceholder: ` Enter Subcontractor Name...`
    }
    this.handleInput = this.handleInput.bind(this);
    this.searchSubcontractors = this.searchSubcontractors.bind(this)
  }

  handleInput(e) {
    e.preventDefault()

    this.setState({ searchTerm: e.target.value });
  }

  searchSubcontractors(e, click) {
    if (click || e.key === 'Enter') {
      let sTerm = this.state.searchTerm;

      if (this.state.searchTerm === '' ) {
        this.setState({
          searchPlaceholder: ' Input is needed',
        })
      } else {
        this.setState({
          searchPlaceholder: `Enter Subcontractor Name...`,
          searchTerm: '',
        }, () => {
          const payload = {};

          payload.pageNumber = 1;
          payload.searchTerm = sTerm;
          payload.orderDirection = 'ASC';
          payload.orderBy = 'scName';
          this.props.searchSubcontractors(payload, (e, hcId, scId, systems) => {
            if (systems.pqEnabled) {
              this.props.viewSubcontractor(e, hcId, scId);
            } else if (systems.cfEnabled) {
              this.props.viewInsured(scId);
            }
          });
        })
      }
    }
  }

  render() {
    let { searchPlaceholder } = this.state
    return (
      <div className="searchWrapper">
        <input
          name="subcontractorSearch"
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInput}
          placeholder={searchPlaceholder}
          onKeyPress={this.searchSubcontractors}
          className="search_subcontractors" />
        <div className='magnifier' onClick={e => this.searchSubcontractors(e,'click')}>
          <span className='linear-icon-magnifier-alt2'></span>
        </div>
      </div>
    );
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchSubcontractors: bindActionCreators(searchSubcontractors, dispatch),
  }
};

export default connect(null, mapDispatchToProps)(SearchBar);
