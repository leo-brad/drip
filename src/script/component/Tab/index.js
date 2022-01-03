import React from 'react';
import component from '~/style/component.css';

class Tab extends React.Component {
  render() {
    return (
      <div>
        <div>
          <button
            className={[component.tabButton, component.tabButtonFirst].join(' ')}
          >
            Process1
          </button>
          <button
            className={component.tabButton}
          >
            Process2
          </button>
          <button
            className={[component.tabButton, component.tabButtonLast].join(' ')}
          >
            Process3
          </button>
        </div>
        <div className={component.tabStrip}></div>
      </div>
    );
  }
}

export default Tab;
