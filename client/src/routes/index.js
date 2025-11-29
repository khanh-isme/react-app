
// quản lý router ở bên ngoài app.js
import Home from '../pages/Home';
import Following from '../pages/Following';
import Profile from '../pages/Profile/Profile.js';
import Upload from '../pages/Upload';
import Login from '../pages/Login/Login.js';
import Register from '../pages/Register/Register.js';
import Shop from '../pages/Shop/shop.js';
import ProductManagement from '../pages/ProductManagement/ProductManagement.js'

// dành cho những trang k cần đăng nhập vẫn xem được
const publicRoutes =[
    
    {path: '/login', component:Login, layout: null },
    {path: '/register', component:Register, layout: null },

    //khi không cấu hình 1 thành phần nào đó thì nó được mặc định là undefine
]
const privateRoutes =[
    {path:'/', component: Home},
    {path:'/following', component: Following},
    {path:'/profile', component: Profile},
    {path:'/upload', component: Upload, layout :null},
    {path:'/shop', component: Shop},
    {path:'/productmanagement', component: ProductManagement},
]



export{ publicRoutes,privateRoutes}