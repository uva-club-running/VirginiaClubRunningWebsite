import LoginPage from "./LoginPage";
import login from "../../firebase";

function Admin() {
  return <LoginPage onLogin={login}></LoginPage>;
}

export default Admin;
