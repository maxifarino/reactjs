import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './accordion.css';

class Accordion extends Component {

  static propTypes = {
    data: PropTypes.instanceOf(Array).isRequired,
  }

  render() {
    return (
      <div {...{ className: 'wrapper' }} style={{ width: '100%' }}>
        <ul {...{ className: 'accordion-list' }}>
          {this.props.data.map((data, key) => {
            return (
              <li {...{ className: 'accordion-list__item', key }}>
                <AccordionItem
                  {...data}
                  headerStyle={this.props.headerStyle || ''}
                  isShown={data.isShown}
                />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
};

class AccordionItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: props.isShown
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ opened: nextProps.isShown });
  }

  render() {
    const {
      props: {
        content,
        title,
        headerStyle
      },
      state: {
        opened
      }
    } = this;

    return (
      <div {...{ className: `accordion-item, ${opened && 'accordion-item--opened'}` }}>
        <div {...{ className: 'accordion-item__line', onClick: () => { this.setState({ opened: !opened }) } }}
          style={headerStyle}>
          {title}
          <span {...{ className: 'accordion-item__icon' }} />
        </div>
        <div {...{ className: 'accordion-item__inner' }}>
          <div {...{ className: 'accordion-item__content' }}>
            {content}
          </div>
        </div>
      </div>
    )
  }
}

export default Accordion;
