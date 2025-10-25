import { createContext, useState ,useEffect, Children } from "react";

export  const AuthContext = createContext();

export function AuthProvider( {children}){
    const [auth,setAuth] = useState( () => {
        const saveUser = localStorage.getItem("user");
        return saveUser ?  {user : JSON.parse(saveUser)} : {user : null};

    })

    // thay đổi localStorage khi auth thay đổi
    useEffect( ()=> {
        if (auth.user) localStorage.setItem("user", JSON.stringify(auth.user));
        else localStorage.removeItem("user");
    },[auth])
    

    const login = (user) =>  setAuth({user});// nếu viết {user} như này thì có nghĩa là tạo ra 1 oject mới có key là user { user }  ≡  { user: user }

     return (
        <AuthContext.Provider value={{ auth, login }}>
            {children}
        </AuthContext.Provider>
    );
}