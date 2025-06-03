// utils/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echoInstance = null;

if (typeof window !== "undefined") {
  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: false,
    encrypted: false,
  });
}

export default echoInstance;
