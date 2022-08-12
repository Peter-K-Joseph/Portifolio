const eventObserverElements = {
    "navbar": document.querySelectorAll(".nav-items"),
    "home": document.querySelector('#home'),
    "experience": document.querySelector('#experience'),
    "projects": document.querySelector("#projects"),
    "main": document.querySelector(".main"),
    "education": document.querySelector("#education")
};
const apis = {
    "interships": fetch("./apis/internship", { method: "post" }).then((data) => { return data.json(); }),
    "education": fetch("./apis/education", { method: "post" }).then((data) => { return data.json(); }),
    "projects": fetch("/apis/projects", { method: "post" }).then(data => { return data.json(); }),
    "text": fetch("./apis/texts", { method: "post" }).then((data) => { return data.json(); }),
    "resume_url": fetch("./apis/resume", { method: "post" }).then((data) => { return data.json(); }),
    "dispatch_viewBarClose": () => {
        let dispathInfoBox = document.querySelector(".dispathInfoBox");
        dispathInfoBox.classList.add("close");
        setTimeout(() => {
            eventObserverElements.main.classList.remove("onBackground");
            dispathInfoBox.remove();
        }, 400);
    },
    "animationHandler": (state) => {
        const states = ["paused", "running"];
        const animationContainer = document.querySelectorAll("[data-animation]");
        animationContainer.forEach(element => {
            element.style.animationPlayState = states[state];
        });
    },
    "removeActive": (e) => {
        if (document.querySelector("div.active") != null)
            document.querySelector("div.active").classList.remove("active");
        document.querySelector(`#${e}`).classList.add("active");
    }
};
apis.animationHandler(0);
document.querySelector("#view_resume").addEventListener('click', () => {
    apis.resume_url.then((e) => {
        let DOMcontent;
        if (window.innerWidth < 720)
            DOMcontent = `<div class="dispathInfoBox"><div class="resourceRequested"><div><iframe src="/viewpdf?title=Peter's Resume&doclink=${e}" width="100%" frameborder="0"></iframe></div></div><div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div></div>`;
        else
            DOMcontent = `<div class="dispathInfoBox"><div class="resourceRequested"><div><iframe src="${e}" width="100%" frameborder="0"></iframe></div></div><div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div></div>`;
        document.querySelector(".sub").innerHTML = DOMcontent;
    });
});
eventObserverElements.navbar.forEach(element => {
    element.addEventListener("click", (e) => {
        if (document.querySelector("#closeEventButton") != null)
            document.getElementById("closeEventButton").click();
    });
});
async function typeSentence(e, data) {
    const typeDelay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    const intro_text = [document.querySelector(".boldified"), document.querySelector(".underlined")];
    const prof = data["bold"];
    const quotes = data["underline"];
    intro_text[0].innerHTML = prof[e];
    intro_text[1].innerHTML = "";
    intro_text[1].style.opacity = "1";
    const letters = quotes[e].split("");
    let i = 0;
    while (i < letters.length) {
        await typeDelay(50);
        intro_text[1].innerHTML = intro_text[1].innerHTML + letters[i];
        i++;
    }
    setTimeout(() => { intro_text[1].style.opacity = "0"; }, 4500);
    setTimeout(() => { typeSentence((e == prof.length - 1) ? 0 : e + 1, data); }, 5000);
    return;
}
apis.text.then((data) => { typeSentence(0, data); }).catch(() => {
    console.error("[TEXT] TextWrite Module Error. apis.text did not succeed");
});
apis.education.then((data) => {
    const education = document.querySelector(".education_data");
    let DOMcontent = "";
    data.forEach(element => {
        DOMcontent += `<div class="institute">
		<div class="ins_data">
			<h1>${element["name"]}</h1>
			<img src="${element["img"]}" alt="Image of ${element["name"].split(" ")[0]}">
		</div>`;
        element["results"].forEach(result => {
            console.log(result);
            DOMcontent += `<div class="exam">
			<h3 class="edu">${result["name"]}</h3>
			<span class="score">
				<div class="slider">
					<div class="represent" style="width: ${parseFloat(result["marks"]["got"]) / parseFloat(result["marks"]["max"]) * 100}%" data-represent="${result["marks"]["got"]}"></div>
				</div>
				<div class="scoreboard">
					<span>${result["marks"]["min"]}</span>
					<span>${result["marks"]["max"]}</span>
				</div>  
				<div class="info">${(result["desc"] == null ? '' : result["desc"])}</div>
			</span>
		</div>`;
        });
        DOMcontent += `</div>`;
    });
    education.innerHTML = DOMcontent;
}).catch(() => {
    console.error("[EDUCATION] Education Module Error. apis.education did not succeed");
});
apis.interships.then((e) => {
    const interData = e;
    for (let i = 0; i < interData.length; i++) {
        let DOMcontent = `<div class="content-box"><div class="companies"><div class="company"><img src=${interData[i].image} ${(interData[i].bg == "dark") ? 'class="dark"' : ''} alt=${interData[i].company.full}><div><h3><span class="role">${interData[i].role}</span>, <span class="company">${interData[i].company.short}</span></h3></div></div></div><div class="read-more"><button class="btn companyClicked" data-id="${i}">CLICK TO KNOW MORE</button></div></div>`;
        document.querySelector(`#dispatchWorkExperienceData`).innerHTML = document.querySelector(`#dispatchWorkExperienceData`).innerHTML + DOMcontent;
    }
    document.querySelectorAll(".companyClicked").forEach((e) => {
        e.addEventListener("click", (e) => {
            eventObserverElements.main.classList.add("onBackground");
            let curr_selection = interData[e.target.getAttribute("data-id")];
            const getKeyPoints = () => {
                let childLI;
                let main = document.createElement("div");
                let parentUL = document.createElement('ul');
                main.appendChild(parentUL);
                if (curr_selection.keypoints.length == 0) {
                    return "<ul><li>No Experience posted yet... This may be because this internship is still in progress</li></ul>";
                }
                for (let i = 0; i < curr_selection.keypoints.length; i++) {
                    childLI = document.createElement("li");
                    childLI.innerHTML = curr_selection.keypoints[i];
                    parentUL.appendChild(childLI);
                }
                return main.innerHTML;
            };
            let DOMcontent = `<div class="dispathInfoBox"><div class="internship"><div class="row"><div class="col"><img src="${curr_selection.image}" ${(curr_selection.bg == "dark") ? 'class="dark"' : ''} alt="${curr_selection.company.full}" srcset=""></div><div class="col"><h2 class="role">${curr_selection.role}</h2><h3 data-tooltip="${curr_selection.about}">${curr_selection.company.full} <span class="duration">${curr_selection.duration}</span></h3><span class="info"><div><h4>Experience</h4>${getKeyPoints()}</div></span><div>${(curr_selection.files.length == 0) ? "" : `<button class="getInternshipCompletionLetter" id="getInternshipCompletionLetter" data-id="${e.target.getAttribute("data-id")}">View Related Files</button>`}</div></div></div><span class="disclaimer">*Offer letter and other project details may be hidden due to legal reasons</span></div><div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div></div>`;
            document.querySelector(".sub").innerHTML = DOMcontent;
            if (curr_selection.files.length == 0)
                return;
            const internshipDataButton = document.querySelector("#getInternshipCompletionLetter");
            internshipDataButton.removeEventListener("click", () => { });
            internshipDataButton.addEventListener("click", (e) => {
                const dataStream = interData[e.target.getAttribute("data-id")].files;
                let dispathInfoBox = document.querySelector(".dispathInfoBox");
                dispathInfoBox.classList.add("close_open");
                setTimeout(() => {
                    let x = '';
                    for (let i in dataStream) {
                        x += `<div class="col" data-intern-link="${dataStream[i]["file"]}" data-intern-name="${dataStream[i]["name"]}"><img src="./resources/pdf_icon.png" alt="PDF Icon"><span>${dataStream[i]["name"]}</span></div>`;
                    }
                    let DOMcontent = `<div class="resourceRequested"><div><div class="files_serve"><div class="row">${x}</div></div></div></div><div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div>`;
                    document.querySelector(".dispathInfoBox").innerHTML = DOMcontent;
                    dispathInfoBox.classList.remove("close_open");
                    const dataInterLink = document.querySelectorAll("[data-intern-link]");
                    dataInterLink.forEach((e) => {
                        e.removeEventListener("click", () => { });
                    });
                    dataInterLink.forEach((e) => {
                        e.addEventListener("click", (e) => {
                            dispathInfoBox.classList.add("close_open");
                            let x = e.currentTarget;
                            setTimeout(() => {
                                const file = x.getAttribute("data-intern-link");
                                if (window.innerWidth < 720)
                                    document.querySelector(".resourceRequested").innerHTML = `<div><iframe src="/viewpdf?doclink=${file}&title=${x.getAttribute("data-intern-name")}" width="100%" frameborder="0"></iframe></div>`;
                                else
                                    document.querySelector(".resourceRequested").innerHTML = `<div><iframe src="${file}" width="100%" frameborder="0"></iframe></div>`;
                                dispathInfoBox.classList.remove("close_open");
                            }, 200);
                        });
                    });
                }, 200);
            });
        });
    });
});
apis.projects.then((e) => {
    const target = document.querySelector("#my_projects");
    const appendHTML = (title, lang, comp, desc) => {
        const compoundSelectHTML = (mode) => {
            let stream = ((mode == 0) ? lang : comp);
            let data = '';
            if (mode == 0)
                for (let i = 0; i < stream.length; i++)
                    data = data + `<span class="framework">${stream[i]}</span>`;
            else
                return (stream != null) ? `<span class="colab">${stream}</span>` : '';
            return data;
        };
        target.innerHTML = target.innerHTML + `<div class="project"><h4><span>${title}</span><div class="frameworks">${compoundSelectHTML(0)}${compoundSelectHTML(1)}</div></h4><div class="contain"><div class="desc">${desc}</div></div></div>`;
    };
    for (let i = 0; i < e.length; i++)
        appendHTML(e[i].name, e[i].frameworks, e[i].organisation, e[i].desc);
});
// Animation and Transition
const transitionScaling = 2;
eventObserverElements.main.addEventListener("scroll", (e) => {
    new IntersectionObserver(function (entries) {
        let x = 0;
        if (entries[0].intersectionRatio <= .25)
            return;
        const val = eventObserverElements.main.scrollTop / (document.querySelector("#home").clientHeight * 2 / transitionScaling);
        if (document.querySelector("div.active") != null && entries[0].intersectionRatio >= .9)
            document.querySelector("div.active").classList.remove("active");
        document.querySelectorAll('#home div.col').forEach((e) => {
            x = x + 1;
            if (x == 1) {
                e.style.opacity = `${(100 - (val * 100 / x * transitionScaling))}%`;
                e.style.transform = `translateY(-${val * 100 / x}%) perspective(30px) rotateY(${eventObserverElements.main.scrollTop / document.querySelector("#home").clientHeight}deg)`;
            }
            else
                e.style.transform = `translateY(-${val * 100 / x}%)`;
        });
    }).observe(document.querySelector("#home"));
}, { passive: true });
// Intersection Observers for individual views
// >> Experience
new IntersectionObserver(() => {
    let element = document.querySelector("div.active");
    if (element != null) {
        element.classList.remove("active");
    }
    element = eventObserverElements.experience;
    if (!element.classList.contains("active")) {
        element.classList.add("active");
    }
}, { threshold: [.4] }).observe(eventObserverElements.experience);
// >> Home view
new IntersectionObserver(function () {
    let element = document.querySelector("[alias-home]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    if (document.querySelector(".main .active").classList.contains("active")) {
        document.querySelector(".main .active").classList.remove("active");
    }
}, { threshold: [.6] }).observe(eventObserverElements.home);
// Experience view
new IntersectionObserver(function () {
    let element = document.querySelector("[alias-experience]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    eventObserverElements.experience.classList.add("active");
}, { threshold: [.6] }).observe(eventObserverElements.experience);
// Education view
new IntersectionObserver(function () {
    let element = document.querySelector("[alias-education]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    eventObserverElements.education.classList.add("active");
}, { threshold: [.2, .6] }).observe(eventObserverElements.education);
// Project view
new IntersectionObserver(function () {
    let element = document.querySelector("[alias-project]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    eventObserverElements.projects.classList.add("active");
}, { threshold: [.2] }).observe(eventObserverElements.projects);
// Scroll View observer for elements
document.querySelector(".main").addEventListener("scroll", () => {
    const rendererOnView = () => {
        return ((document.querySelector(".main").scrollTop - document.querySelector("#projects").offsetTop) / document.querySelector("#projects").scrollHeight) * 1.8 * 100;
    };
    const ctx = rendererOnView();
    if (ctx < 120 && ctx > -20) {
        if (document.querySelector(".scrollbit").classList.contains("hide")) {
            document.querySelector(".scrollbit").classList.remove("hide");
            let element = document.querySelector("[alias-project]");
            if (!element.classList.contains("active")) {
                document.querySelector("li.active").classList.remove("active");
                element.classList.add("active");
            }
            element = eventObserverElements.projects;
            if (!element.classList.contains("active"))
                element.classList.add("active");
        }
        document.querySelector(".scrollbit").style.height = `${(ctx)}vh`;
    }
    else if ((ctx > 120 || ctx < -20) && !document.querySelector(".scrollbit").classList.contains("hide")) {
        document.querySelector(".scrollbit").classList.add("hide");
    }
}, { passive: true });
window.addEventListener('load', () => {
    document.querySelector(".load").style.animation = "completed 2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards";
    document.querySelector(".loader").style.animation = "identifier 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards";
    setTimeout(() => {
        document.querySelector(".sub").innerHTML = "";
        apis.animationHandler(1);
    }, 1000);
}, false);
