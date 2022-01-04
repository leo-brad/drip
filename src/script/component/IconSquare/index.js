import React from 'react';
import style from './index.module.css';

class IconSquare extends React.Component {
  render() {
    return (
      <div className={style.IconSquare}>
        {this.props.children}
      </div>
    );
  }
}

export default IconSquare;
