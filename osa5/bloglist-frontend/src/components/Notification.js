const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null;
  } else {
    return (
      <div className={messageType}>
        {messageType}: {message}
      </div>
    );
  }
};

export default Notification;