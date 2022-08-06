import PropTypes from 'prop-types';

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null;
  } else {
    return (
      <output className={messageType}>
        {messageType}: {message}
      </output>
    );
  }
};

Notification.propTypes = {
  message: PropTypes.string,
  messageType: PropTypes.oneOf(['success', 'fail'])
};

export default Notification;