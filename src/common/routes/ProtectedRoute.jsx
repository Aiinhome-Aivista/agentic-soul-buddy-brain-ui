/* import {Navigate} from "react-router-dom"

const authGuard = () => {
  const JWT_TOKEN = sessionStorage.getItem("accesstoken")
  return JWT_TOKEN ? true : false
}

const ProtectedRoute = ({element}) => {
  return authGuard() ? element : <Navigate to="/" />
}

export default ProtectedRoute
 */