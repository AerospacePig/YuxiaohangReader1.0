let chapter = {}; // 定义全局变量


window.onload = function () {
    const scrollSection = document.querySelector(".scrollSection");
    const catalogSection = document.querySelector('.catalogSection');
    const backgroundSectionElement = document.querySelector(".backgroundSection");
    scrollSection.style.display = "none";
    catalogSection.style.display = "none";
    backgroundSectionElement.style.display = "none";

     getRecentRead();
     setupScrollSetting();
}


/** 获取最近阅读记忆 */
async function getRecentRead() {
    const bookName = (new URLSearchParams(window.location.search)).get("bookName");

    let response = await fetch('/bookStack/getRecentRead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8',},
        body: JSON.stringify({'bookName': bookName,})
    });

    let recentRead = await response.json();
    chapter = await requestChapter(recentRead.recentChapter);

    if (Object.keys(chapter).length > 0) {//检查对象不为空值, 记录开始阅读时间
        const startReadTime = new Date();
        chapter["startReadTime"] = startReadTime;
    }
    updateData(recentRead.recentPages);
}


/** 请求chapter相关数据 */
async function requestChapter(chapterName) {
    const bookName = (new URLSearchParams(window.location.search)).get("bookName");
    let response = await fetch('/bookStack/requestChapter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            'bookName': bookName,
            'chapterName': chapterName,
        })
    });
    chapter = await response.json();

    return chapter;
}


/** 将章节拆分为页的数组 */
function pageArray() {
    let pageArray = [];
    let start = 0;
    let eachPageWords = eachPageWordsSetting();
    let chapterContent = chapter["chapterContent"];
    while (start < chapterContent.length) {
        pageArray.push(chapterContent.substring(start, eachPageWords));
        start += eachPageWords;
        eachPageWords += eachPageWords;
    }

    return pageArray;
};


/** 翻页控制 */
async function pageTurn(turn) {
    const pagesLog = document.querySelector(".pagesLog").innerText;

    let currentPages = Number(pagesLog.split("/")[0]);
    let totalPages = Number(pagesLog.split("/")[1]);
    let currentChapterCount = Number(chapter["currentChapter"].split(" ")[1]);
    let totalChapterCount = Number(chapter["totalChapterCount"]);

    if (turn == "next") {
        currentPages += 1;

        if (currentPages > totalPages && currentChapterCount < totalChapterCount) {
            const requestChapterName = `Chapter ${currentChapterCount + 1}`;
            chapter = await requestChapter(chapterName=requestChapterName);

            await updateData(currentPages=1);
        } else {
            await updateData(currentPages);
        }
    }

    else if (turn == "previous") {
        currentPages -= 1;
        if (currentPages < 1 && currentChapterCount > 1) {
            let requestChapterName = `Chapter ${currentChapterCount - 1}`;
            chapter = await requestChapter(chapterName=requestChapterName);

            currentPages = pageArray().length;
            await updateData(currentPages);
        } else {
            await updateData(currentPages);
        }
    };
}


/** 生成超链接目录或折叠目录 */
function catalogSetting() {
    const catalogSection = document.querySelector('.catalogSection');
    catalogSection.innerHTML = "";

    for (let chapterName of chapter["chapterList"]) {
        const option = document.createElement('option');
        catalogSection.appendChild(option);
        option.innerText = chapterName;

        option.addEventListener("click", async function() {
            await requestChapter(chapterName);
            await updateData(currentPages=1);
        });
    }
    const catalogSetting = document.querySelector('.catalogSetting');
    catalogSection.style.display = "block";

    if (catalogSetting.textContent == "显示目录") {
        catalogSetting.textContent = "隐藏目录";
        catalogSection.style.display = "block";
    } else {
        catalogSetting.textContent = "显示目录";
        catalogSection.style.display = "none";
    }
}


/** 字号设置 */
function fontSizeSetting(sizeSetting) {
    const p = document.querySelector(".chapterContent");
    const computedStyle = window.getComputedStyle(p);
    let size = Number(computedStyle.getPropertyValue('font-size').split("px")[0])

    if (sizeSetting === "+") {
        if (size >= 30) {
            alert("字号已设为最大!");
            size = 30;
        } else {
            size += 1;
        }

    } else if (sizeSetting === "-") {
        if (size <= 10) {
            alert("字号已设为最小!");
            size = 10;
        } else {
            size -= 1;
        }
    }

    p.setAttribute("style", `font-size: ${size}px`);
}


/** 行高设置 */
function lineHeightSetting(setting) {
    const p = document.querySelector(".chapterContent");
    let lineHeight = Number(p.style.lineHeight);

    if (isNaN(lineHeight) || lineHeight === 0) { // 检查是否为空或NaN
        lineHeight = 1.2;
    }
    if (setting === "+") {
        if (lineHeight >= 3) {
            alert("行高已设为最大!");
            lineHeight = 3;
        } else {
            lineHeight += 0.1;
        }
    }
    else if (setting === "-") {
        if (lineHeight <= 1) {
            alert("行高已设为最小!");
            lineHeight = 1;
        } else {
            lineHeight -= 0.1;
        }
    }

    p.style.lineHeight = lineHeight;
}


/** 单页字数设置 */
function eachPageWordsSetting() {
    let eachPageWords = 1500;
    return eachPageWords;
}


