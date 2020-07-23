import React from 'react';
import Rnd from 'react-rnd'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Definitions = require('../definitions');

class FormBuilderField extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ignoreClick: false
    }

    this.onFieldClicked = this.onFieldClicked.bind(this);
    this.inputType = this.inputType.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  showLimits (show) {
    const {field} = this.props;
    const element = document.getElementById("draggable-field-"+field.key);
    element.style.backgroundColor = show ? "#ffd9e1":"transparent";
  }

  getSize(val) {
    if (this.props.getScaledSize) {
      return this.props.getScaledSize(val);
    }
    return val;
  }

  getCollidingFieldsInArea(x,y,w,h,key) {
    if (this.props.getCollidingFieldsInArea) {
      return this.props.getCollidingFieldsInArea(x,y,w,h,key);
    }
    return [];
  }

  saveChanges(field) {
    if (this.props.saveChanges) {
      this.props.saveChanges(field)
    }
  }

  onFieldClicked(e) {
    if(!this.state.ignoreClick){
      e.stopPropagation();
      if(this.props.onFieldClicked){
        this.props.onFieldClicked(e, this.props.field);
      }
    } else {
      this.setState({ignoreClick: false});
    }
  }

  snapToGrid (pos) {
    const columnSize = this.props.columnSize;
    const currentColumn = Math.round(pos/columnSize);
    return currentColumn * columnSize;
  }

  renderOption (option) {
    const { optionWidth } = this.props.field;
    const label = option.label;
    const width = this.getSize(optionWidth);
    const self = this;

    const handleChange = function(e) {
      const field = self.props.field;
      const index = field.options.indexOf(option);
      field.options[index].label = e.target.value;
      self.saveChanges(field);
    }

    return (
      <span key={option.key} style={{display: "inline-table", marginLeft: "10px"}}>
        <input type="checkbox" disabled/>
        <input onChange={handleChange} style={{width, fontWeight: 'bold', color: '#42b9f4', border: 'none', backgroundColor: 'transparent'}} value={label} />
      </span>
    );
  }

  inputType (field) {
    switch(field.type){
      case 'SectionDivider':
        return <div className='sectionDivider' ><label>{field.caption}</label></div>
      case 'Sub Section Divider':
        return <div className='subSectionDivider' ><label>{field.caption}</label></div>
      case 'Literal':
        return <label className='labelField' style={{marginLeft: '5px'}} >{field.caption}</label>
      case 'Paragraph':
        return <textarea className='field' style={{width: '100%', height: '100%'}} placeholder={field.defaultValue}/>
      case 'CheckBox':
        return (
          <div className="checkboxContainer">
            <input disabled type="checkbox" />
            <label className='labelField' style={{fontWeight: '400'}}>
              {field.caption}
            </label>
          </div>
        );
      case 'Radio Button':
        return (
          <div className="checkboxContainer">
            <input disabled type="radio" />
            <label className='labelField' style={{fontWeight: '400'}}>
              {field.caption}
            </label>
          </div>
        );
      case 'File Upload':
        return (
          <div className="fileContainer">
            <input disabled type="file" style={{width: '100%', height: 'auto', overflow: 'auto'}} placeholder={field.defaultValue} />
          </div>
        );
      case 'Email':
        return <input disabled type="email" className='field' style={{width: '100%', height: '100%'}} placeholder={field.defaultValue} />
      case 'Date':
      case 'Financial statement date':
        return <input disabled type="date" className='field' style={{width: '100%', height: '100%'}} placeholder={field.defaultValue} />
      case 'DropDown':
      case 'Multi Select':
      case 'Source of financial statement':
      case 'Period':
      case 'Company Type':
        return (
          <select disabled value="" className='field' style={{width: '100%', height: '100%'}}>
            <option value="">{field.defaultValue}</option>
          </select>
        );
      default:
        return <input disabled type="text" className='field' style={{width: '100%', height: '100%'}} placeholder={field.defaultValue} />

    }
  }

  render() {
    const { field, columnSize, containerSelector } = this.props;
    const scale = this.props.scale || 1;
    const labelStyle = {
      minWidth: this.getSize(150),
      width: this.getSize(150),
      marginLeft: '5px',
      marginRight: '5px',
      whiteSpace: 'initial'
    };
    const extendsProps = {
      onClick: this.onFieldClicked,
      id: "draggable-field-"+field.key
    };

    return (
      <Rnd
        extendsProps={extendsProps}
        minWidth={this.getSize(field.minWidth)}
        minHeight={this.getSize(field.minHeight)}
        resizeGrid={[this.getSize(columnSize),this.getSize(columnSize)]}
        dragGrid={[this.getSize(columnSize),this.getSize(columnSize)]}
        bounds={containerSelector}
        position={{
          x: this.getSize(field.x),
          y: this.getSize(field.y)}}
        default={{
          width: this.getSize(field.width),
          height: this.getSize(field.height)
        }}
        onDragStart={(el, d) => {
          field.lastX = field.x;
          field.lastY = field.y;
        }}
        onDrag={(el, d) => {
          this.setState({ignoreClick: true});
          this.showLimits(true);
        }}
        onDragStop={(ev, d) => {
          //rendered position might be scaled, we have to change it back for calculations
          d.x = this.snapToGrid(d.x/scale);
          d.y = this.snapToGrid(d.y/scale);

          if(d.x < 0)d.x = 0;
          if(d.y < 0)d.y = 0;

          const collisions = this.getCollidingFieldsInArea(d.x, d.y, field.width, field.height, field.key);
          field.x = collisions.length ? field.lastX : d.x;
          field.y = collisions.length ? field.lastY : d.y;
          this.saveChanges(field);
          this.showLimits(false);
        }}
        onResizeStart={(el, d) => {
          field.lastWidth = field.width;
          field.lastHeight = field.height;
        }}
        onResize={(ev, d, ref, delta, position) => {
          this.setState({ignoreClick: true});
          // library has a bug in which max values are not assigned so we have to check manually
          const maxWidth = this.getSize(field.maxWidth);
          const maxHeight = this.getSize(field.maxHeight);
          if (maxWidth && ref.offsetWidth > maxWidth){
            ref.style.width = maxWidth+'px';
          }
          if (maxHeight && ref.offsetHeight > maxHeight){
            ref.style.height = maxHeight+'px';
          }
          this.showLimits(true);
        }}
        onResizeStop={(ev, d, ref, delta, pos) => {
          //rendered size might be scaled, we have to change it back for calculations
          let finalWidth = this.snapToGrid(ref.offsetWidth/scale);
          let finalHeight = this.snapToGrid(ref.offsetHeight/scale);

          const collisions = this.getCollidingFieldsInArea(field.x, field.y, finalWidth, finalHeight, field.key);

          if(collisions.length){
            finalWidth = field.lastWidth
            finalHeight = field.lastHeight
          }

          field.width = finalWidth;
          field.height = finalHeight;
          // force the style to use the new size (lib won't do it automatically)
          ref.style.width = this.getSize(finalWidth)+'px';
          ref.style.height = this.getSize(finalHeight)+'px';

          this.saveChanges(field);
          this.showLimits(false);
        }}
      >
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center'}}>
          {
            Definitions.hasLabel(field.type)?
            <label className='labelField' style={labelStyle} >{field.caption}</label>
            :null
          }
          {this.inputType(field)}
        </div>
      </Rnd>
    )
  };
};

FormBuilderField.defaultProps = {
  columnSize: 1,
  scale: 1
};

FormBuilderField.propTypes = {
  field: PropTypes.object.isRequired,
  containerSelector: PropTypes.string.isRequired,
  columnSize: PropTypes.number,
  scale: PropTypes.number,
  saveChanges: PropTypes.func,
  getCollidingFieldsInArea: PropTypes.func,
  getScaledSize: PropTypes.func,
  onFieldClicked: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    local: state.localization
  };
};

export default connect(mapStateToProps)(FormBuilderField);
