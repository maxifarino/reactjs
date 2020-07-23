import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions';

class FilterNotesTasks extends Component {
  render() {
    const {
      noteTitle,
      namePlaceholder,
      nameLabel,
      keywordsLabel,
      keywordsPlaceholder,
      contactTypeLabel,
      contactTypePlaceholder,
    } = this.props.local.strings.scProfile.notesTasks.filter;

    const { handleSubmit, notesTasks } = this.props;

    const {
      contactsTypesPossibleValues,
    } = notesTasks;

    const typesOptionsList = Utils.getOptionsList(contactTypePlaceholder, contactsTypesPossibleValues, 'type', 'id', 'name');

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form" style={{ backgroundColor: 'white' }}>
        <h2 className="list-view-filter-title">{noteTitle}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            <div className="col-md-4 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="keywords">{keywordsLabel}: </label>
                <Field
                  name="keywords"
                  type="text"
                  placeholder={`--${keywordsPlaceholder}--`}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>

            <div className="col-md-4 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field">
                <label htmlFor="name">{nameLabel}: </label>
                <Field
                  name="name"
                  type="text"
                  placeholder={`--${namePlaceholder}--`}
                  component={renderField}
                  className="tags-input"
                />
              </div>
            </div>

            <div className="col-md-4 col-sm-12 no-padd" >
              <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor="contactTypeId">{contactTypeLabel}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="contactTypeId"
                      component={renderSelect}
                      options={typesOptionsList} />
                  </div>
              </div>
            </div>

            <FilterActions
              formName={this.props.form}
              dispatch={this.props.dispatch}
            />

          </div>
        </div>
      </form>

    );
  }
}

FilterNotesTasks = reduxForm({
  form: 'FilterCFNotes',
})(FilterNotesTasks);

const mapStateToProps = (state) => {
  return {
    users: state.users,
    local: state.localization,
    notesTasks: state.CFTasks,
  }
};

export default connect(mapStateToProps)(FilterNotesTasks);
