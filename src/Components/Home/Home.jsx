import NavBar from "./NavBar";
import Splash from "./Splash";
import Practice from "./Practice"
import Meets from "./Meets"
import Community from "./Community"
import Footer from "./Footer"



function Home() {
    return (
        <>
          <NavBar></NavBar>
          <Splash></Splash>
          <Practice></Practice>
          <Meets></Meets>
          <Community></Community>
          <Footer></Footer>
        </>
      )
}

export default Home;