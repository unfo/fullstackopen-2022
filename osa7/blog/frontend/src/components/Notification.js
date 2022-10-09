import { useSelector } from 'react-redux';

const Notification = () => {
  const [message, messageType] = useSelector((state) => state.notification);
  if (message && message.length > 0) {
    return (
      <output className={messageType}>
        {messageType}: {message}
      </output>
    );
  }
};

export default Notification;
