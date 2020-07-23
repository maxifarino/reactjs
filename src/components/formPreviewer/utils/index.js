import Utils from '../../../lib/utils';
const Definitions = require('../../formBuilder/definitions');

export function getFormFieldValues (form) {
  const fieldValues = [];
  const sections = form && form.formSections ? form.formSections:[];

  for (var i = 0; i < sections.length; i++) {
    const fields = sections[i].fields;
    for (var j = 0; j < fields.length; j++) {
      // go through all fields in sections
      const field = fields[j];
      const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
      // if the field can have an input we save it in the values array
      if(type !== "Literal" && type !== "SectionDivider" && type !== "Sub Section Divider"){
        const key = `section-${i}-field-${j}`;
        field.key = key;
        const fieldValue = {
          key,
          type,
          typeId: field.typeId,
          value: type === 'CheckBox'? false:null,
          fieldId: field.Id || field.id,
          isMandatory: Utils.parseBoolean(field.isMandatory)
        }
        fieldValues.push (fieldValue);
      }

    }
  }

  return fieldValues;
}
