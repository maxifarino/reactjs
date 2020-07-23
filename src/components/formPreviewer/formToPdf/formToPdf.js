import jsPDF from 'jspdf';
const _ = require('lodash');
const Definitions = require('../../formBuilder/definitions');

const FormTitleFontSize = 18;
const SectionTitleFontSize = 13;
const SubSectionTitleFontSize = 11;
const FieldFontSize = 8;
const pdfWidth = 210;
const pdfHeight = 295;
const margin = 10;
const formWidth = pdfWidth - (margin*2);
const formHeight = pdfHeight - (margin*2);
//const newSectionSpace = 25;
//const newFieldsSpace = 5;
let lastFieldY = 0;
let yOffset = 0;
let formPreviewer = null;

const formTitleSpacing = 20;
const formDescriptionLineSize = 6;

const gridPosToPdfPixel = (pos) => {
  const scale = formWidth/Definitions.formGrid.containerWidth;
  const pixelPos = pos * Definitions.formGrid.columnSize;
  return pixelPos * scale;
}

const addField = (field, doc) => {
  const x = gridPosToPdfPixel(field.columnPos) + margin;
  let y = gridPosToPdfPixel(field.rowPos) + yOffset;
  const width = gridPosToPdfPixel(field.fieldLength);
  const height = gridPosToPdfPixel(field.rowsCount);
  const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
  //label support
  const labelWidth = gridPosToPdfPixel(15);
  const textLines = field.caption? doc.splitTextToSize(field.caption, labelWidth-1):'';
  // calculate if this element needs a new page
  const newPageNeeded = Math.floor((y + height) / formHeight) > 0;
  if(newPageNeeded) {
    doc.addPage ();
    currentContentPage++;
    // reset the offset so it becomes negative using the rowPos and leaving a margin
    yOffset = margin-gridPosToPdfPixel(field.rowPos);
    // calculate the new position using the new offset
    y = gridPosToPdfPixel(field.rowPos) + yOffset;
    // reset the last field
    lastFieldY = 0;
  }

  // check if this element is the lowest so far
  if(y + height > lastFieldY) {
    lastFieldY = y + height;
  }

  // draw a rect container and then the element by type if not a section divider
  //if(type !== 'SectionDivider')doc.rect(x, y, width, height);

  switch (type) {
    case 'SectionDivider':
      doc.setFontSize(SectionTitleFontSize);
      doc.line(margin, y+5, formWidth+margin, y+5);
      if(field.caption){
        const literalLines = doc.splitTextToSize(field.caption, width-1);
        doc.text(literalLines, margin, y+11);
        doc.line(margin, y+10+(literalLines.length*5), formWidth+margin, y+10+(literalLines.length*5));
      } else {
        doc.line(margin, y+height-5, formWidth+margin, y+height-5);
      }
      indexAllItems.push({type, page: currentContentPage, caption: field.caption, top: y});
      //addItemToTableOfContents({type, page: currentContentPage, caption: field.caption, top: y}, doc);
      break;
    case 'Sub Section Divider':
      doc.setFontSize(SubSectionTitleFontSize);
      if(field.caption){
        const literalLines = doc.splitTextToSize(field.caption, width-1);
        doc.text(literalLines, x+1, y+11);
        doc.line(x, y+9+(literalLines.length*4), x+width, y+9+(literalLines.length*4));
      } else {
        doc.line(x, y+height-4, x+width, y+height-4);
      }
      indexAllItems.push({type, page: currentContentPage, caption: field.caption, top: y});
      //addItemToTableOfContents({type, page: currentContentPage, caption: field.caption, top: y}, doc);
      //doc.text(x+1, y+8, field.caption);
      //doc.line(x, y+height-4, width, y+height-4);
      //doc.rect(x, y, width, height);
      break;
    case 'Literal':
      if(field.caption){
        const caption = field.caption.replace('<%=link%>', field.urlTitle);
        const literalLines = doc.splitTextToSize(caption, width-1);
        doc.text(literalLines, x+1, y+4.5);
      }
      //doc.text(x+1, y+4.5, field.caption);
      break;
    case 'Paragraph':
      //label
      doc.text(textLines, x+1, y+(4.5/textLines.length));
      // field
      const p = new window.TextField();
      p.Rect = [x+labelWidth, y, width-labelWidth, height];
      doc.rect(x+labelWidth, y, width-labelWidth, height);
      //d.Rect = [x, y, width, height];
      p.multiline = true;
      doc.addField(p);
      break;
    case 'CheckBox':
      const c = new window.CheckBox();
      doc.rect(x+1, y+1, height-2, height-2);
      c.Rect = [x+1, y+1, height-2, height-2];
      c.AS = "/Off";
      doc.addField(c);
      doc.text(x+1+height, y+4.5, field.caption);
      break;
    case 'Radio Button':
      const r = new window.CheckBox();
      doc.rect(x+1, y+1, height-2, height-2);
      r.Rect = [x+1, y+1, height-2, height-2];
      r.AS = "/Off";
      doc.addField(r);
      doc.text(x+1+height, y+4.5, field.caption);
      break;
    case 'DropDown':
    case 'Multi Select':
    case 'Source of financial statement':
    case 'Period':
    case 'Company Type':
      //label
      doc.text(textLines, x+1, y+(4.5/textLines.length));
      // field
      let possibleValues = `[(${field.defaultValue})`;
      const dropDownList = getPossibleDropDownValues(field);
      if(dropDownList && dropDownList.length>0){
        for (var i = 0; i < dropDownList.length; i++) {
          possibleValues += `(${dropDownList[i].name})`;
        }
      }
      possibleValues += "]";
      var d = new window.ComboBox();
      d.Rect = [x+labelWidth, y, width-labelWidth, height];
      doc.rect(x+labelWidth, y, width-labelWidth, height);
      //d.Rect = [x, y, width, height];
      d.Opt = possibleValues;
      d.DV = `(${field.defaultValue})`;
      doc.addField(d);
      break;
    default:
      //label
      doc.text(textLines, x+1, y+(4.5/textLines.length));
      // field
      const t = new window.TextField();
      t.Rect = [x+labelWidth, y, width-labelWidth, height];
      doc.rect(x+labelWidth, y, width-labelWidth, height);
      //d.Rect = [x, y, width, height];
      t.multiline = false;
      doc.addField(t);
      break;
  }
}

