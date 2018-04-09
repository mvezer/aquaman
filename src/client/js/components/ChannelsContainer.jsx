import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import ChannelButton from './ChannelButton.jsx';

class ChannelsContainer extends Component {
  getButtonClass() {
    const channelState = this.props.channelState ? 'on' : 'off';
    return `channel-button ${this.props.buttonId}-${channelState}`;
  }

  render() {
    return (
      <div className="channel-container">
        <ChannelButton buttonId="light" channelState={this.props.channelStates.light} />
        <ChannelButton buttonId="filter" channelState={this.props.channelStates.filter} />
        <ChannelButton buttonId="co2" channelState={this.props.channelStates.co2} />
      </div>
    );
  }
}

ChannelsContainer.propTypes = {
  channelStates: PropTypes.object.isRequired,
};

export default ChannelsContainer;
