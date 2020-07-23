import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

let TimeOut = null;

class FieldDialog extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      caption: this.props.field.caption || "",
      internalName: this.props.field.internalName || "",
      controlGroup: this.props.field.controlGroup || "",
      defaultValue: this.props.field.defaultValue || "",
      columns: this.props.field.width / this.props.columnSize,
      rows: this.props.field.height / this.props.columnSize,
      validColumns: true,
      validRows: true,
      isMandatory: this.props.field.isMandatory,
      isConditional: this.props.field.isConditional,
      triggerFieldName: this.props.field.triggerFieldName || "",
      showMore: false,
      dropDownList: this.props.field.referenceId || "",
      urlTitle: this.props.field.urlTitle || "",
      urlTarget: this.props.field.urlTarget || "",
    }

    this.onClicked = this.onClicked.bind(this);
    this.onDuplicate = this.onDuplicate.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onParamChange = this.onParamChange.bind(this);
    this.onToggleMandatory = this.onToggleMandatory.bind(this);
    this.onToggleConditional = this.onToggleConditional.bind(this);
    this.onColumnsChange = this.onColumnsChange.bind(this);
    this.onRowsChange = this.onRowsChange.bind(this);
    this.onDropDownListChange = this.onDropDownListChange.bind(this);
    this.getCollidingFieldsInArea = this.getCollidingFieldsInArea.bind(this);
    this.getLocalization = this.getLocalization.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const defaultValue = nextProps.field.defaultValue || "";
    const columns = nextProps.field.width / nextProps.columnSize;
    const rows = nextProps.field.height / nextProps.columnSize;
    const isMandatory = nextProps.field.isMandatory;

    this.setState({ defaultValue, columns, rows, isMandatory,
      validColumns: true, validRows:true, showMore:false });
  }

  onClicked(e) {
    e.stopPropagation();
  }

  onDropDownListChange(e) {
    //console.log(e.target.value);
    this.setState({dropDownList: e.target.value});
    const field = this.props.field;
    field.referenceId = e.target.value;
    if(this.props.saveChanges){
      this.props.saveChanges(field);
    }
  }

  showLimits () {
    const {field} = this.props;
    const element = document.getElementById("draggable-field-"+field.key);
    if(!element) return;

    element.style.backgroundColor = "#ffd9e1";
    if(TimeOut){
      clearTimeout(TimeOut);
      TimeOut = null;
    }
    TimeOut = setTimeout(function() {
      element.style.backgroundColor = "transparent";
    }, 1000);
  }

  getLocalization(name) {
    return this.props.local.strings.formBuilder[name] || '';
  }

  onParamChange (e, paramName) {
    const state = {};
    state[paramName] = e.target.value;
    this.setState(state);
    const field = this.props.field;
    field[paramName] = e.target.value;
    if(this.props.saveChanges){
      this.props.saveChanges(field);
    }
  }

  onToggleMandatory(e) {
    const isMandatory = !this.state.isMandatory;
    this.setState({isMandatory});
    const field = this.props.field;
    field.isMandatory = isMandatory;
    if(this.props.saveChanges){
      this.props.saveChanges(field);
    }
  }

  onToggleConditional(e) {
    const isConditional = !this.state.isConditional;
    this.setState({isConditional});
    const field = this.props.field;
    field.isConditional = isConditional;
    if(this.props.saveChanges){
      this.props.saveChanges(field);
    }
  }

  onColumnsChange(e) {
    const { field, columnSize, containerWidth } = this.props;
    const strValue = e.target.value.toString().replace(/[^0-9]/g,'');
    const value = parseInt(strValue, 10) || 0;
    const newWidth = value * this.props.columnSize;
    let isValid = true;
    const minCols = field.minWidth / columnSize;
    const maxCols = field.maxWidth / columnSize;

    // check space left
    if(containerWidth){
      const totalColumns = containerWidth / columnSize;
      const colPos = field.x / columnSize;
      if(colPos+value > totalColumns){
        isValid = false;
      }
    }

    // check range
    if(value < minCols || value > maxCols) {
      isValid = false;
    }

    // check collision
    const collisions = this.getCollidingFieldsInArea(field.x, field.y, newWidth, field.height, field.key)
    if(collisions.length) {
      isValid = false;
    }

    // save state
    this.setState({ columns: value, validColumns: isValid });
    this.showLimits();

    if(isValid){
      // SAVE
      field.width = newWidth;
      if(this.props.saveChanges){
        this.props.saveChanges(field);
      }
    }
  }

  onRowsChange(e) {
    const { field, columnSize } = this.props;
    const strValue = e.target.value.toString().replace(/[^0-9]/g,'');
    const value = parseInt(strValue, 10) || 0;
    const newHeight = value * columnSize;
    let isValid = true;
    const minRows = field.minHeight / columnSize;
    const maxRows = field.maxHeight / columnSize;

    // check range
    if(value < minRows || value > maxRows) {
      isValid = false;
    }

    // check collision
    const collisions = this.getCollidingFieldsInArea(field.x, field.y, field.width, newHeight, field.key)
    if(collisions.length) {
      isValid = false;
    }

    // save state
    this.setState({ rows: value, validRows: isValid });
    this.showLimits();

    if(isValid){
      // SAVE
      field.height = newHeight;
      if(this.props.saveChanges){
        this.props.saveChanges(field);
      }
    }
  }

  getCollidingFieldsInArea(x,y,w,h,id) {
    if (this.props.getCollidingFieldsInArea) {
      return this.props.getCollidingFieldsInArea(x,y,w,h,id);
    }
    return [];
  }

  onDuplicate() {
    if(this.props.onDuplicate){
      this.props.onDuplicate(this.props.field);
    }
  }

  onRemove() {
    if(this.props.onRemove){
      this.props.onRemove(this.props.field);
    }
  }

  hasLink() {
    const {type} = this.props.field;
    return type === "Literal";
  }

  hasInternalName() {
    const {type} = this.props.field;
    return type !== "Literal" && type !== "SectionDivider" && type !== "Sub Section Divider";
  }

  hasPlaceHolder() {
    const {type} = this.props.field;
    return (type !== "Date" && type !== "CheckBox" && type !== "Radio Button" && type !== "File Upload" &&
            type !== "Literal" && type !== "SectionDivider" && type !== "Sub Section Divider" &&
            type !== "Financial statement date") ;
  }

  hasControlGroup () {
    const {type} = this.props.field;
    return (type === "Radio Button" || type === "CheckBox");
  }

  hasMandatoryOption() {
    const {type} = this.props.field;
    return (type !== "Literal" && type !== "SectionDivider" && type !== "Sub Section Divider");
  }

  hasConditionalOption() {
    const {type} = this.props.field;
    return (type !== "SectionDivider" && type !== "Sub Section Divider");
  }

  canChangeSize() {
    const {type} = this.props.field;
    return type !== "SectionDivider";
  }

  hasMoreOptions() {
    const {type} = this.props.field;
    return type === "special type";
  }

  renderDefaultOptions () {
    return (
      <div className="dialogBody">
        <div className="dialogInputContainer">
          <label>LABEL:</label>
          <input value={this.state.caption} onChange={(e) => this.onParamChange(e, 'caption')} />
        </div>
        {
          this.hasLink() ?
          <div>
            <div className="dialogInputContainer">
              <label>URL TITLE:</label>
              <input value={this.state.urlTitle} onChange={(e) => this.onParamChange(e, 'urlTitle')} />
            </div>
            <div className="dialogInputContainer">
              <label>URL TARGET:</label>
              <input value={this.state.urlTarget} onChange={(e) => this.onParamChange(e, 'urlTarget')} />
            </div>
          </div> : null
        }
        {
          this.hasInternalName() ?
          <div className="dialogInputContainer">
            <label>NAME:</label>
            <input value={this.state.internalName} onChange={(e) => this.onParamChange(e, 'internalName')} />
          </div> : null
        }
        {
          this.hasPlaceHolder() ?
          <div className="dialogInputContainer">
            <label>HOLDER:</label>
            <input value={this.state.defaultValue} onChange={(e) => this.onParamChange(e, 'defaultValue')} />
          </div> : null
        }
        {
          this.hasControlGroup() ?
          <div className="dialogInputContainer">
            <label>GROUP:</label>
            <input value={this.state.controlGroup} onChange={(e) => this.onParamChange(e, 'controlGroup')} />
          </div> : null
        }
        {
          this.props.field.type === "DropDown" || this.props.field.type === "Multi Select"?
          <div className="dialogInputContainer">
            <label>LIST:</label>
            <select value={this.state.dropDownList} onChange={this.onDropDownListChange}>
              <option value="">--Select a list--</option>
              {
                this.props.dropDownLists.map((item, idx) => {return (
                  <option key={idx} value={item.id}>{item.name}</option>
                )})
              }
            </select>
          </div> : null
        }
        {
          this.canChangeSize() ?
            <div>
              <div className="dialogInputContainer">
                <label>WIDTH:</label>
                <input
                  type="number"
                  style={{width: "60px"}}
                  value={this.state.columns}
                  onChange={this.onColumnsChange}
                  className={this.state.validColumns? "":"dialogError"} />
                <label className="description">Columns</label>
              </div>
              <div className="dialogInputContainer">
                <label>HEIGHT:</label>
                <input
                  type="number"
                  style={{width: "60px"}}
                  value={this.state.rows}
                  onChange={this.onRowsChange}
                  className={this.state.validRows? "":"dialogError"} />
                <label className="description">Rows</label>
              </div>
            </div> : null
        }
        {
          this.hasMandatoryOption() ?
            <div className="dialogInputContainer">
              <label className="dialogCheckbox">
                MANDATORY:
                <input type="checkbox" checked={this.state.isMandatory} onChange={this.onToggleMandatory}/>
              </label>
            </div> : null
        }
        {
          this.hasConditionalOption() ?
            <div className="dialogInputContainer">
              <label className="dialogCheckbox">
                CONDITIONAL:
                <input type="checkbox" checked={this.state.isConditional} onChange={this.onToggleConditional}/>
              </label>
            </div> : null
        }
        {
          this.state.isConditional ?
          <div className="dialogInputContainer">
            <label>TRIGGER:</label>
            <input value={this.state.triggerFieldName} onChange={(e) => this.onParamChange(e, 'triggerFieldName')} />
          </div> : null
        }
        {
          this.hasMoreOptions() ?
            <div className="dialogInputContainer">
              <button
                className="btnMore"
                onClick={()=>this.setState({showMore:true})}>
                Show more properties
              </button>
            </div> : null
        }
      </div>
    );
  }

  renderMoreOptions() {
    switch (this.props.field.type) {
      case "special type" :
        return this.renderSpecialTypeOptions();
      default:
        return null;
    }
  }

  renderSpecialTypeOptions () {
    return (
      <div className="dialogBody">
      </div>
    );
  }

  render() {
    const { x, y, left, width, field } = this.props;
    const typeLabel = this.getLocalization(field.type.replace(/\s+/g, ''));

    let className = "fieldDialogRight";
    const style = {
      left: x,
      top: y
    }

    if (width) {
      style.width = width;
    }

    if(left) {
      className = "fieldDialogLeft";
    }

    return (
      <div id="fieldDialog" className={className} onClick={this.onClicked} style={style} >
        <div className="typeTitle" >{typeLabel}</div>
        {
          this.state.showMore? this.renderMoreOptions() : this.renderDefaultOptions()
        }
        <div className="dialogFooter">
          <button type="button" className="dialogFooterBtn" onClick={this.onDuplicate} >
            <span className="btnIcon linear-icon-copy"></span>
          </button>
          <button type="button" className="dialogFooterBtn" onClick={this.onRemove} >
            <span className="btnIcon linear-icon-trash2"></span>
          </button>
        </div>
      </div>
    )
  }
}

FieldDialog.defaultProps = {
  columnSize: 1
};

FieldDialog.propTypes = {
  field: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  left: PropTypes.bool.isRequired,
  width: PropTypes.number,
  onDuplicate: PropTypes.func,
  onRemove: PropTypes.func,
  saveChanges: PropTypes.func,
  getCollidingFieldsInArea: PropTypes.func,
  containerWidth: PropTypes.number,
  columnSize: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    local: state.localization
  };
};

export default connect(mapStateToProps)(FieldDialog);
