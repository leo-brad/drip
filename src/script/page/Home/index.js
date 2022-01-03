import React from 'react';
import layout from '~/style/layout.css';
import Tab from '~/script/component/Tab';

class Home extends React.Component {
  render() {
    return (
      <div className={layout.verticalAlign}>
        <div className={layout.container}>
          <Tab />
        </div>
      </div>
    );
  }
}

export default Home;
