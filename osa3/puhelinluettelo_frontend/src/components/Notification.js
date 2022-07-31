const Notification = ({ message, messageType }) => {
  if (message === null) {
    console.log('No news is good news?');
    return null;
  } else {
    console.log(messageType, 'Hear ye hear ye', message);
    return (
      <div className={messageType}>
        {message}
      </div>
    )
  }
}

export default Notification;