/** 自动滚屏设置 */
function setupScrollSetting() {
    let intervalId; // 保存setInterval的引用

    document.querySelector(".scrollSetting").addEventListener("click", function () {
        const scrollSettingElement = document.querySelector(".scrollSetting");
        const scrollSection = document.querySelector(".scrollSection");

        if (scrollSection.style.display === "none") {
            scrollSection.style.display = "block";
            scrollSettingElement.innerText = "请选择速度";
        } else {
            scrollSection.style.display = "none";
            scrollSettingElement.innerText = "滚屏速度";
            clearInterval(intervalId); // 清除滚屏的interval
        }
    });

    function autoScroll(scrollSpeed) {
        const chapterContentElement = document.querySelector(".chapterContent");
        intervalId = setInterval(() => {
            chapterContentElement.scrollTop += scrollSpeed;
        }, 50);
    }

    const scrollSection = document.querySelector(".scrollSection");
    scrollSection.innerHTML = "";

    for (let scrollSpeed = 1; scrollSpeed <= 10; scrollSpeed += 1) {
        const optionElement = document.createElement("option");
        scrollSection.appendChild(optionElement);
        optionElement.innerText = `Speed ${scrollSpeed}`;

        optionElement.addEventListener("click", function () {
            autoScroll(scrollSpeed);
            document.querySelector(".scrollSetting").innerText = "关闭滚屏";
        });
    }
}


/** 阅读背景设置 */
document.querySelector(".backgroundSetting").addEventListener("click", function () {
    const backgroundSettingElement = document.querySelector(".backgroundSetting");
    const backgroundSectionElement = document.querySelector(".backgroundSection");
    backgroundSectionElement.innerText = "";

    if (backgroundSectionElement.style.display === "none") {
        backgroundSectionElement.style.display = "block";
        backgroundSettingElement.innerText = "关闭列表";
    } else {
        backgroundSectionElement.style.display = "none";
        backgroundSettingElement.innerText = "阅读背景";
    }

    const backgroundColors = {
        "纯白色": "aliceblue",
        "浅蓝色": "aqua",
        "淡青色": "aquamarine",
        "淡黄色1": "azure",
        "淡黄色2": "beige",
        "淡黄色3": "bisque",
    }
    for (let color in backgroundColors) {
        const optionElement = document.createElement("option");
        backgroundSectionElement.appendChild(optionElement);
        optionElement.innerText = color;

        optionElement.addEventListener("click", function () {
            const chapterContentElement = document.querySelector(".chapterContent");
            chapterContentElement.style.backgroundColor = backgroundColors[color];
        });
    }
});


/** 字体设置 */
const buttonContainer = document.querySelector(".buttonContainer");
const fontStyleSetting = buttonContainer.querySelectorAll("*")[4];
fontStyleSetting.addEventListener("click", function () {
    alert("公告:\n--字体设置--功能尚在开发中, 暂不可用!");
});


/** 阅读进度统计 */
function readProgressRecord() {
    const pagesLog = document.querySelector(".pagesLog").innerText;
    const currentPages = Number(pagesLog.split("/")[0]);
    const currentChapterCount = Number(chapter["currentChapter"].split(" ")[1]);
    const historyChapterReadWords = (currentChapterCount - 1) * chapter["eachChapterWords"];
    const currentChapterReadWords = currentPages * eachPageWordsSetting();

    const readProgress = ((
        (historyChapterReadWords + currentChapterReadWords) / chapter["totalWords"]
    ) * 100).toFixed(2) + "%";

    return readProgress;
}


/** 阅读总时长统计 */
function totalReadTimeRecord() {
    const currentTime = new Date();
    const thisReadTime = currentTime - chapter["startReadTime"];
    const totalReadTime = Number(chapter["totalReadTime"]) + thisReadTime;

    console.log(chapter["totalReadTime"], thisReadTime);

    return totalReadTime;
}


/** 更新页面数据 */
async function updateData(currentPages) {
    const bookName = chapter["bookName"];
    const chapterName = chapter["currentChapter"];

    const chapterContentElement = document.querySelector('.chapterContent');
    const pageContent = pageArray()[currentPages - 1];
    chapterContentElement.innerText = pageContent;

    document.querySelector(".bookName").innerText = bookName;
    document.querySelector(".chapterName").innerText = chapterName;

    const pagesLogElement = document.querySelector('.pagesLog');
    const totalPages = pageArray().length;
    let pagesLog = `${currentPages}/${totalPages}`;
    pagesLogElement.innerText = pagesLog;

    const readProgressElement = document.querySelector(".readProgress");
    readProgressElement.innerText = readProgressRecord();
};


/** 发送退出时的状态信息 */
document.querySelector(".exitRead").addEventListener("click", async function() {
    const pagesLog = document.querySelector(".pagesLog").innerText;
    const bookName = chapter["bookName"];
    const readProgress = readProgressRecord();
    const recentPages = Number(pagesLog.split("/")[0]);
    const totalReadTime = totalReadTimeRecord();
    const recentChapter = chapter["currentChapter"];

    let response = await fetch('/bookCase/updateRecords', {
        method: 'POST',
        redirect: 'follow',
        headers: {'Content-Type': 'application/json;charset=utf-8',},
        body: JSON.stringify({
            'bookName': bookName,
            'recentPages': recentPages,
            'readProgress': readProgress,
            "totalReadTime": totalReadTime, 
            'recentChapter': recentChapter,           
        })
    });
    if (response.redirected) {
        const redirectUrl = response.url;
        window.location.href = redirectUrl;
    };
});
