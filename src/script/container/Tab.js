import { connect, } from 'react-redux';
import Tab from '~/script/component/Tab';
import { changeProcess, } from '~/script/action/process';

const mapStateToProps = (state, ownProps) => {
  return {
    process: state.process.id,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeProcess: (id) => {
      dispatch(changeProcess(id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab);
