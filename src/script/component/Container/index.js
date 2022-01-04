import React from 'react';
import style from './index.module.css';

class Container extends React.Component {
  render() {
    return (
      <div className={style.container}>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
