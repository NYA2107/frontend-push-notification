
// CONSTANT //

const VAPID_PUBLIC_KEY = 'BMDLwT2U28PsQyZI30drgpA_0t-RU_XQjlr34vE9GDMfvqHHwl6ZhJPr9SNiuMFezbeJcQHdAInZlizJj7mjaqM'
const SERVER_URL = 'http://localhost:4000'
const SUBSCRIBE_API = `${SERVER_URL}/save-subscription`

// ENUM //

const eventListener = {
  push:'push',
  activate:'activate'
}

// METHODS //

// magic function to encode base64 public key to Array buffer which is needed by the subscription options
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const saveSubscription = async (subscription, url) => {
  const response = await fetch(url, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(subscription),
  })
  console.log(response)
  return response.json()
}

const showLocalNotification = (title, body, swRegistration) => {
  const options = { body }
  swRegistration.showNotification(title, options)
}

// EVENT LISTENER //

self.addEventListener(eventListener.activate, async () => {
  // called once when service worker is activated
  console.log('service worker activate')
  try {
    const applicationServerKey = urlB64ToUint8Array(VAPID_PUBLIC_KEY)
    const options = {applicationServerKey, userVisibleOnly:true}
    const subscription = await self.registration.pushManager.subscribe(options)
    const response = await saveSubscription(subscription, SUBSCRIBE_API)
    console.log(response)
  } catch (err) {
    console.log('Error', err)
  }
})

self.addEventListener(eventListener.push, (event) =>{
  if(event.data){
    showLocalNotification("Bam Bammm", event.data.text(), self.registration)
    console.log('Push Event !', event.data.text())
  } else {
    console.log('Push event but no data') 
  }
})