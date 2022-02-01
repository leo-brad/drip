import React from 'react';
import style from './index.module.css';
import IconSquare from '~/script/component/IconSquare';

class Tab extends React.Component {
  componentDidMount() {
    document.getElementById('tab-button1').addEventListener('click', () => {
      this.props.changeProcess(1);
    });
    document.getElementById('tab-button2').addEventListener('click', () => {
      this.props.changeProcess(2);
    });
    document.getElementById('tab-button3').addEventListener('click', () => {
      this.props.changeProcess(3);
    });
  }

  render() {
    const { process, changeProcess, } = this.props;
    return (
      <div className={style.tab}>
        <div className={style.tabHeader}>
          <button
            id="tab-button1"
            className={[
              style.tabButton,
              style.tabButtonFirst,
              process === 1 ? style.active : null,
            ].join(' ')}
          >
            <IconSquare iconClass="fas fa-circle-notch" />
            Process1
          </button>
          <button
            id="tab-button2"
            className={[
              style.tabButton,
              process === 2 ? style.active : null,
            ].join(' ')}
          >
            <IconSquare iconClass="fas fa-circle-notch" />
            Process2
          </button>
          <button
            id="tab-button3"
            className={[
              style.tabButton,
              style.tabButtonLast,
              process === 3 ? style.active : null,
            ].join(' ')}
          >
            <IconSquare iconClass="fas fa-circle-notch" />
            Process3
          </button>
        </div>
        <div className={style.tabStrip}>
        </div>
        <div className={style.tabMain}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Tab;
