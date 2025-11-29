import { useEffect, useState, useContext } from "react";
import { Hello } from "~/api/requests/demo.js";
import styles  from "./Home.module.scss"
import { AuthContext } from "../../redux/AuthContext";
import {Notification} from "../../components/Notification/Notification.js";
import InstagramPost from "../Post/InstagramPost.js";
import testImg from "./test.jpg"
function Home() {
  const [message, setMessage] = useState("");
  const userdemo = localStorage.getItem("user");
  
  useEffect(() => {
    Hello()
      .then(msg => setMessage(msg)) 
      .catch(err => setMessage("Lỗi khi gọi API"));
  }, []);

  const post = {
    username: "rpt.mckeyyyy",
    avatar: "",
    image: testImg,
    time: "1d",
    likes: "266,116",
    caption: "Windmills and silence",
    commentsCount: 2609,
  };


   return(
    <>
      <InstagramPost post={post} />
      <Notification message={message}/>
    </>
      
   ); 
}

export default Home;
