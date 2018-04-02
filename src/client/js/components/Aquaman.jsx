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
    this.updateStatus = this.updateStatus.bind(this);

    this.state = {
      feedingState: ButtonStates.INACTIVE,
      maintenanceState: ButtonStates.INACTIVE,
    };
  }

  async componentWillMount() {
    this.updateStatus();
    setInterval(this.updateStatus.bind(this), 1000);
  }

  setButtonStates(status) {
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
      || this.state.maintenanceState !== newMaintenanceState) {
      this.setState({
        feedingState: newFeedingState,
        maintenanceState: newMaintenanceState,
      });
    }
  }

  async updateStatus() {
    this.setButtonStates((await this.aquamanService.getStatus()).result);
  }

  async handleMenuItemClick(channel) {
    let status;

    if (channel === OverrideIds.FEEDING) {
      status = (await this.aquamanService.feeding()).result;
    } else if (channel === OverrideIds.MAINTENANCE) {
      status = (await this.aquamanService.maintenance()).result;
    }

    if (status) {
      this.setButtonStates(status);
    } else {
      throw new Error(`Unknown channel: ${channel}`);
    }
  }

  render() {
    return (
      <div>
        <h1>Aquaman 2</h1>
        <Menu
          clickCallback={this.handleMenuItemClick}
          feedingState={this.state.feedingState}
          maintenanceState={this.state.maintenanceState}
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
