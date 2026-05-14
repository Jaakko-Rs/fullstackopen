import { NotificationBox } from '../styles/Styled'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  return (
    <NotificationBox $type={notification.type}>
      {notification.text}
    </NotificationBox>
  )
}
export default Notification