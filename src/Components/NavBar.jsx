
function NavBar() {
    return (
        <div className="h-[8.5vh] bg-vablue-500 flex pl-6">
            <div className="w-1/2 flex items-center">
                <img src="src/assets/logo.svg"></img>
            </div>
            <div className="font-semibold w-1/2 flex items-center lg:text-xl gap-16 text-white font-franklin">
                <p>Training</p>
                <p>Meets</p>
                <p>Community</p>
                <p>Philanthropy</p>
                <p>Records</p>
                <p>Contact</p>
            </div>
        </div>
    )
}

export default NavBar;