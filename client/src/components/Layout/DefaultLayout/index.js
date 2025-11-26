import Header from "../../Header/Header.js";

import styles from "./DefaultLayout.module.scss";

function DefaultLayout({children}) {
    return ( 
        <div>
            
            <div className={styles.layout}>
                <div className={styles.sidebarleft}>
                    <Header/>
                </div>

                <div className={styles.contentcenter}>
                    {children}
                </div>

                
            </div>
        </div>
     );
}

export default DefaultLayout;