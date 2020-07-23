const types = [
  "None", // id=0
  "Literal",
  "Text",
  "Currency",
  "Integer",//not implemented
  "Float",//not implemented
  "Date",
  "CheckBox",
  "File Upload",
  "Paragraph",
  "Email", // id=10
  "SectionDivider",
  "Bool",//not implemented
  "Component",//not implemented
  "Status",//not implemented
  "Message Template",//not implemented
  "User Or Role",//not implemented
  "Specific User Or Role",//not implemented
  "DropDown",
  "Radio Button",
  "Phone", // id=20
  "Sub Section Divider",
  "Source of financial statement",
  "Financial statement date",
  "Period",
  "Company Type",
  "Remediation Components",
  "Multi Select"
];

export const formGrid = {
  containerWidth: 780,
  columnSize: 10,
  spacing: 10
}

export function getFieldDefinition(type){
  switch(type){
    case 'Literal'://label
      return {
        title: 'etv', type,
        width: 160,
        minWidth: 160,
        maxWidth: 780,
        height: 30,
        minHeight: 30,
        maxHeight: 160,
        isMandatory: false,
      }

    case 'Text':
      return {
        title: 'etv', type,
        width: 340,//160
        minWidth: 220,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'textBoxPlaceholder',
      }

    case 'Date':
      return {
        title: 'etv', type,
        width: 340,//160
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }

    case 'CheckBox':
      return {
        title: 'etv', type,
        width: 150,
        minWidth: 60,
        maxWidth: 780,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }
    case 'Radio Button':
      return {
        title: 'etv', type,
        width: 150,
        minWidth: 60,
        maxWidth: 780,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }
    case 'Paragraph'://textarea
      return {
        title: 'etv', type,
        width: 470,//320
        minWidth: 310,//160
        maxWidth: 780,
        height: 80,
        minHeight: 30,
        maxHeight: 160,
        isMandatory: true,
        l18nHolder: 'paragraphPlaceholder',
      }

    case 'Email':
      return {
        title: 'etv', type,
        width: 340,//200
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'emailHolder',
      }

    case 'Phone':
      return {
        title: 'etv', type,
        width: 340,//200
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'phonePlaceholder',
      }

    case 'Currency':
      return {
        title: 'etv', type,
        width: 340,//200
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'currencyPlaceholder',
      }

    case 'Password':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 160,
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }

    case 'File Upload':
      return {
        title: 'etv', type,
        width: 340,//320
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }

    case 'SectionDivider':
      return {
        title: 'etv', type,
        width: 780,
        minWidth: 780,
        maxWidth: 780,
        height: 80,
        minHeight: 80,
        maxHeight: 80,
        isMandatory: false,
        l18nLabel: 'newSectionLabel',
      }

    case 'Sub Section Divider':
      return {
        title: 'etv', type,
        width: 160,
        minWidth: 100,
        maxWidth: 780,
        height: 60,
        minHeight: 60,
        maxHeight: 60,
        isMandatory: false,
        l18nLabel: 'subSectionLabel',
      }

    case 'DropDown':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'dropDownPlaceholder',
      }

    case 'Source of financial statement':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'sourceOfFinancialStatementPlaceholder',
      }

    case 'Financial statement date':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }

    case 'Period':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'periodPlaceholder',
      }

    case 'Company Type':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'companyTypePlaceholder',
      }

    case 'Multi Select':
      return {
        title: 'etv', type,
        width: 340,
        minWidth: 320,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
        l18nHolder: 'multiSelectPlaceholder',
      }

    default:
      return {
        title: 'etv', type,
        width: 340,//160
        minWidth: 220,//160
        maxWidth: 480,
        height: 30,
        minHeight: 30,
        maxHeight: 30,
        isMandatory: true,
      }
  }
}

export function getFieldTypeNameById (id) {
  if(id >= types.length) return 'Text';
  return types[id];
}

export function getFieldTypeIdByName (name) {
  let idx = types.indexOf(name);
  if (idx === -1) idx = 2;
  return idx;
}

export function hasLabel (type) {
  return (type !== 'None' && type !== 'Literal' && type !== 'SectionDivider' &&
          type !== 'Sub Section Divider' && type !== 'CheckBox' && type !== 'Radio Button' );
}
