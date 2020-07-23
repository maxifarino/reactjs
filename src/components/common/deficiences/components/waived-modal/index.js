import React from 'react';
import { Modal } from 'react-bootstrap';
import WaivedForm from './../waived-form';

class WaivedModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Modal
        show={this.props.showModalWaived}
        onHide={()=>{}}
        className="add-item-modal noteEditorModal"
      >
        <Modal.Body>
          <WaivedForm onHide={this.props.closeModalWaived}></WaivedForm>
        </Modal.Body>
      </Modal>
    )
  }
}

export default WaivedModal;
