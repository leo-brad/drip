import { connect, } from 'react-redux';
import Tab from '~/render/script/component/Tab';
import { changeInstance, } from '~/render/script/action/instance';

const mapStateToProps = (state, ownProps) => {
  return {
    instance: state.instance,
    content: state.content,
    plugins: state.plugins,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeInstance: (instance) => {
      dispatch(changeInstance(instance));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab);
