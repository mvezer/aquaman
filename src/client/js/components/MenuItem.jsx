import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import ButtonStates from '../constants/ButtonStates';

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  getStateClass() {
    let buttonClassName;

    if (this.props.buttonState === ButtonStates.DEAFULT) {
      buttonClassName = 'btn-default';
    } if (this.props.buttonState === ButtonStates.ACTIVE) {
      buttonClassName = 'btn-active';
    } else if (this.props.buttonState === ButtonStates.INACTIVE) {
      buttonClassName = 'btn-inactive';
    }

    if (buttonClassName) {
      return `menu-button ${buttonClassName}`;
    }

    throw new Error(`Invalid button state: ${this.props.buttonState}`);
  }

  handleButtonClick(event) {
    event.preventDefault();
    if (this.props.buttonState !== ButtonStates.INACTIVE) {
      this.props.callback(this.props.buttonId);
    }
  }

  render() {
    return (
      <button className={this.getStateClass()} onClick={this.handleButtonClick}>
        {this.props.caption}
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
