import * as types from './types';
import Api from '../../../lib/api';
import Utils from '../../../lib/utils';

const async = require('async');

export const clearForm = () => {
  return (dispatch, getState) => {
    dispatch({type: types.CLEAR_BUILDER_FORM });
  }
}

export const getFormById = (formId)=> {
  return (dispatch, getState) => {
    dispatch({type: types.SET_BUILDER_LOADING});
    const token = getState().login.authToken;
    return Api.get(
      `forms?formId=${formId}&justFormData=false`,
      token
    ).then((data) => {
      const res = data.data;
      const form = res.data.forms && res.data.forms.length > 0? res.data.forms[0]:null;
      dispatch({type: types.ASSIGN_BUILDER_FORM, form });
    })
  }
}

export const saveForm = (form)=> {
  return (dispatch, getState) => {
    dispatch({ type: types.CREATE_FORM_START });
    const loginState = getState().login;
    //const token = getState().login.authToken;
    //const userId = getState().login.profile.Id;
    if (form.needsUpdate) {
      console.log("saving form");
      postFormRequest(form, loginState, (formData) => {
        console.log("form done", formData.success);
        if(!formData.success) {
          console.log("There was an error creating the form");
          dispatch({ type: types.CREATE_FORM_FAILED, form, error: "There was an error creating the form" });
          return;
        }

        // form was saved, assign the new id
        form.id = formData.data.formId;
        form.needsUpdate = false;

        saveSections (form.id, form.formSections, loginState, function (err, result){
          form.formSections = result;
          if(err) {
            console.log(err);
            dispatch({ type: types.CREATE_FORM_FAILED, form, error: err.error });
          } else {
            dispatch({ type: types.CREATE_FORM_SUCCESS, form });
          }
        });

      });
    } else {
      console.log("skipping form");
      // form doesn't need update but maybe the sections do
      saveSections (form.id, form.formSections, loginState, function (err, result){
        form.formSections = result;
        if(err) {
          console.log(err);
          dispatch({ type: types.CREATE_FORM_FAILED, form, error: err.error });
        } else {
          dispatch({ type: types.CREATE_FORM_SUCCESS, form });
        }
      });
    }

  }
}

const saveSections = (formId, sections, loginState, callback) => {
  let error = null;
  async.mapSeries(sections, function(section, cb) {
    if (section.needsUpdate) {
      console.log("saving section");
      // update only if needed
      postFormSectionRequest (formId, section, loginState, function(sectionData) {
          if(!sectionData.success) {
            error = {error: "There was an error saving the sections"};
            cb(null, section);
          } else {
            // section was saved, assign the new id
            section.id = sectionData.data.sectionId;
            section.needsUpdate = false;
            // save the sections fields
            saveFields(section.id, section.fields, loginState, function(err, result){
              if(err) {
                error = err;
              }
              section.fields = result;
              cb(null, section);
            });

          }
      });

    } else {
      console.log("skipping section");
      // section doesn't need update but maybe the fields do
      saveFields(section.id, section.fields, loginState, function(err, result){
        if(err) {
          error = err;
        }
        section.fields = result;
        cb(null, section);
      });
    }

  }, function(err, result){
    return callback(error, result);
  });
}

const saveFields = (sectionId, fields, loginState, callback) => {
  let error = null;
  async.mapSeries(fields, function(field, cb) {
    if (field.needsUpdate) {
      console.log("saving field");
      // update only if needed
      postSectionFieldRequest (sectionId, field, loginState, (fieldData) => {
          if(fieldData.success) {
            //field was saved, assign the new id
            field.id = fieldData.data.fieldId;
            field.needsUpdate = false;
          } else {
            //something happened, assign the error en continue
            console.log(fieldData);
            error = {error: "There was an error saving the fields"};
          }
          cb(null, field);

      });

    } else {
      console.log("skipping field");
      // no update needed for this field
      cb(null, field);
    }

  }, function(err, result){
    return callback(error, result);
  });
}

