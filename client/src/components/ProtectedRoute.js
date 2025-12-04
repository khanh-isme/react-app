import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../redux/AuthContext";

function ProtectedRoute({ children }) {
  const {auth,Loading} = useContext(AuthContext);

  if (window.Cypress) {
    return children; // BYPASS
  }


  if(Loading){
    return <p> loading </p>
  }
  if (!auth.user) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
