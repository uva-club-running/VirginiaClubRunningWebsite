function Footer() {
    return (
        <footer className="bg-darkblue-500 text-gray-300 text-sm py-4 text-center">
            <div className="flex flex-col items-center">
                <p className="italic m-6 pl-10 pr-10">Although this organization has members who are University of
                    Virginia students and may have University employees associated or engaged in its activities and
                    affairs, the organization is not a part of or an agency of the University. It is a separate and
                    independent organization which is responsible for and manages its own activities and affairs. The
                    University does not direct, supervise or control the organization and is not responsible for the
                    organization’s contracts, acts or omissions.</p>
                <div className="flex flex-row gap-12">
                    <a href="https://www.instagram.com/hoosrunning/">
                        <img src='public/assets/instagram.svg'
                        />
                    </a>
                    <a href="https://www.youtube.com/@hoosrunning">
                        <img src='public/assets/youtube.svg'
                            />
                    </a>
                </div>
                <p className="mt-5 font-bodoni text-vaorange-500 italic text-xl">Made in Charlottesville, VA</p>
            </div>
        </footer>
    );
}

export default Footer