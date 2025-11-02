import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const goToTraining = () => {
    navigate("/training");
  };
  const goToMeets = () => {
    navigate("/meets");
  };
  const goToCommunity = () => {
    navigate("/community");
  };
  const goToPhilanthropy = () => {
    navigate("/philanthropy");
  };
  const goToRecords = () => {
    navigate("/records");
  };
  const goToContact = () => {
    navigate("/contact");
  };
  const goToHome = () => {
    navigate("/");
  };
  return (
    <div className="h-[8.5vh] bg-vablue-500 flex items-center">
      <div className="pl-6">
        <img 
          src="assets/logo.svg" 
          alt="Virginia Club Running Logo" 
          className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={goToHome}
        />
      </div>
      <div className="hidden lg:flex x w-full justify-end font-semibold items-center text-xl gap-16 text-white font-franklin mr-6">
        <button className="cursor-pointer" onClick={goToTraining}>Training</button>
        <button className="cursor-pointer" onClick={goToMeets}>Meets</button>
        <button className="cursor-pointer" onClick={goToCommunity}>Community</button>
        <button className="cursor-pointer" onClick={goToPhilanthropy}>Philanthropy</button>
        <button className="cursor-pointer" onClick={goToRecords}>Records</button>
        <button className="cursor-pointer" onClick={goToContact}>Contact</button>
      </div>
    </div>
  );
}

export default NavBar;
