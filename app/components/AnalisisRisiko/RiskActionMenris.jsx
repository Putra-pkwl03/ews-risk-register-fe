// import { echo } from "../../utils/echo";

// useEffect(() => {
//   fetchData();

//   const userId = localStorage.getItem("userId"); 

//   if (!userId) return; 

//   const channel = echo.private(`App.Models.User.${userId}`);

//   channel.notification((notification) => {
//     console.log("Notifikasi baru:", notification);
//     alert(notification.message);
//     fetchData();
//   });

//   return () => {
//     echo.leave(`App.Models.User.${userId}`);
//   };
// }, []);