const postFormRequest = (form, loginState, callback) => {
  const token = loginState.authToken;
  const userId = loginState.profile.Id;
  //const userId = loginState.id;

  const body = {
    id: form.id,
    name: form.name,
    hiringClientId: form.hiringClientId,
    description: form.description,
    userId,
    creatorUserId: userId,
    SubcontractorFee: Utils.normalizeCurrency(form.subcontractorFee),
  };

  if (form.id) {
    // update
    console.log("form update");
    Api.put(
      `forms/`,
      body,
      token
    ).then((data)=> {
      callback(data.data);
    });
  } else {
    // creation
    console.log("form creation");
    Api.post(
      `forms/`,
      body,
      token
    ).then((data)=> {
      callback(data.data);
    });
  }

  //callback ({success: true, data: {formId: 1}});
}

const postFormSectionRequest = (formId, section, loginState, callback) => {
  const token = loginState.authToken;

  const body = {
    formId: formId,
    id: section.id,
    sectionTitle: section.title,
    sectionPositionIndex: section.positionIndex.toString()
  };

  if (section.id) {
    // update
    console.log("section update");
    Api.put(
      'formssections/',
      body,
      token
    ).then((data)=> {
      callback(data.data);
    });

  } else {
    // creation
    console.log("section creation");
    Api.post(
      'formssections/',
      body,
      token
    ).then((data)=> {
      callback(data.data);
    });

  }

  //callback ({success: true, data: {sectionId: 1}});
}

const postSectionFieldRequest = (formSectionId, field, loginState, callback) => {
  const token = loginState.authToken;
  const body = {
    formSectionId,
    id: field.id,
    controlGroup: field.controlGroup,
    caption: field.caption,
    referenceId: field.referenceId,
    internalName: field.internalName,
    typeId: field.typeId === -1? 2:field.typeId,//default to text box if something goes wrong
    defaultValue: field.defaultValue,
    columnPos: field.columnPos.toString(),
    rowPos: field.rowPos.toString(),
    fieldLength: field.fieldLength,//always > 0
    rowsCount: field.rowsCount,//always > 0
    valueLength: field.valueLength || '0', //not used
    maxValue: field.maxValue,
    minValue: field.minValue,
    isMandatory: field.isMandatory.toString(),
    hasBorder: field.hasBorder.toString(),
    isConditional: field.isConditional.toString(),
    triggerFieldName: field.triggerFieldName,
    urlTitle: field.urlTitle,
    urlTarget: field.urlTarget,
  };

  if (field.id) {
    // update
    console.log("field update");
    Api.put(
      `formssectionsfields/`,
      body,
      token
    ).then((data)=> {
      callback(data.data);
    });

  } else {
    // creation
    console.log("field creation");
    Api.post(
      `formssectionsfields/`,
      body,
      token
    ).then((data)=> {
      callback(data.data);
    });

  }

  //callback ({success: true, data: {fieldId: 1}});
}

// DELETE
export const deleteField = (fieldId, form)=> {
  return (dispatch, getState) => {
    dispatch({type: types.SET_BUILDER_LOADING});
    const token = getState().login.authToken;
    return Api.delete(
      `formssectionsfields/`,
      { id: fieldId },
      token
    ).then((data) => {
      if (data.data.success) {
        dispatch({type: types.FIELD_DELETE_SUCCESS, form});
      } else {
        dispatch({type: types.FIELD_DELETE_FAILED});
      }
    })
  }
}

export const deleteSection = (sectionId, form)=> {
  return (dispatch, getState) => {
    dispatch({type: types.SET_BUILDER_LOADING});
    const token = getState().login.authToken;
    return Api.delete(
      `formssections/`,
      { id: sectionId },
      token
    ).then((data) => {
      if (data.data.success) {
        dispatch({type: types.SECTION_DELETE_SUCCESS, form});
      } else {
        dispatch({type: types.SECTION_DELETE_FAILED});
      }
    })
  }
}
