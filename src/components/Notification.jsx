const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return (
    <div data-testid='notification' className={notification.type} >
      {notification.message}
    </div>
  )
}

export default Notification