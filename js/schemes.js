// =============================
// GOVERNMENT SCHEMES JS
// =============================


// NAVBAR EFFECT ON SCROLL

window.addEventListener("scroll", function(){

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.background = "#0f3d23";
        navbar.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";

    }

    else{

        navbar.style.background = "#14532d";
        navbar.style.boxShadow = "none";

    }

});


// HERO BUTTON SMOOTH SCROLL

const heroBtn = document.querySelector(".hero-btn");

if(heroBtn){

    heroBtn.addEventListener("click", function(e){

        e.preventDefault();

        const schemeSection = document.querySelector("#schemes");

        schemeSection.scrollIntoView({
            behavior:"smooth"
        });

    });

}


// READ MORE BUTTONS

const buttons = document.querySelectorAll(".card-content button");

buttons.forEach((button)=>{

    button.addEventListener("click", function(){

        const title =
        this.parentElement.querySelector("h3").innerText;

        alert("More details about " + title + " coming soon!");

    });

});


// CARD HOVER EFFECT

const cards = document.querySelectorAll(".scheme-card");

cards.forEach((card)=>{

    card.addEventListener("mouseenter", ()=>{

        card.style.transform =
        "translateY(-12px) scale(1.02)";

    });

    card.addEventListener("mouseleave", ()=>{

        card.style.transform =
        "translateY(0px) scale(1)";

    });

});


// SCROLL ANIMATION

const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0px)";

        }

    });

},{
    threshold:0.2
});


// TARGET ELEMENTS

const hiddenElements = document.querySelectorAll(
".scheme-card, .benefit-box, .section-title"
);

hiddenElements.forEach((el)=>{

    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 1s ease";

    observer.observe(el);

});


// DARK MODE BUTTON

const darkBtn = document.createElement("button");

darkBtn.innerHTML = "🌙";

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

darkBtn.addEventListener("click", ()=>{

    darkMode = !darkMode;

    if(darkMode){

        document.body.style.background = "#111827";
        document.body.style.color = "white";

        document.querySelectorAll(".scheme-card").forEach(card=>{

            card.style.background = "#1f2937";
            card.style.color = "white";

        });

        document.querySelectorAll(".benefit-box").forEach(box=>{

            box.style.background = "#1f2937";
            box.style.color = "white";

        });

    }

    else{

        document.body.style.background = "#f5f7f2";
        document.body.style.color = "black";

        document.querySelectorAll(".scheme-card").forEach(card=>{

            card.style.background = "white";
            card.style.color = "black";

        });

        document.querySelectorAll(".benefit-box").forEach(box=>{

            box.style.background = "#ecfdf5";
            box.style.color = "black";

        });

    }

});


// PAGE LOADING EFFECT

window.addEventListener("load", ()=>{

    document.body.style.opacity = "0";

    setTimeout(()=>{

        document.body.style.transition = "opacity 1s";
        document.body.style.opacity = "1";

    },200);

});


// AUTO FOOTER YEAR

const footer = document.querySelector(".footer p");

if(footer){

    const year = new Date().getFullYear();

    footer.innerHTML =
    `© ${year} Ecova Agriculture Website | All Rights Reserved`;

}