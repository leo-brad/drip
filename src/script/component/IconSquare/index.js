import React from 'react';
import style from './index.module.css';

class IconSquare extends React.Component {
  render() {
    return (
      <i className={[style.iconSquare, this.props.iconClass].join(' ')}>
        {this.props.children}
      </i>
    );
  }
}

export default IconSquare;
