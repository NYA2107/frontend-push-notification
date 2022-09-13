// variable
const SW_PATH = 'service.js'
const notificationPermission = {
  granted:'granted',
  default:'default',
  denied:'denied'
}

const check = () => {
  if(!('serviceWorker' in navigator)){
    throw new Error(navigator)
  }
  if(!('PushManager' in window)){
    throw new Error('No Push API Support')
  }
}

const registerServiceWorker = async (swPath) =>{
  const swRegistration = await navigator.serviceWorker.register(swPath)
  return swRegistration
}

 const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission()
  //notification permission status would be value : granter, default, denied
  //Notification.permission -> other method to retreave permission status
  if(permission !== notificationPermission.granted){
    throw new Error('Permission not granted for notification')
  }
 }

const main = async () =>{
  check()
  const swRegistration = await registerServiceWorker(SW_PATH)
  const permission = await requestNotificationPermission()
}
