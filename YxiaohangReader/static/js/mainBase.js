/** 页面加载后初始化操作 */
window.onload = function() {
    const box1 = document.querySelector('.box1');
    const box2 = document.querySelector('.box2');
    const foldIcon = document.querySelector(".foldIcon");
    const childContainer = document.querySelector(".childContainer");

    underlineFocus()

    if (box1 || box2) {
        box1.style.left = "0";
        box2.style.left = "100%"
        foldIcon.display = "none"
        childContainer.style.display = "none";
    }

    const bookNameButtons = document.querySelectorAll(".bookNameButton");
    if (bookNameButtons) {
        bookNameButtons.forEach(button => {
            const bookName = button.innerHTML;
            if (bookName) {
                button.addEventListener("click", () => childContainerSlide(bookName));
            }
        });
    }
}
 

/** 设置副框中不同书籍信息切换的滑屏效果 */
function childContainerSlide(bookName) {
    const foldIcon = document.querySelector(".foldIcon");
    const statusBarHrElement = document.querySelector(".statusBarHr")
    const mainContainer = document.querySelector(".mainContainer");
    const childContainer = document.querySelector(".childContainer");
    const box1 = document.querySelector('.box1');
    const box2 = document.querySelector('.box2');

    if (childContainer.style.display === "none") {
        foldIcon.classList.add("rotate180");
        mainContainer.classList.remove("borderRadius");
        statusBarHrElement.classList.remove("hrMove");
    }

    childContainer.style.display = "block";
    foldIcon.style.display = "block";
    mainContainer.classList.add("borderRadius");
    statusBarHrElement.classList.add("hrMove");

    const bookNameButtons = document.querySelectorAll(".bookNameButton");
    bookNameButtons.forEach(button => {
        button.disabled = true;
    });

    if (box2.style.left == "100%") {
        getBookInformation("box2", bookName);
        box2.style.left = "0";
        box1.style.left = "-100%";
        setTimeout(function() {
            childContainer.removeChild(box1);
            createBox("box1");
            bookNameButtons.forEach(button => {
                button.disabled = false;
            });
        }, 500);

    } else {
        getBookInformation(boxName="box1", bookName);
        box2.style.left = "-100%";
        box1.style.left = "0";
        setTimeout(function() {
            childContainer.removeChild(box2);
            createBox("box2");

            bookNameButtons.forEach(button => {
                button.disabled = false;
            });
        }, 500);
    }
};


/** 对副框页面生成指定书籍信息 */
function getBookInformation(boxName, bookName) {
    const iframe = document.querySelector(`.${boxName}`);
    iframe.src = `/bookStack/${bookName}/bookInformation`;
}


function createBox(boxName) {
    const childContainer = document.querySelector(".childContainer");
    let box = document.createElement("iframe");
    box.classList.add(boxName);
    box.style.left = "100%";
    childContainer.appendChild(box);

    return box;
}


/** 副框折叠图标是否生成与形状控制 */
document.querySelector(".foldIcon").addEventListener("click", function() {
    const mainContainer = document.querySelector(".mainContainer");
    const childContainer = document.querySelector(".childContainer");
    const foldIcon = document.querySelector(".foldIcon");
    const statusBarHrElement = document.querySelector(".statusBarHr")

    if (childContainer.style.display === "none") {
        childContainer.style.display = "block";
        foldIcon.classList.add("rotate180");
        mainContainer.classList.add("borderRadius");
        statusBarHrElement.classList.add("hrMove");
    } else {
        childContainer.style.display = "none";
        foldIcon.classList.remove("rotate180");
        mainContainer.classList.remove("borderRadius");
        statusBarHrElement.classList.remove("hrMove");
    }
});


/** 子状态栏下划线聚焦图标控制 */
function underlineFocus() {
    let currentUrl = window.location.href;
    if (currentUrl.includes("recentRead")) {
        indexControl(0, 1, 2)
    } else if (currentUrl.includes("exhibition")) {
        indexControl(1, 0, 2)
    } else if (currentUrl.includes("upload_file")) {
        indexControl(2, 0, 1)
    }
}
function indexControl(index1, index2, index3) {
    const childNavElement = document.querySelector(".childNav");
    const childElements = childNavElement.querySelectorAll("*");
    childElements[index1].classList.add("underlineFocus");
    childElements[index2].classList.remove("underlineFocus");
    childElements[index3].classList.remove("underlineFocus");
}
