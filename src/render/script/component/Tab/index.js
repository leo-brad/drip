import React from 'react';
import style from './index.module.css';
import Content from '~/render/script/component/Content';
import InstanceIcon from '~/render/script/component/InstanceIcon';

class Tab extends React.Component {
  componentDidMount() {
    document.getElementById('tab-header').addEventListener('click', (e) => {
      const [_, instance] = e.target.id.split('-');
      this.props.changeInstance(instance);
    });
  }

  render() {
    const { instance: { instances, instance, }, } = this.props;
    const buttons = instances.map((i, k) => {
      return (
        <button key={k} id={'button-' + i}
          className={[
            style.tabButton,
            style.tabButtonFirst,
            instance === i ? style.active : null,
          ].join(' ')}
        >
          <InstanceIcon />{i}
        </button>
      );
    });
    return (
      <div className={style.tab}>
        <div id='tab-header' className={style.tabHeader}>
          {buttons}
        </div>
        <div className={style.tabStrip}></div>
        <div className={style.tabMain}><Content {...this.props} /></div>
      </div>
    );
  }
}

export default Tab;
