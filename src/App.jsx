import { useState } from 'react'
import NavBar from "./Components/NavBar.jsx";
import Splash from "./Components/Splash.jsx";
import Practice from "./Components/Practice.jsx";
import Meets from "./Components/Meets.jsx";
import Community from "./Components/Community.jsx";
import Footer from "./Components/Footer.jsx";

function App() {
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

export default App
