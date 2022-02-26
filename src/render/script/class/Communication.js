import React from 'react';
import { updateContent, } from '~/render/script/action/content';
import { addInstance, reduceInstance, } from '~/render/script/action/instance';
import { updatePlugins, } from '~/render/script/action/plugins';

class Communication {
  constructor({ store, }) {
    this.store = store;
  }

  start() {
    this.bindEvent();
  }

  bindEvent() {
    const { store, } = this;
    const { ipc, } = window;
    ipc.on('drip', (json) => {
      const data = JSON.parse(json);
      const [event,] = data;
      if (event === 'proc') {
        const [_, instance, field, string, ] = data;
        switch (field) {
          case 'stdout':
          case 'stderr':
            this.store.dispatch(updateContent({ instance, field, string, }));
            break;
          case 'new':
            this.store.dispatch(addInstance(instance));
            break;
          case 'end':
            this.store.dispatch(reduceInstance(instance));
            break;
          default:
            break;
        }
      }
      if (event === 'plugin') {
        const [_, plugins,] = data;
        this.store.dispatch(updatePlugins(plugins));
      }
    });
  }
}

export default Communication;
