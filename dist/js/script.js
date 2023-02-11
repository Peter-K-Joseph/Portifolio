const eventObserverElements = {
    "navbar": document.querySelectorAll(".nav-items"),
    "home": document.querySelector('#home'),
    "experience": document.querySelector('#experience'),
    "projects": document.querySelector("#projects"),
    "certificates": document.querySelector("#certificates"),
    "main": document.querySelector(".main"),
    "education": document.querySelector("#education")
};
const apis = {
    "text": fetch("./apis/texts", { method: "get" }).then((data) => { return data.json(); }),
    "resume_url": fetch("./apis/resume", { method: "get" }).then((data) => { return data.json(); }),
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
const getCommonColorCode = (img) => {
    let blockSize = 5, defaultRGB = { r: 0, g: 0, b: 0 }, canvas = document.createElement('canvas'), context = canvas.getContext && canvas.getContext('2d'), data, width, height, i = -4, length, rgb = { r: 0, g: 0, b: 0 }, count = 0;
    if (!context)
        return defaultRGB;
    height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
    context.drawImage(img, 0, 0);
    try {
        data = context.getImageData(0, 0, width, height);
    }
    catch {
        return defaultRGB;
    }
    length = data.data.length;
    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);
    return rgb;
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
class education {
    endpoint = "./apis/education";
    constructor() {
        this.load_data();
    }
    load_data() {
        fetch(this.endpoint, { method: "get" }).then((data) => {
            return data.json();
        }).then((data) => this.load_education_data(data));
    }
    get_edu_data_body(element) {
        let DOMcontent = `<div class="institute">
			<div class="ins_data">
				<h1>${element["name"]}</h1>
				<img src="${element["img"]}" alt="Image of ${element["name"].split(" ")[0]}">
			</div>`;
        element["results"].forEach(result => {
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
        return DOMcontent;
    }
    async load_education_data(data) {
        document.querySelector(".education_data").innerHTML = "";
        const education = document.querySelector(".education_data");
        let DOMcontent = "";
        data.forEach(element => {
            DOMcontent += this.get_edu_data_body(element);
        });
        education.innerHTML = DOMcontent;
    }
}
const education_widget = new education();
class certificate {
    endpoint = "./apis/certificates";
    constructor() {
        this.load_data();
    }
    get_certificate_viewmode(data) {
        let DOMcontent;
        if (data["link"] != null) {
            DOMcontent = `<button class="related_files" id="getBadge" data-link="${data["link"]}">View Badge</button>`;
        }
        if (data["docuement"] != null) {
            DOMcontent = `<button class="related_files" id="getCertificate" data-link="${data["docuement"]}" data-title="${data["name"]}">View Certificate</button>`;
        }
        return DOMcontent;
    }
    view_file = (e, mode) => {
        const dispathInfoBox = document.querySelector(".dispathInfoBox");
        dispathInfoBox.classList.add("close_open");
        let x = e.currentTarget;
        console.log(x);
        const file = x.getAttribute("data-link");
        document.querySelector(".dispathInfoBox").innerHTML = `<div class="resourceRequested"><div><div class="files_serve"><div class="row">${x}</div></div></div></div><div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div>`;
        const resourceRequested = document.querySelector(".resourceRequested");
        setTimeout(() => {
            if (mode == "certificate") {
                if (window.innerWidth < 720)
                    resourceRequested.innerHTML = `<div><iframe src="/viewpdf?doclink=${file}&title=${x.getAttribute("data-title")}" width="100%" frameborder="0"></iframe></div>`;
                else {
                    resourceRequested.innerHTML = `<div><iframe src="${file}" width="100%" frameborder="0"></iframe></div>`;
                }
            }
            else {
                resourceRequested.innerHTML = `<div><iframe src="${file}" width="100%" frameborder="0"></iframe></div>`;
            }
            dispathInfoBox.classList.remove("close_open");
        }, 200);
    };
    certificate_view(data) {
        eventObserverElements.main.classList.add("onBackground");
        let DOMcontent = `
			<div class="dispathInfoBox">
				<div class="certificate">
					<div class="row">
						<div class="col"><img src="${data["logo"]}" ${(data["bg"] == "dark") ? 'class="dark"' : ''} alt="${data["provider"]}" srcset="">
					</div>
					<div class="col">
						<h2 class="role">${data["name"]}</h2>
						<span class="info">
							<div>
								<h4>Certificate Information</h4>
								<ul>${(data["info"] == null) ? '<li>No information regarding this certificate was provided</li>' : data["info"]}</span>
							</div>
						</span>
						<div>${this.get_certificate_viewmode(data)}
					</div>
				</div>
			</div>
		</div>
		<div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div></div>`;
        document.querySelector(".sub").innerHTML = DOMcontent;
        if (data["link"] != null) {
            document.querySelector("#getBadge").removeEventListener("click", () => { });
            document.querySelector("#getBadge").addEventListener("click", (e) => this.view_file(e, "badge"));
        }
        if (data["docuement"] != null) {
            document.querySelector("#getCertificate").removeEventListener("click", () => { });
            document.querySelector("#getCertificate").addEventListener("click", (e) => this.view_file(e, "certificate"));
        }
    }
    load_data() {
        fetch(this.endpoint, { method: "get" }).then((data) => {
            return data.json();
        }).then((data) => this.load_certificate_data(data));
    }
    load_certificate_data(data) {
        document.querySelector("#total_certificates_value").innerHTML = data.length;
        const certificate = document.querySelector(".recent_certificate");
        let DOMcontent = "";
        for (let i = 0; i < data.length; i++) {
            DOMcontent += `<div class="certificate" data-id="${i}">
			<img src="${data[i]["logo"]}" alt="${data[i]["provider"]}">
				<span class="name">${data[i]["name"]}</span>
			</div>`;
        }
        certificate.innerHTML = DOMcontent;
        document.querySelectorAll(".certificate").forEach((element) => {
            element.addEventListener("click", () => {
                this.certificate_view(data[element.getAttribute("data-id")]);
            });
        });
    }
}
const certificate_widget = new certificate();
class experience {
    endpoint = "./apis/internship";
    constructor() {
        this.load_data();
    }
    load_data() {
        fetch(this.endpoint, { method: "get" }).then((data) => {
            return data.json();
        }).then((data) => this.load_internship_data(data));
    }
    get_key_points = (curr_selection) => {
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
    view_file = (e, dispathInfoBox) => {
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
    };
    dispatch_datafiles = (interData, e) => {
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
                e.addEventListener("click", (e) => {
                    this.view_file(e, dispathInfoBox);
                });
            });
        }, 200);
    };
    company_onclick(interData, e) {
        eventObserverElements.main.classList.add("onBackground");
        let curr_selection = interData[e.target.getAttribute("data-id")];
        let DOMcontent = `<div class="dispathInfoBox"><div class="internship"><div class="row"><div class="col"><img src="${curr_selection.image}" ${(curr_selection.bg == "dark") ? 'class="dark"' : ''} alt="${curr_selection.company.full}" srcset=""></div><div class="col"><h2 class="role">${curr_selection.role}</h2><h3 data-tooltip="${curr_selection.about}">${curr_selection.company.full} <span class="duration">${curr_selection.duration}</span></h3><span class="info"><div><h4>Experience</h4>${this.get_key_points(curr_selection)}</div></span><div>${(curr_selection.files.length == 0) ? "" : `<button class="related_files" id="getInternshipCompletionLetter" data-id="${e.target.getAttribute("data-id")}">View Related Files</button>`}</div></div></div><span class="disclaimer">*Offer letter and other project details may be hidden due to legal reasons</span></div><div class="goback" id="closeEventButton" onclick="apis.dispatch_viewBarClose()">Click to close</div></div>`;
        document.querySelector(".sub").innerHTML = DOMcontent;
        if (curr_selection.files.length == 0)
            return;
        const internshipDataButton = document.querySelector("#getInternshipCompletionLetter");
        internshipDataButton.removeEventListener("click", () => { });
        internshipDataButton.addEventListener("click", (e) => {
            this.dispatch_datafiles(interData, e);
        });
    }
    load_internship_data(data) {
        const interData = data;
        for (let i = 0; i < interData.length; i++) {
            let DOMcontent = `<div class="content-box"><div class="companies"><div class="company"><img src=${interData[i].image} ${(interData[i].bg == "dark") ? 'class="dark"' : ''} alt=${interData[i].company.full}><div><h3><span class="role">${interData[i].role}</span>, <span class="company">${interData[i].company.short}</span></h3></div></div></div><div class="read-more"><button class="btn companyClicked" data-id="${i}">CLICK TO KNOW MORE</button></div></div>`;
            document.querySelector(`#dispatchWorkExperienceData`).innerHTML = document.querySelector(`#dispatchWorkExperienceData`).innerHTML + DOMcontent;
        }
        document.querySelectorAll(".companyClicked").forEach((e) => {
            e.addEventListener("click", (e) => {
                this.company_onclick(interData, e);
            });
        });
    }
}
const intership_widget = new experience();
class projects {
    endpoint = "/apis/projects";
    constructor() {
        fetch(this.endpoint).then((e) => {
            e.json().then((e) => {
                this.load_project_data(e);
            });
        }).catch((e) => {
            console.log(e);
        });
    }
    compoundSelectHTML = (mode, lang, comp) => {
        let stream = ((mode == 0) ? lang : comp);
        let data = '';
        if (mode == 0)
            for (let i = 0; i < stream.length; i++)
                data = data + `<span class="framework">${stream[i]}</span>`;
        else
            return (stream != null) ? `<span class="colab">${stream}</span>` : '';
        return data;
    };
    appendHTML = (title, lang, comp, desc) => {
        const target = document.querySelector("#my_projects");
        target.innerHTML = target.innerHTML + `<div class="project"><h4><span>${title}</span><div class="frameworks">${this.compoundSelectHTML(0, lang, comp)}${this.compoundSelectHTML(1, lang, comp)}</div></h4><div class="contain"><div class="desc">${desc}</div></div></div>`;
    };
    load_project_data(e) {
        document.querySelector("#total_project").innerHTML = e.length.toString();
        for (let i = 0; i < e.length; i++)
            this.appendHTML(e[i].name, e[i].frameworks, e[i].organisation, e[i].desc);
    }
}
const project_widget = new projects();
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
// Project view
new IntersectionObserver(function () {
    let element = document.querySelector("[alias-project]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    eventObserverElements.projects.classList.add("active");
}, { threshold: [.5] }).observe(eventObserverElements.projects);
// Education view
new IntersectionObserver(() => {
    let element = document.querySelector("[alias-education]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    eventObserverElements.education.classList.add("active");
}, { threshold: [.5] }).observe(eventObserverElements.education);
// Certificate view
new IntersectionObserver(function () {
    let element = document.querySelector("[alias-certificates]");
    if (!element.classList.contains("active")) {
        document.querySelector("li.active").classList.remove("active");
        element.classList.add("active");
    }
    eventObserverElements.certificates.classList.add("active");
}, { threshold: [.5] }).observe(eventObserverElements.certificates);
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
