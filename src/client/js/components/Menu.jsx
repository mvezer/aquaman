import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import MenuItem from './MenuItem.jsx';
import OverrideIds from '../constants/OverrideIds';
import ChannelsContainer from './ChannelsContainer.jsx';

class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <MenuItem
          caption="Feeding"
          callback={this.props.clickCallback}
          buttonState={this.props.feedingState}
          buttonId={OverrideIds.FEEDING}
        />
        <MenuItem
          caption="Maintenance"
          callback={this.props.clickCallback}
          buttonState={this.props.maintenanceState}
          buttonId={OverrideIds.MAINTENANCE}
        />
        <ChannelsContainer channelStates={this.props.channels} />
      </div>
    );
  }
}

Menu.propTypes = {
  clickCallback: PropTypes.func.isRequired,
  feedingState: PropTypes.string.isRequired,
  maintenanceState: PropTypes.string.isRequired,

};

export default Menu;