const addSection = (section, doc) => {
  // order fields by Y and Height for pages calculation
  const fields = _.orderBy(section.fields, ['rowPos','rowsCount','columnPos','fieldLength']);
  // render all fields in this section
  for (var i = 0; i < fields.length; i++) {
    doc.setFontSize(FieldFontSize);
    addField(fields[i], doc);
  }
}

let currentContentPage;
export function getPdfDoc (form) {
  const doc = new jsPDF();

  // add table of contents
  //addTableOfContents(form, doc);
  //currentContentPage = indexTotalPages+1;
  currentContentPage = 1;
  indexAllItems = [];

  yOffset = margin;
  lastFieldY = 0;

  // Render the form title
  if(form.name) {
    doc.setFontSize(FormTitleFontSize);
    doc.text(margin, yOffset+10, form.name);
    yOffset += formTitleSpacing;
  }

  // Render the form description
  if(form.description) {
    var textLines = doc
    	.setFontSize(SectionTitleFontSize)
    	.splitTextToSize(form.description, formWidth);

    doc.text(textLines, margin, yOffset+formDescriptionLineSize);
    yOffset += formDescriptionLineSize*textLines.length+margin;
  }

  // order the sections by positionIndex
  let sections = _.orderBy(form.formSections, 'positionIndex', 'asc');
  // render each section
  for (var i = 0; i < sections.length; i++) {
    // add section only if it has content
    if (sections[i].fields && sections[i].fields.length) {
      addSection(sections[i], doc);
    }

    //add new page if necessary
    const nextIdx = i+1;
    if (nextIdx < sections.length && sections[nextIdx].fields && sections[nextIdx].fields.length) {
      doc.addPage ();
      currentContentPage++;
      yOffset = margin;
    }
  }

  //addIndexItems(doc);

  return doc;
}

//let indexTotalPages;
//let indexCurrentPage;
//let indexCurrentItem;
//let indexCurrentOffset;
let indexAllItems;
//const indexItemSeparation = 15;

