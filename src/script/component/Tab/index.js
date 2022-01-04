import React from 'react';
import style from './index.module.css';
import IconSquare from '~/script/component/IconSquare';

class Tab extends React.Component {
  render() {
    return (
      <div>
        <div className={style.tabHeader}>
          <button
            className={[style.tabButton, style.tabButtonFirst].join(' ')}
          >
            <IconSquare>
              <i className="fas fa-circle-notch"></i>
            </IconSquare>
            Process1
          </button>
          <button
            className={style.tabButton}
          >
            <IconSquare>
              <i className="fas fa-circle-notch"></i>
            </IconSquare>
            Process2
          </button>
          <button
            className={[style.tabButton, style.tabButtonLast].join(' ')}
          >
            <IconSquare>
              <i className="fas fa-circle-notch"></i>
            </IconSquare>
            Process3
          </button>
        </div>
        <div className={style.tabStrip}></div>
      </div>
    );
  }
}

export default Tab;
