import React from 'react';
import { connect } from 'react-redux';
import * as commonActions from '../actions';
import { Link } from 'react-router-dom';

class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
    }

    renderBreadcrumbItem = () => {
        let breadcrumbItems = [];
        let amountItems = this.props.breadcrumbItems.length;

        this.props.breadcrumbItems.forEach((element, index) => {
            let _index = index + 1;
            
            if (_index < amountItems) {
                breadcrumbItems.push(<li key={index} className="breadcrumb-item"><Link to={element.hrefName}>{element.pathName}</Link></li>);
            }
            else {
                breadcrumbItems.push(<li key={index} className="breadcrumb-item active" aria-current="page">{element.pathName}</li>);
            }
        });

        return breadcrumbItems;
    }

    render() {        
        const items = this.renderBreadcrumbItem().map(function (item) {
            return item;
        });

        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {items}
                </ol>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        breadcrumb: state.common.breadcrumb,
        breadcrumbItems: state.common.breadcrumbItems
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initCurrentPage: (isAnLink, pathName, hrefName, hasChild) => dispatch(commonActions.setCurrentPage({ isAnLink: isAnLink, pathName: pathName, hrefName: hrefName, hasChild: hasChild }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);