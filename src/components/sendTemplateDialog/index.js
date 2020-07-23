import React from 'react';
// import Utils from '../../lib/utils';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import * as sendTemplateActions from './actions';
import { bindActionCreators } from 'redux';
// import Api from '../../lib/api';
// import async from 'async';

import './sendTemplateDialog.css';

class SendTemplateDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            subContractors: [],
            hiringClients: [],
            showHcSelect: false,
            showSendButton: false,
            hiringClientDefaultMessage:'Select your option',
            subcontractorId: null,
            hiringClientId: null,
            formId: null

        }
    }

    getToken() {
        return this.props.global.login.authToken;
    }

    getUserProfile() {
        return this.props.global.login.profile;
    }

    getTemplateInfo () {
        return this.props.state.formItem;
    }

    getHiringClients (subContractorId) {
        this.setState({subcontractorId: subContractorId});
        this.setState({showHcSelect: true});
        this.props.sendTemplateActions.getHiringClients(subContractorId, this.getToken(), (err, data)=> {
            if(err) {
                console.log('err getting HiringClients', err);
                this.setState({hiringClientDefaultMessage: err.description})
                this.setState({hiringClients: []});
            } else {
                this.setState({showHcSelect:true});
                this.setState({hiringClients: data})
                this.setState({hiringClientDefaultMessage: 'Please choose a hiring client'})
            }
        })
    }

    sendForm (hiringClientId, subcontractorId, formId, authToken, callback) {
        this.props.sendTemplateActions.sendForm(parseInt(hiringClientId, 10), parseInt(subcontractorId, 10), parseInt(formId, 10), this.getToken(), (err, data)=> {
            if(err) {
                console.log('err sending form', err);
                this.props.sendTemplateActions.closeDialog();
            } else {
                this.props.sendTemplateActions.closeDialog();
            }
        })
    }

    render() {
        if(this.props.state.isDialogOpen) {
            return(
                <Modal
                    show={this.props.state.isDialogOpen}
                    className="add-item-modal" >
                    <div className="send-template-header"><p>SEND FORM TO A SUBCONTRACTOR</p></div>
                    <Modal.Body>
                        <p className="template-name"> Template Name: <span>{this.props.state.formItem.name} </span></p>
                        <div className='select-container'>
                            <p>Please choose a sub-contractor</p>
                            <select defaultValue={""} onChange={ (event) => {this.getHiringClients(event.target.value)} }>
                                <option value="" disabled>Select your option</option>
                                {
                                    this.state.subContractors.map( (item) => {
                                        return (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                       </div>
                        {
                            this.state.showHcSelect ?
                                <div className='select-container'>
                                    <p>Please choose a hiring client</p>
                                    <select defaultValue={""} onChange={ (event) => {
                                        this.setState({showSendButton: true});
                                        this.setState({hiringClientId: event.target.value});
                                        } }>
                                        <option key={0} value="" disabled>{this.state.hiringClientDefaultMessage}</option>
                                        {
                                            this.state.hiringClients.map( (item) => {
                                                return (
                                                    <option key={item.hiringClientId} value={item.hiringClientId}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                : null
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel-button" onClick={ () => { this.props.sendTemplateActions.closeDialog(); } }>Close</Button>
                        {
                        this.state.showSendButton ? <Button className="send-template-button" onClick={ (event) => {
                            this.sendForm(this.state.hiringClientId, this.state.subcontractorId, this.props.state.formItem.id);
                        }
                            } >SEND FORM</Button>: null}
                    </Modal.Footer>
                </Modal>
            )
        } else {
            return(
                <div></div>
            );
        }

    }

    componentWillMount() {

        this.props.sendTemplateActions.getSubContractors( 0, this.getToken(), (err, data)=> {
            if(err) {
                console.log('err getting subcontractors', err);
            } else {
                //console.log('subcontractors', data);
                this.setState({subContractors: data.subContractors})
            }
        })
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.sendTemplate,
        global: state
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
        sendTemplateActions: bindActionCreators(sendTemplateActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTemplateDialog);
