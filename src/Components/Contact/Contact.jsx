import NavBar from "../Home/NavBar";

export default function Contact() {
    // 👇 Each section is its own object in the array
    const contacts = [
        {
            title: "recruitment chairs",
            subtitle: "for questions regarding new membership",
            people: [
                {
                    name: "Josh Goldstein",
                    pronouns: "(he/him)",
                    email: "vuk2mn@virginia.edu",
                    image: "/assets/Profiles26/joshgoldstein.jpg",
                },
                {
                    name: "Madison Sayen",
                    pronouns: "(she/her)",
                    email: "kwd7sk@virginia.edu",
                    image: "/assets/Profiles26/madisonsayen.jpg",
                },
            ],
        },
        {
            title: "workout coordinators",
            subtitle: "for questions regarding training",
            people: [
                {
                    name: "Sebastian Nowicki",
                    pronouns: "(he/him)",
                    email: "zrg4jh@virginia.edu",
                    image: "/assets/Profiles26/sebastiannowicki.jpg",
                },
                {
                    name: "Beall Roberts",
                    pronouns: "(she/her)",
                    email: "mpu5rz@virginia.edu",
                    image: "/assets/Profiles26/beallroberts.jpg",
                },
            ],
        },
        {
            title: "sprint coordinator",
            subtitle: "for questions regarding sprint training",
            people: [
                {
                    name: "Garrett Uthlaut",
                    pronouns: "(he/him)",
                    email: "ana5yh@virginia.edu",
                    image: "/assets/simrat2.jpg",
                },
            ],
        },
        {
            title: "meet coordinators",
            subtitle: "for questions concerning the Cavalier Invitational",
            people: [
                {
                    name: "Stephen Wolf",
                    pronouns: "(he/him)",
                    email: "bhp3sq@virginia.edu",
                    image: "/assets/Profiles26/stephenwolf.jpg",
                },
                {
                    name: "Maria Gaytan",
                    pronouns: "(she/her)",
                    email: "kkr2kw@virginia.edu",
                    image: "/assets/Profiles26/mariagaytan.jpg",
                }
            ],
        },
        {
            title: "fundraising chair",
            subtitle: "for questions concerning club fundraising and volunteering",
            people: [
                {
                    name: "Dana Johannsen",
                    pronouns: "(she/her)",
                    email: "gpk3qr@virginia.edu",
                    image: "/assets/Profiles26/danajohannsen.jpg",
                },
            ],
        },
        {
            title: "social chairs",
            subtitle: "for questions concerning club social events",
            people: [
                {
                    name: "Taylor Flynn",
                    pronouns: "(she/her)",
                    email: "dbh8zg@virginia.edu",
                    image: "/assets/Profiles26/taylorflynn.jpg",
                },
                {
                    name: "Kate DeForrest",
                    pronouns: "(she/her)",
                    email: "cmg9pb@virginia.edu",
                    image: "/assets/Profiles26/katedeforrest.jpg",
                },
                {
                    name: "Will Muck",
                    pronouns: "(he/him)",
                    email: "xsq2gy@virginia.edu",
                    image: "/assets/Profiles26/willmuck.jpg",
                },
            ],
        },
        {
            title: "president and vice president",
            subtitle: "for all other questions about the club",
            people: [
                {
                    name: "Jackie Janicki",
                    pronouns: "(she/her)",
                    email: "fcb2ck@virginia.edu",
                    image: "/assets/Profiles26/jackiejanicki.jpg",
                },
                {
                    name: "Tyler Jackson",
                    pronouns: "(he/him)",
                    email: "guw9pm@virginia.edu",
                    image: "/assets/Profiles26/tylerjackson.jpg",
                },
            ],
        },
        {
            title: "treasurer",
            subtitle: "for questions concerning club finances",
            people: [
                {
                    name: "Tyler Stevens",
                    pronouns: "(he/him)",
                    email: "uvn9ur@virginia.edu",
                    image: "/assets/Profiles26/tylerstevens.jpg",
                }
            ],
        },
        {
            title: "secretary and team relations chair",
            subtitle: "for questions concerning the club's exec board and club social media",
            people: [
                {
                    name: "Nathan Gu",
                    pronouns: "(he/him)",
                    email: "ykb3cn@virginia.edu",
                    image: "/assets/Profiles26/nathangu.jpg",
                },
                {
                    name: "Aaron Falik",
                    pronouns: "(he/him)",
                    email: "bks5gg@virginia.edu",
                    image: "/assets/Profiles26/aaronfalik.jpg",
                },
            ],
        },
        {
            title: "webmaster",
            subtitle: "for questions concerning the website and ListServ",
            people: [
                {
                    name: "Aidan Szilagyi",
                    pronouns: "(he/him)",
                    email: "uqk6ah@virginia.edu",
                    image: "/assets/Profiles26/aidanszilagyi.jpg",
                }
            ],
        }
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F9DCBF" }}>
            <style> {/* legacy support :) */}
                {` /
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `}
            </style>
            <NavBar />

            {/* Splash Section */}
            <div
                className="relative w-screen"
                style={{
                    height: "70vh",
                    backgroundImage: "url(assets/landing_splash.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold font-franklin">
                        Contact
                    </h1>
                    <h2 className="mt-3 text-center text-vaorange-500 text-3xl md:text-5xl lg:text-7xl font-bodoni italic">
                        Get in touch.
                    </h2>
                </div>
            </div>

            {/* Contact Sections */}
            <div className="max-w-6xl mx-auto px-8 py-20">
                {contacts.map((section) => (
                    <div key={section.title} className="mb-24 text-center">
                        <h2 className="text-4xl text-vablue-500 md:text-5xl font-bold font-franklin mb-2">
                            {section.title}
                        </h2>
                        {section.subtitle && (
                            <p className="italic text-vaorange-500 text-xl mb-12 font-bodoni">
                                {section.subtitle}
                            </p>
                        )}

                        <div className="flex flex-row flex-wrap gap-12 justify-center">
                            {section.people.map((person) => (
                                <div
                                    key={person.name}
                                    className="flex flex-col items-center text-center space-y-4"
                                >
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className={`w-56 h-56 object-cover rounded-full shadow-md ${section.title.toLowerCase().includes("webmaster")
                                            ? "[&:hover]:[animation:spin_25s_linear_infinite]"
                                            : ""
                                            }`}
                                    />
                                    <div>
                                        <h3 className="text-2xl font-bold font-franklin">
                                            {person.name}{" "}
                                            <span className="italic font-bodoni text-gray-600">
                                                {person.pronouns}
                                            </span>
                                        </h3>
                                        <a
                                            href={`mailto:${person.email}`}
                                            className="text-vaorange-700 underline text-lg font-bodoni hover:text-vaorange-900 transition-colors"
                                        >
                                            {person.email} ⇢
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
