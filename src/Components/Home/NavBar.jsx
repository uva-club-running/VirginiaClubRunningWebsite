import { useNavigate } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();
  const goToSummerTraining = () => {
    navigate ("/summer-training")
  }
  const goToJoin = () => {
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
    <div class="w-full bg-vablue-500">
        <div className="h-[8.5vh] flex items-center">
            <div className="pl-6">
                <img
                src="assets/logo.svg"
                alt="Virginia Club Running Logo"
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                onClick={goToHome}
                />
            </div>

            {/* Desktop */}
            <div className="hidden min-[875px]:flex x w-full justify-end font-semibold items-center text-lg gap-8 text-white font-franklin mr-6 ml-6">
                <button className="cursor-pointer text-vaorange-500" onClick={goToSummerTraining}>Summer Training</button>
                <button className="cursor-pointer" onClick={goToJoin}>Join</button>
                <button className="cursor-pointer" onClick={goToMeets}>Meets</button>
                <button className="cursor-pointer" onClick={goToCommunity}>Community</button>
                <button className="cursor-pointer" onClick={goToPhilanthropy}>Philanthropy</button>
                <button className="cursor-pointer" onClick={goToRecords}>Records</button>
                <button className="cursor-pointer" onClick={goToContact}>Contact</button>
            </div>

            {/* Mobile */}
            <div className="flex min-[875px]:hidden w-full justify-end mr-6">
                <button onClick={() => setOpen(!open)} className="text-white text-3xl">
                ☰
                </button>
            </div>

        </div>
        {/* Mobile */}
        {open && (
            <div className="flex flex-col lg:hidden w-full items-center gap-4 text-white text-lg font-franklin">
                <button onClick={goToSummerTraining} class="text-vaorange-500">Summer Training</button>
                <button onClick={goToJoin}>Join</button>
                <button onClick={goToMeets}>Meets</button>
                <button onClick={goToCommunity}>Community</button>
                <button onClick={goToPhilanthropy}>Philanthropy</button>
                <button onClick={goToRecords}>Records</button>
                <button onClick={goToContact}>Contact</button>
            </div>
        )}
    </div>
  );
}

export default NavBar;
