
function NavBar() {
    return (
        <div className="h-[8.5vh] bg-vablue-500 flex items-center">
            <div className="pl-6">
                <img src="public/assets/logo.svg"></img>
            </div>
            <div className="hidden lg:flex x w-full justify-end font-semibold items-center text-xl gap-16 text-white font-franklin mr-6">
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