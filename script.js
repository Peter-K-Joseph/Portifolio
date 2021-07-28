const domain = "http://127.0.0.1:5500/";
let trackScale;
let skillLevel = {
    0: {
        lang: "C++",
        level: "Begineer",
        desc: "Started learning C++ since 11th grade.",
        rate: 3,
    },
    1: {
        lang: "C",
        level: "Begineer",
        desc: "Started learning C since first year at Christ University.",
        rate: 2,
        projects: ["Tic Tac Toe", "Calculator", "Movie Booking System", " Contacts Application"]
    },
    2: {
        lang: "Python",
        level: "Intermediate",
        desc: "Started learning C since first year at Christ University by myself. Made a project that heavily invlolves APIs",
        rate: 4,
        projects: ["Wordfer: A Service to migrate data from a Wordpress site to another platform called RebelMouse"]
    },
    3: {
        lang: "JavaScript",
        level: "Expert",
        desc: "Started learning JavaScript by my own. Learned JavaScript mostly by building Projects. Made Projects that involve APIs, Google Services (Drive API, etc..)",
        rate: 6,
        projects: ["CEWS Booking System", "CEWS Management Console", "CEWS Control Center", "CAPS Account Services", "Muzio: A Music Player with Online Player", "ClassQuiz: A Place where you can create quizzes", "Peter's Zone: My Portifolio Website", "CandleLight<sup>+</sup>: Light a candle and innagurate digitally"]
    },
    4: {
        lang: "JavaScript",
        level: "Intermediate",
        desc: "Started learning TypeScript by my own. Learned TypeScript mostly by building Projects. Made Projects that involve APIs, Google Services (Drive API, etc..)",
        rate: 6,
        projects: ["CEWS Booking System", "CEWS Management Console", "CEWS Control Center", "CAPS Account Services", "Muzio: A Music Player with Online Player", "ClassQuiz: A Place where you can create quizzes", "Peter's Zone: My Portifolio Website", "CandleLight<sup>+</sup>: Light a candle and innagurate digitally"]
    },
    5: {
        lang: "HTML & CSS",
        level: "Expert",
        desc: "Started learning HTML & CSS by my own. Learned HTML & CSS mostly by building Projects",
        rate: 7,
        projects: ["CEWS Booking System", "CEWS Management Console", "CEWS Control Center", "CAPS Account Services", "Muzio: A Music Player with Online Player", "ClassQuiz: A Place where you can create quizzes", "Peter's Zone: My Portifolio Website", "CandleLight<sup>+</sup>: Light a candle and innagurate digitally"]
    }
};
console.log("All Global Variables Initialized");
const typeWriter = () => {
    $("#desc-prev").html("");
    let i = 0;
    let j = 0;
    const text = [
        "I am a student",
        "I am a Web Developer",
        "I want to be a Full Stack Developer",
        "I want to be a DevOps Engineer",
    ];
    let write = () => {
        if (i < text[j].length) {
            $("#desc-prev").append(text[j].charAt(i));
            i++;
            setTimeout(write, 20);
        }
        else {
            setTimeout(() => {
                $("#desc-prev").html("");
                j < text.length - 1 ? (j = j + 1) : (j = 0);
                i = -1;
                console.log("Updating DOM Text");
                write();
            }, 2000);
        }
    };
    write();
};
const greet = () => {
    const time = new Date();
    if (time.getHours() >= 4 && time.getHours() < 12)
        $("#greeting").html("Good Morning");
    if (time.getHours() >= 12 && time.getHours() < 16)
        $("#greeting").html("Good Afternoon");
    if (time.getHours() >= 16 && time.getHours() <= 23)
        $("#greeting").html("Good Evening");
    if (time.getHours() >= 0 && time.getHours() <= 4)
        $("#greeting").html("Good Evening (Get some sleep thou)");
    console.log("Greeter Updated");
    setTimeout(greet, 3600000);
};
setTimeout(() => {
    typeWriter();
    greet();
    setTimeout(() => {
        $("body").append(`<div class="cookie"><div style="padding: 5px;background-color: #eadfd8;border-radius: 0.25rem;height: 70px;text-align: center;display: flex;align-items: center;"><span style="width: 50px; margin: 10px 30px 0 30px;"><img src="./resources/cookie.png" alt="" srcset="" width="100%"></span><span style="width: 50%; text-align: left;">We use <u>third party cookies</u> to customise your experience and to improve the site.</span><div style="display: block;right: 40px;position: absolute;padding: 13px 5px;/*! background-color: #decfc5; */border-radius: 1rem;display: block;"><span style="padding: 10px;background-color: #e2d7d2;border-radius: 1.2rem .2rem .2rem 1.2rem; border: 2px solid #cfc6c4" onclick="cookie_drop(1)">Accept</span>&nbsp;<span style="padding: 10px;background-color: white;border-radius: .2rem 1.2rem 1.2rem .2rem;border: 2px solid #decfc5;" onclick="cookie_drop(0)">Decline</span></div></div></div>`);
    }, 1000);
}, 1000);
//Scroll Animations
$(window).scroll(() => {
    let scroll = $(window).scrollTop();
    if (scroll >= 100 && scroll <= 350) {
        $("#about").css({ transform: "translateY(0)", opacity: 1 });
    }
    else if (scroll > 450 && scroll < 550) {
        $("#about").css({ transform: "translateY(-50px)", opacity: 0 });
    }
    else if (scroll < 100) {
        $("#about").css({ transform: "translateY(50px)", opacity: 0 });
    }
    //Title Change
    if (scroll <= 170)
        document.title = "Peter K Joseph >> Welcome";
    else if (scroll <= 850)
        document.title = "Peter K Joseph >> Overview";
    else
        document.title = "Peter K Joseph >> Languages";
    trackScale = scroll;
});
// Show Modal
let languageSelect = document.getElementsByClassName("language");
for (let i = 0; i < languageSelect.length; i++) {
    languageSelect[i].addEventListener("click", () => {
        for (let j = 0; j < Object.values(skillLevel).length; j++) {
            if (languageSelect[i].getAttribute("data-lang") == Object.values(skillLevel)[j].lang) {
                new DetailedViewer(skillLevel[j]);
            }
        }
    });
}
// Modal Viewer
class DetailedViewer {
    constructor(selected) {
        this.showModal = () => {
            const identifier = Math.random().toString(36).substring(7);
            $("html").append(`<div class="modal-full" id="${identifier}">
		<span class="close-md"id="${identifier}_close">X</span>
		</div>`);
            setTimeout(() => { $(`#${identifier}`).css({ "transform": "scale(1)", "opacity": 1 }); }, 100);
            document.getElementById(`${identifier}_close`).addEventListener("click", () => {
                $(`#${identifier}`).css({ "transform": "scale(1.5)", "opacity": 0 });
                setTimeout(() => {
                    $("#" + identifier).remove();
                }, 600);
            });
        };
        this.getDetails = selected;
        this.showModal();
    }
}
const cookie_drop = (response) => {
    if (response == 1) {
        console.log("Cookie Policy Accepted");
    }
    else {
        console.log("Cookie Policy Declined");
    }
    $(".cookie").css({ "transform": "scale(.8) translateX(-100px)", "opacity": "0" });
    setTimeout(() => { $(".cookie").remove(); }, 500);
};
