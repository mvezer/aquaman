import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import ButtonStates from '../constants/ButtonStates';

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  getButtonClass() {
    let stateClass;

    if (this.props.buttonState === ButtonStates.DEAFULT) {
      stateClass = 'default';
    } if (this.props.buttonState === ButtonStates.ACTIVE) {
      stateClass = 'active';
    } else if (this.props.buttonState === ButtonStates.INACTIVE) {
      stateClass = 'inactive';
    }

    if (stateClass) {
      return `menu-button btn-${stateClass}-${this.props.buttonId}`;
    }

    throw new Error(`Invalid button state: ${this.props.buttonState}`);
  }

  getIconClass() {
    return `menu-icon ${this.props.buttonId}-icon`;
  }

  handleButtonClick(event) {
    event.preventDefault();
    if (this.props.buttonState !== ButtonStates.INACTIVE) {
      this.props.callback(this.props.buttonId);
    }
  }

  render() {
    return (
      <button className={this.getButtonClass()} onClick={this.handleButtonClick}>
        <span className="caption">{this.props.caption}</span>
      </button>
    );
  }
}

MenuItem.propTypes = {
  buttonId: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  buttonState: PropTypes.string.isRequired,
};

export default MenuItem;
