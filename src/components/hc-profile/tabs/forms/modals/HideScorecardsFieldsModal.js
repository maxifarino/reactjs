import React, { Component, Fragment } from 'react';
import { Modal } from 'react-bootstrap';

const headerStyle = {
  marginTop: '-20px',
  height: '20px',
  marginBottom: '5px',
};

class HideScorecardsFieldsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formSelectedHiddenFields: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedFields !== prevProps.selectedFields) {
      this.setState({
        formSelectedHiddenFields: this.props.selectedFields || [],
      });
    }
  }

  handleInputChange = (field) => {
    const { formSelectedHiddenFields } = this.state;

    const hasFieldSelected = formSelectedHiddenFields.some(fieldForm => fieldForm.id === field.id);

    let newFormSelectedHiddenFields;

    if (hasFieldSelected) {
      newFormSelectedHiddenFields = formSelectedHiddenFields.filter(fieldForm => fieldForm.id !== field.id);
    } else {
      newFormSelectedHiddenFields = [ ...formSelectedHiddenFields, field ];
    }

    this.setState({ formSelectedHiddenFields: newFormSelectedHiddenFields });
  }

  render() {
    const {
      show,
      onHide,
      scorecardsFields,
      loading,
      handleHiddenScorecardFieldsSave,
      selectedFormId,
    } = this.props;

    const { formSelectedHiddenFields } = this.state;

    return (
      <Modal
        show={show}
        onHide={onHide}
        className="add-item-modal add-hc hc-profile-forms-modal"
      >
        <Modal.Body className="add-item-modal-body">
          <div className="newhc-form wiz-wrapper">
            <header style={headerStyle}>
              <h2 className="modal-wiz-title">
                Hide Scorecard's Fields
              </h2>
            </header>

            <div className="steps-bodies">
              <div className="container">
                <div className="row justify-content-md-center mt-3">
                  <div className="col col-4">
                    {scorecardsFields.map(field => (
                      <div className="row" key={field.id}>
                        <div className="col col-10 hide-scorecards-fields-modal-field">
                          {field.name}
                        </div>

                        <div className="col col-2">
                          <input
                            disabled={loading}
                            type="checkbox"
                            onChange={() => this.handleInputChange(field)}
                            checked={formSelectedHiddenFields.some(formField => formField.id === field.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className='row mb-2 mt-3'>
              {loading ? (
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
                      onClick={() => handleHiddenScorecardFieldsSave({
                        fields: formSelectedHiddenFields,
                        formId: selectedFormId,
                      })}
                    >
                      Save
                    </button>
                  </div>

                  <div className='col'>
                    <button
                      type="button"
                      className="bn bn-small bg-green-dark-gradient create-item-bn icon-cancel"
                      onClick={onHide}
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
    );
  }
}

export default HideScorecardsFieldsModal;
