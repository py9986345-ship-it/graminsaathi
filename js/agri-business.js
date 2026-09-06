// ===============================
// AGRI BUSINESS WEBSITE JS
// ===============================

// NAVBAR SCROLL EFFECT

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "#0f3d23";
        navbar.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    } else {
        navbar.style.background = "#14532d";
        navbar.style.boxShadow = "none";
    }
});


// HERO BUTTON SMOOTH SCROLL

const heroBtn = document.querySelector(".hero-btn");

if(heroBtn){

    heroBtn.addEventListener("click", function(e){

        e.preventDefault();

        const businessSection = document.querySelector("#business");

        businessSection.scrollIntoView({
            behavior: "smooth"
        });

    });

}


// READ MORE BUTTONS

const buttons = document.querySelectorAll(".card-content button");

buttons.forEach((button) => {

    button.addEventListener("click", function () {

        const cardTitle = this.parentElement.querySelector("h3").innerText;

        alert("More details about " + cardTitle + " coming soon!");

    });

});


// CARD HOVER ANIMATION

const cards = document.querySelectorAll(".business-card");

cards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-12px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0px) scale(1)";

    });

});


// SCROLL ANIMATION

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0px)";

        }

    });

}, {
    threshold: 0.2
});


// APPLY ANIMATION TO ELEMENTS

const hiddenElements = document.querySelectorAll(
    ".business-card, .why-box, .section-title"
);

hiddenElements.forEach((el) => {

    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 1s ease";

    observer.observe(el);

});


// AUTO ACTIVE NAVBAR LINK

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href").includes(current)) {

            link.classList.add("active");

        }

    });

});


// TYPING EFFECT FOR HERO TEXT

const heroHeading = document.querySelector(".hero-content h1");

if(heroHeading){

    const text = "AGRI BUSINESS IDEAS";

    let index = 0;

    heroHeading.innerHTML = "";

    function typeEffect(){

        if(index < text.length){

            heroHeading.innerHTML += text.charAt(index);

            index++;

            setTimeout(typeEffect, 100);

        }

    }

    typeEffect();

}


// DARK MODE TOGGLE

const darkBtn = document.createElement("button");

darkBtn.innerText = "🌙";

darkBtn.style.position = "fixed";
darkBtn.style.bottom = "20px";
darkBtn.style.right = "20px";
darkBtn.style.padding = "12px";
darkBtn.style.border = "none";
darkBtn.style.borderRadius = "50%";
darkBtn.style.cursor = "pointer";
darkBtn.style.background = "#15803d";
darkBtn.style.color = "white";
darkBtn.style.fontSize = "20px";
darkBtn.style.zIndex = "999";

document.body.appendChild(darkBtn);

let darkMode = false;

darkBtn.addEventListener("click", () => {

    darkMode = !darkMode;

    if(darkMode){

        document.body.style.background = "#111827";
        document.body.style.color = "white";

        document.querySelectorAll(".business-card").forEach(card => {
            card.style.background = "#1f2937";
            card.style.color = "white";
        });

        document.querySelectorAll(".why-box").forEach(box => {
            box.style.background = "#1f2937";
            box.style.color = "white";
        });

    }

    else{

        document.body.style.background = "#f5f7f2";
        document.body.style.color = "black";

        document.querySelectorAll(".business-card").forEach(card => {
            card.style.background = "white";
            card.style.color = "black";
        });

        document.querySelectorAll(".why-box").forEach(box => {
            box.style.background = "#f0fdf4";
            box.style.color = "black";
        });

    }

});


// LOADING ANIMATION

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = "opacity 1s";
        document.body.style.opacity = "1";

    }, 200);

});


// CURRENT YEAR AUTO UPDATE

const footer = document.querySelector(".footer p");

if(footer){

    const year = new Date().getFullYear();

    footer.innerHTML =
    `© ${year} Ecova Agriculture Website | All Rights Reserved`;

}