import NavBar from "../Home/NavBar";

export default function Contact() {
    // 👇 Each section is its own object in the array
    const contacts = [
        {
            title: "recruitment chairs",
            subtitle: "for questions regarding new membership",
            people: [
                {
                    name: "Will Muck",
                    pronouns: "(he/him)",
                    email: "xsq2gy@virginia.edu",
                    image: "/assets/Profiles/willmuck.jpg",
                },
                {
                    name: "Mia Fanshaw",
                    pronouns: "(she/her)",
                    email: "nuv4zk@virginia.edu",
                    image: "/assets/Profiles/miafanshaw.jpeg",
                },
            ],
        },
        {
            title: "workout coordinators",
            subtitle: "for workout scheduling and inquiries",
            people: [
                {
                    name: "Chase Cartwright",
                    pronouns: "(he/him)",
                    email: "ufq8rq@virginia.edu",
                    image: "/assets/Profiles/chasecartwright.jpeg",
                },
                {
                    name: "Ella Harris",
                    pronouns: "(she/her)",
                    email: "ufq8rq@virginia.edu",
                    image: "/assets/Profiles/ellaharris.png",
                },
            ],
        },
        {
            title: "sprint coordinator",
            subtitle: "for race and sprint training",
            people: [
                {
                    name: "Hunter Lutz",
                    pronouns: "(he/him)",
                    email: "mty9zs@virginia.edu",
                    image: "/assets/Profiles/hunterlutz.jpeg",
                },
            ],
        },
        {
            title: "meet coordinators",
            subtitle: "for information about meets and events",
            people: [
                {
                    name: "Eli Cook",
                    pronouns: "(he/him)",
                    email: "ucg8nb@virginia.edu",
                    image: "/assets/Profiles/elicook.png",
                },
                {
                    name: "Beall Roberts",
                    pronouns: "(she/her)",
                    email: "mpu5rz@virginia.edu",
                    image: "/assets/Profiles/beallroberts.jpeg",
                }
            ],
        },
        {
            title: "philanthropy chair",
            subtitle: "for race and sprint training",
            people: [
                {
                    name: "Nick Johnstone",
                    pronouns: "(he/him)",
                    email: "czm4yv@virginia.edu",
                    image: "/assets/Profiles/nickjohnstone.jpeg",
                },
            ],
        },
        {
            title: "social chairs",
            subtitle: "for questions about club socials",
            people: [
                {
                    name: "Dana Johannsen",
                    pronouns: "(she/her)",
                    email: "gpk3qr@virginia.edu",
                    image: "/assets/Profiles/danajohannsen.jpeg",
                },
                {
                    name: "Tyler Stevens",
                    pronouns: "(he/him)",
                    email: "uvn9ur@virginia.edu",
                    image: "/assets/Profiles/tylerstevens.jpeg",
                },
            ],
        },
        {
            title: "president and vice president",
            subtitle: "for leadership and general inquiries",
            people: [
                {
                    name: "Jesse Smith",
                    pronouns: "(he/him)",
                    email: "qsc7ay@virginia.edu",
                    image: "/assets/Profiles/jesse_smith.jpg",
                },
                {
                    name: "Jackie Janicki",
                    pronouns: "(she/her)",
                    email: "fcb2ck@virginia.edu",
                    image: "/assets/Profiles/jackiejanicki.jpeg",
                },
            ],
        },
        {
            title: "treasurer",
            subtitle: "for leadership and general inquiries",
            people: [
                {
                    name: "Jenny Macler",
                    pronouns: "(she/her)",
                    email: "phu4ge@virginia.edu",
                    image: "/assets/Profiles/jennymacler.jpeg",
                }
            ],
        },
        {
            title: "secretary and team relations chair",
            subtitle: "for leadership and general inquiries",
            people: [
                {
                    name: "Kamren Reeves",
                    pronouns: "(he/him)",
                    email: "tex9yr@virginia.edu",
                    image: "/assets/Profiles/kamrenreeves.jpeg",
                },
                {
                    name: "Hayley Sandler",
                    pronouns: "(she/her)",
                    email: "jmq3qd@virginia.edu",
                    image: "/assets/Profiles/hayleysandler.jpeg",
                },
            ],
        },
        {
            title: "webmaster",
            subtitle: "for leadership and general inquiries",
            people: [
                {
                    name: "Urav Tanna",
                    pronouns: "(he/him)",
                    email: "jnk3hc@virginia.edu",
                    image: "/assets/Profiles/uravtanna.jpeg",
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
                            {section.people.map((person) => (
                                <div
                                    key={person.name}
                                    className="flex flex-col items-center text-center space-y-4"
                                >
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className={`w-56 h-56 object-cover rounded-full shadow-md ${section.title.toLowerCase().includes("webmaster")
                                            ? "hover:[animation:spin_25s_linear_infinite]"
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
