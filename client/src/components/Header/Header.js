import {
  FaHome,
  FaSearch,
  FaRegCompass,
  FaVideo,
  FaFacebookMessenger,
  FaHeart,
  FaPlus,
  FaUserCircle,
  FaBars,
  FaThLarge,
  FaStore, 
  FaShoppingCart, 
  FaCartPlus, 
  FaShoppingBag
} from "react-icons/fa";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";

import SearchPanel from "../SearchPanel.js";
import UploadPost from "../../pages/Upload/UploadPost.js";
import { useRef, useState } from "react";

function Header() {

  const[showSearch,setShowSearch] = useState(false);
  const clickSearchPanel = useRef("auto");
  const[showUpLoad,setShowUpLoad] = useState(false);


  return (
    <nav className={styles.sidebar}>
      <h1 className={styles.logo}>React app</h1>

      <ul className={styles.menu}>
        <li>
          <Link to="/" className={styles.item}>
            <FaHome className={styles.icon} />
            <span>Home</span>
          </Link>
        </li>

        
        <li>
          <Link to="/shop" className={styles.item}>
            <FaStore className={styles.icon} />
            <span>Shop</span>
          </Link>
        </li>


        <li>
          <Link to="/productmanagement" className={styles.item}>
            <FaStore className={styles.icon} />
            <span>Product Management</span>
          </Link>
        </li>


        <li>
          <div className={styles.item} style={{ pointerEvents: clickSearchPanel.current }}
              onClick={() => { 
                
                  setShowSearch((prev) => !prev);
                  clickSearchPanel.current="none";
              }
            } 
          >
            <FaSearch className={styles.icon} />
            <span>Search</span>
          </div>

          {showSearch && <SearchPanel 
            onClose={() => { setShowSearch(false) } } 
            clickSearchPanel={clickSearchPanel}
          />}
        </li>


        <li>
          <Link to="/explore" className={styles.item}>
            <FaRegCompass className={styles.icon} />
            <span>Explore</span>
          </Link>
        </li>
        <li>
          <Link to="/reels" className={styles.item}>
            <FaVideo className={styles.icon} />
            <span>Reels</span>
          </Link>
        </li>
        <li>
          <Link to="/messages" className={styles.item}>
            <FaFacebookMessenger className={styles.icon} />
            <span>Messages</span>
          </Link>
        </li>
        <li>
          <Link to="/notifications" className={styles.item}>
            <FaHeart className={styles.icon} />
            <span>Notifications</span>
          </Link>
        </li>


        <li>
          <div className={styles.item} onClick ={ () => {
            setShowUpLoad(true);
          }}>

            <FaPlus className={styles.icon} />
            <span>Create</span>

          </div>
          
          {showUpLoad && <UploadPost onClose={()=>{
              setShowUpLoad(false);
          }}/>}
        </li>




        <li>
          <Link to="/profile" className={styles.item}>
            <FaUserCircle className={styles.icon} />
            <span>Profile</span>
          </Link>
        </li>

        
      </ul>

      <div className={styles.bottom}>
        <div className={styles.item}>
          <FaBars className={styles.icon} />
          <span>More</span>
        </div>
        
      </div>     
    </nav>
  );
}

export default Header;
