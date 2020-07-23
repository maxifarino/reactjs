import React, {Component} from 'react';
import DepartmentForm from "./form";

class AddDepartmentModal extends Component {

  render() {
    const {title, onClose, handleSubmit, currentItem} = this.props;
    return (
      <div className="add-item-view add-entity-form-small">
        <div className="add-item-header">
          <h1>{title}</h1>
        </div>

        <section className="white-section">
          <div className="add-item-form-subsection">
            <DepartmentForm
              onSubmit={handleSubmit}
              close={onClose}
              currentItem={currentItem}
            />
          </div>
        </section>
      </div>

    );
  }
}

export default AddDepartmentModal;