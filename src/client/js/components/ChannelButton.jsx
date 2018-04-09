import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

class ChannelButton extends Component {
  getButtonClass() {
    const channelState = this.props.channelState ? 'on' : 'off';
    return `channel-button ${this.props.buttonId}-${channelState}`;
  }

  render() {
    return (
      <button className={this.getButtonClass()} />
    );
  }
}

ChannelButton.propTypes = {
  buttonId: PropTypes.string.isRequired,
  channelState: PropTypes.bool.isRequired,
};

export default ChannelButton;
