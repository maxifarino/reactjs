import React, { Component } from 'react';
import { connect } from 'react-redux';

class RolAccess extends Component {

    constructor(props) {
        super(props);
    }

    havePermision = () => {
        let componentToRender = null;
        let havePermision = this.props.login.rolesAccessPermissions.find(x => x.MasterTab == this.props.masterTab && x.SectionTab == this.props.sectionTab);
        if (havePermision) {
            componentToRender = (<React.Fragment>
                {this.props.component()}
            </React.Fragment>)
        }
        return componentToRender;
    }

    render() {
        return (this.havePermision())
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login
    };
};

export default connect(mapStateToProps, null)(RolAccess);