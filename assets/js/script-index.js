"use strict";
console.log("Started part");
//////////////////////////////////////////////////
// imp variables

let onSubMenu = false;
let buttonActive = true;
const subMenuNameList = ["tv", "movies", "sports", "hamburger-menu"]
let pointer = 2;
let firstTime = true;
let lastTimeSlideMoved = 0;
let numberOfLayer = 3;
let scrollNewLayer = false;
let warning = 1
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// Imp fuction

function sliceLast2(str) {
    if (str) {
        return parseInt(str.slice(0, str.length - 2))
    }
    return 0;
}
function lastElement(array) {
    return array[array.length - 1]
}
function select(selection, singleElement = true) {
    if (singleElement) {
        return document.querySelector(selection)
    } else {
        return document.querySelectorAll(selection)
    }
}
function clearSubMenu() {
    for (let i = 0; i < subMenuNameList.length; i++) {
        let subMenu = select(`#sub-menu-${subMenuNameList[i]}`)
        subMenu.style.display = "none";
    }
}
function append(mainElement, ...subElements) {
    subElements.forEach(subElement => {
        mainElement.append(subElement);
    })
}
function showNotification() {
    select("#notification").style.display = "flex";
    clearSubMenu()
}
function newElement(cls, content = "", tag = "div",notification=0) {
    let element = document.createElement(tag);
    if (cls) {
        if (typeof cls === "object") {
            cls.forEach(clsElement => {
                element.classList.add(clsElement);
            });
        } else {
            element.classList.add(cls);
        }
    }
    if (content) {
        element.innerText = content;
    }
    if(notification){
        element.addEventListener("click",showNotification)
    }
    return element;
}
function createCard(pointer) {
    let cardData = slideShowData[pointer];
    let card = newElement("card");
    card.style.backgroundImage = `url(assets/img/heading-presentation/${cardData["image-url"]}.webp)`
    let info = newElement("info");
    let content = newElement("content");
    let heading = newElement("heading", cardData["name"]);
    let about = newElement("about");
    for (let i = 0; i < cardData["about"].length - 1; i++) {
        about.appendChild(newElement("after", cardData["about"][i], "span"))
    }
    about.appendChild(newElement("", lastElement(cardData["about"]), "span"));
    let description = newElement("description", cardData["description"]);
    content.appendChild(heading)
    content.appendChild(about)
    content.appendChild(description)
    info.appendChild(content)
    card.appendChild(info)
    return card
}
function moveSliderLeft() {
    pointer = (pointer + 1) % slideShowLength
    let newCard = createCard(pointer);
    select("#heading-presentation").appendChild(newCard);
    let del = select("#heading-presentation > .card");
    del.style.width = "0px";
    del.style.margin = "0px";
    setTimeout(function () {
        del.remove()
    }, 800);
}
function moveSliderRight() {
    let tempPointer = (pointer - 3)
    if (tempPointer < 0) {
        tempPointer = slideShowLength + tempPointer;
    }
    let card = createCard(tempPointer);
    card.style.width = "0px";
    card.style.margin = "0px";

    select("#heading-presentation").prepend(card);

    setTimeout(function () {
        select("#heading-presentation > .card").style.width = ""
        select("#heading-presentation > .card").style.margin = "0px 25px 0px 0px"
        select("#heading-presentation > .card:nth-child(4)").remove();
        pointer = pointer - 1;
        if (pointer === -1) {
            pointer = slideShowLength - 1;
        }
    }, 100);
}
function createBlock(showInfo) {
    let block = newElement(["block", "pointer"],"","div",1);
    block.id = showInfo["id"]
    block.style.backgroundImage = `url(assets/img/shows/${showInfo["id"]}.webp)`
    let nestedBlock = newElement("nested-block")
    let title = newElement("block-title", showInfo["show-title"]);
    let description = newElement("block-description", showInfo["description"]);
    let about = newElement("block-about", showInfo["sub-info"]);
    append(nestedBlock, title, about, description)
    if (showInfo["type"] == "MOVIE") {
        let watchMovie = newElement("action");
        let watchMovieIcon = newElement(["action-icon", "watch-movie"]);
        let watchMovieText = newElement("action-text", "WATCH MOVIE");
        append(watchMovie, watchMovieIcon, watchMovieText)
        append(nestedBlock, watchMovie)
    }
    let addWatchlist = newElement("action");
    let addWatchlistIcon = newElement(["action-icon", "add-watchlist"]);
    let addWatchlistText = newElement("action-text", "ADD TO WATCHLIST");
    append(addWatchlist, addWatchlistIcon, addWatchlistText)
    append(nestedBlock, addWatchlist)
    block.appendChild(nestedBlock)
    return block;
}
function createLayel(blocklinetitle) {
    let lever = [0, 0];
    let layer = newElement(`layer`);
    let title = newElement([`blocklinetitle`,"pointer"], blocklinetitle, "a",1);
    let blockline = newElement(`blockline`);
    for (let sh = 0; sh < 8; sh++) {
        blockline.appendChild(createBlock(shows[blocklinetitle][sh]))
    }
    let count = 8;
    let leftArrow = newElement(["leftArrow", "hidden"]);
    let rightArrow = newElement("rightArrow");
    leftArrow.appendChild(newElement("left"));
    rightArrow.appendChild(newElement("left"));
    append(layer, leftArrow, rightArrow, title, blockline)

    leftArrow.addEventListener("click", function () {
        lever[0] -= 1
        rightArrow.classList.remove("hidden")
        if (sliceLast2(blockline.style.left) == -100) {
            blockline.style.left = "0em"
            leftArrow.classList.add("hidden")
        }
        else {
            blockline.style.left = sliceLast2(blockline.style.left) + 100 + "em"
        }
    })
    rightArrow.addEventListener("click", function () {
        leftArrow.classList.remove("hidden");
        if (lever[0] === lever[1]) {

            lever[1] += 1
            for (let sh = count; sh < count + 8; sh++) {
                if (count === Object.keys(shows[blocklinetitle]).length) {
                    rightArrow.classList.add("hidden");
                    break
                }
                blockline.appendChild(createBlock(shows[blocklinetitle][sh]))
                count += 1
            }
            if (blockline.style.width) {
                blockline.style.width = sliceLast2(blockline.style.width) + 100 + "vw"
            } else {
                blockline.style.width = "200vw"
            }
        }
        blockline.style.left = sliceLast2(blockline.style.left) - 100 + "vw"
        lever[0] += 1

    })
    layer.addEventListener("mouseover", function () {
        leftArrow.style.opacity = "1"
        rightArrow.style.opacity = "1"
    })
    layer.addEventListener("mouseleave", function () {
        leftArrow.style.opacity = "0"
        rightArrow.style.opacity = "0"
    })
    select("#main-body").insertBefore(layer, select("footer"))
    //select("#main-body").prepend(layer);
}
//////////////////////////////////////////////////
// running slide show
//////////////////////////////////////////////////
function main(ctime) {
    window.requestAnimationFrame(main);
    if(window.window.outerWidth<=800 && warning){
        alert(`This website is optimized for a large screen (laptop). All the data and info are fetching from JSON file by javascript
This is just a clone of hotstar website which is a bit complicated to convert into responsive and it takes some time`)
        warning=0;
    }
    if(window.window.outerWidth>800 && !warning){
        warning=1;
    }
    if (lastTimeSlideMoved === -1 || !buttonActive) {
        lastTimeSlideMoved = ctime;
    }
    if (ctime - lastTimeSlideMoved > 7000) {
        lastTimeSlideMoved = ctime;
        moveSliderLeft()
    }
}
//////////////////////////////////////////////////
// adding Event Listener
//////////////////////////////////////////////////
select("#left").addEventListener("click", () => {
    if (buttonActive) {
        moveSliderRight()
        lastTimeSlideMoved = -1;
        buttonActive = false;
        setTimeout(() => {
            buttonActive = true;
        }, 1000);
    }
})
select("#right").addEventListener("click", () => {
    if (buttonActive) {
        moveSliderLeft()
        lastTimeSlideMoved = -1;
        buttonActive = false;
        setTimeout(() => {
            buttonActive = true;
        }, 1000);
    }
})
select("#heading-presentation").addEventListener("mouseover", () => {
    document.getElementById("arrow").style.opacity = "1"
})
select("#heading-presentation").addEventListener("mouseleave", () => {
    document.getElementById("arrow").style.opacity = "0"
})
select("#search-input").addEventListener("blur", () => {
    select("#search-input").value = ""
})
for (let i = 0; i < subMenuNameList.length; i++) {
    let element = document.getElementById(subMenuNameList[i])
    let sumMenu = document.getElementById(`sub-menu-${subMenuNameList[i]}`)
    element.addEventListener("mouseover", () => {
        clearSubMenu()
        sumMenu.style.display = "flex"
    })
    element.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!onSubMenu) {
                sumMenu.style.display = "none"
            }
        }, 1000)
    })
    sumMenu.addEventListener("mouseover", () => {
        onSubMenu = true;
    })
    sumMenu.addEventListener("mouseleave", () => {
        sumMenu.style.display = "none"
    })

}
[...select("#sub-menu div a",0),select("#subscribe button"),...select(".show-notification",0)].forEach(element => {
    element.addEventListener("click",showNotification)
});

select("#notification-cut").addEventListener("click", () => {
    select("#notification").style.display = "none";
})
window.addEventListener("scroll", () => {
    let { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop > scrollHeight*0.98 && numberOfLayer && scrollNewLayer) {
        console.log("You reached end of website")
        if (numberOfLayer % 2) {
            createLayel("Latest & Trending");
        } else {
            createLayel("Popular Shows");
        }
        numberOfLayer -= 1
    }
})
//////////////////////////////////////////////////
// Loading data from json file
let slideShowData, slideShowLength, shows;
async function loadData() {
    let slideShowDataFetch = await fetch(`assets/data/heading-presentation.json`);
    let showDataFetch = await fetch(`assets/data/shows.json`);
    slideShowData = await slideShowDataFetch.json();
    shows = await showDataFetch.json();
    slideShowLength = await Object.keys(slideShowData).length;
    for (let i = 0; i < 3; i++) {
        document.getElementById("heading-presentation").appendChild(createCard(i));
    }
    await window.requestAnimationFrame(main);
    await createLayel("Latest & Trending");
    await createLayel("Popular Shows");
    await (() => {scrollNewLayer=1;})()
}
loadData();