import React from 'react';
import style from './index.module.css';

class Icon extends React.Component {
  render() {
    return (
      <i className={[style.icon, 'fa', 'fa-microchip'].join(' ')}>
        {this.props.children}
      </i>
    );
  }
}

export default Icon;