/*const addTableOfContents = (form, doc) => {
  //calculate the number of sections and subsections
  let items = 0;
  const sections = form.formSections;
  for (var i = 0; i < sections.length; i++) {
    const section =  sections[i];
    if (section.fields && section.fields.length) {
      const fields = section.fields;
      for (var j = 0; j < fields.length; j++) {
        const field = fields[j];
        const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
        if(type === 'SectionDivider' || type === 'Sub Section Divider') {
          items++;
        }
      }
    }
  }

  //calculate the number of pages it will have
  indexTotalPages = 0;
  let tempOffset = margin;
  if (items > 0) {
    indexTotalPages++;
    //title
    tempOffset += formTitleSpacing+5;
    for (var k = 0; k < items; k++) {
      // calculate if theres space in current page
      const newPageNeeded = Math.floor((tempOffset + indexItemSeparation) / formHeight) > 0;
      if(newPageNeeded) {
        indexTotalPages++
        tempOffset = margin+5;
      }
      tempOffset += indexItemSeparation;
    }
  }

  //if there are pages, we add them and the title but not the items just yet
  if (indexTotalPages > 0) {
    indexCurrentPage = 1;
    //indexCurrentItem = 0;
    indexCurrentOffset = margin;
    indexAllItems = [];
    for (var l = 0; l < indexTotalPages; l++) {
      if(l === 0){
        //title
        doc.setFontSize(FormTitleFontSize);
        doc.text(margin, indexCurrentOffset+10, 'Table of Contents');
        indexCurrentOffset += formTitleSpacing+5;
      } else {
        doc.addPage();
      }
    }

    doc.addPage();
  }
}
*/

/*const addIndexItems = (doc) => {
  if (indexTotalPages > 0 && indexAllItems.length > 0) {
    indexCurrentPage = 1;
    doc.setPage(indexCurrentPage);
    doc.setFontSize(SectionTitleFontSize);
    let numeral = 0;
    for (var i = 0; i < indexAllItems.length; i++) {
      const item = indexAllItems[i];
      const xMargin = item.type === 'SectionDivider'? 20:25;
      const marker = item.type === 'SectionDivider'? `${++numeral}.`:'-';
      let caption = `${marker} ${item.caption}`;
      if(caption.length > 65) caption = caption.substring(0,65)+"...";
      const newPageNeeded = Math.floor((indexCurrentOffset + indexItemSeparation) / formHeight) > 0;
      if(newPageNeeded) {
        indexCurrentPage++;
        doc.setPage(indexCurrentPage);
        indexCurrentOffset = margin+5;
      }
      doc.textWithLink(caption, xMargin, indexCurrentOffset, {pageNumber: item.page, top: item.top});
      doc.textWithLink(item.page.toString(), formWidth-20, indexCurrentOffset, {pageNumber: item.page, top: item.top});
      indexCurrentOffset += indexItemSeparation;
    }
  }
}*/

/*const addItemToTableOfContents = (item, doc) => {
  doc.setPage(indexCurrentPage);
  doc.setFontSize(SectionTitleFontSize);
  const xMargin = item.type === 'SectionDivider'? 20:25;
  const marker = item.type === 'SectionDivider'? `${++indexCurrentItem}.`:'-';
  let caption = `${marker} ${item.caption}`;
  if(caption.length > 80) caption = caption.substring(0,80)+"...";
  // calculate if theres space in current page
  const newPageNeeded = Math.floor((indexCurrentOffset + indexItemSeparation) / formHeight) > 0;
  if(newPageNeeded) {
    indexCurrentPage++;
    indexCurrentOffset = margin+5;
  }
  doc.setPage(indexCurrentPage);
  doc.textWithLink(caption, xMargin, indexCurrentOffset, {pageNumber: item.page, top: item.top});
  indexCurrentOffset += indexItemSeparation;
  doc.setPage(item.page);
}*/

export function setPreviewer (previewer) {
  formPreviewer = previewer;
}

const getPossibleDropDownValues = (field) => {
  const type = field.type || Definitions.getFieldTypeNameById(field.typeId);
  switch (type) {
    case 'DropDown':
    case 'Multi Select':
      const formFieldsLists = formPreviewer.formFieldsLists;
      const index = _.findIndex(formFieldsLists, function(o) {
        return o.id.toString() === field.referenceId.toString();
      });
      return index !== -1? formFieldsLists[index].possibleValues:[];
    case 'Source of financial statement':
      return formPreviewer.scorecardsSourcesList;
    case 'Period':
      return formPreviewer.turnOverRatesList;
    case 'Company Type':
      return formPreviewer.companiesTypesList;
    default:
      return [];
  }
}
