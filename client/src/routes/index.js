
// quản lý router ở bên ngoài app.js
import Home from '../pages/Home';
import Following from '../pages/Following';
import Profile from '../pages/Profile/Profile.js';
import Upload from '../pages/Upload';
import Login from '../pages/Login/Login.js';
import Register from '../pages/Register/Register.js';

// dành cho những trang k cần đăng nhập vẫn xem được
const publicRoutes =[
    {path:'/', component: Home},
    {path:'/following', component: Following},
    {path:'/profile', component: Profile},
    {path:'/upload', component: Upload, layout :null},
    {path: '/login', component:Login, layout: null },
    {path: '/register', component:Register, layout: null },

    //khi không cấu hình 1 thành phần nào đó thì nó được mặc định là undefine
]


// cho các trang đăng nhập mới xem được còn nếu chưa đăng nhập thì lái sang phần login


export{ publicRoutes}