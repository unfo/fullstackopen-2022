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

export default Notification;