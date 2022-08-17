import { connect } from 'react-redux';

const Notification = ({ notification }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  };
  if (notification && notification.length > 0) {
    return (
      <div style={style}>
        {notification}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  };
};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);