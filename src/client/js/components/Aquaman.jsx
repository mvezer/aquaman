import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Menu from './Menu.jsx';
import AquamanService from '../services/AquamanService.js';
import ButtonStates from '../constants/ButtonStates';
import OverrideIds from '../constants/OverrideIds';

class Aquaman extends Component {
  constructor(props) {
    super(props);
    this.aquamanService = new AquamanService();
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.getStatus = this.getStatus.bind(this);

    this.state = {
      feedingState: ButtonStates.INACTIVE,
      maintenanceState: ButtonStates.INACTIVE,
      channels: {light: false, co2: false, filter: false}
    };
  }

  async componentWillMount() {
    this.getStatus();
    setInterval(this.getStatus.bind(this), 1000);
  }

  updateStates(status) {
    let newFeedingState = this.state.feedingState;
    let newMaintenanceState = this.state.maintenanceState;

    if (!status.override) {
      newFeedingState = ButtonStates.DEAFULT;
      newMaintenanceState = ButtonStates.DEAFULT;
    } else if (status.override.id === OverrideIds.FEEDING) {
      newFeedingState = ButtonStates.ACTIVE;
      newMaintenanceState = ButtonStates.INACTIVE;
    } else if (status.override.id === OverrideIds.MAINTENANCE) {
      newFeedingState = ButtonStates.INACTIVE;
      newMaintenanceState = ButtonStates.ACTIVE;
    } else {
      throw new Error(`Unknown override received: '${status.override.id}'`);
    }

    if (this.state.feedingState !== newFeedingState
      || this.state.maintenanceState !== newMaintenanceState
      || this.state.channels.co2 !== status.channels.co2
      || this.state.channels.filter !== status.channels.filter
      || this.state.channels.light !== status.channels.light) {
      this.setState({
        feedingState: newFeedingState,
        maintenanceState: newMaintenanceState,
        channels: status.channels
      });
    }
  }

  async getStatus() {
    const newStatus = (await this.aquamanService.getStatus()).result;
    this.updateStates(newStatus);
  }

  async handleMenuItemClick(channel) {
    let status;

    if (channel === OverrideIds.FEEDING) {
      status = (await this.aquamanService.feeding()).result;
    } else if (channel === OverrideIds.MAINTENANCE) {
      status = (await this.aquamanService.maintenance()).result;
    }

    if (status) {
      this.updateStates(status);
    } else {
      throw new Error(`Unknown channel: ${channel}`);
    }
  }

  render() {
    return (
      <div>
        <div id="menu-header"></div>
        <Menu
          clickCallback={this.handleMenuItemClick}
          feedingState={this.state.feedingState}
          maintenanceState={this.state.maintenanceState}
          channels={this.state.channels}
        />
      </div>
    );
  }
}

export default Aquaman;

// eslint-disable-line no-undef
const wrapper = document.getElementById('aquaman-container'); // eslint-disable-line no-undef
wrapper // eslint-disable-line no-unused-expressions
  ? ReactDOM.render(<Aquaman />, wrapper)
  : false;
