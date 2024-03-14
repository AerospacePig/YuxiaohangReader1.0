setInterval(function() {
    if (!document.querySelector(".NoRead")) {
        updateTimeInterval();
    }
}, 1000);


/** 更新书籍的时间信息 */
function updateTimeInterval() {
    const recentTime = document.querySelector(".recentTime").innerText;
    const backendTime = new Date(recentTime);
    const currentTime = new Date();
    const timeDifference = currentTime - backendTime;
    document.querySelector(".timeDifference").innerHTML = formatTime(timeDifference);

    const totalReadTimeElement = document.querySelector(".totalReadTime");
    const totalReadTimeStat = totalReadTimeElement.getAttribute("totalReadTime")
    totalReadTimeElement.innerHTML = formatTimeNoDay(totalReadTimeStat);
}


/** 构造时间函数的格式 */
function formatTime(timeDifference) {
    let seconds = Math.floor(timeDifference / 1000);

    let day = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds % 86400) / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    seconds = seconds % 60;
    let formattedTime =padZero(day) + "天" + padZero(hours) + "时" + padZero(minutes) + "分" + padZero(seconds) + "秒";
    return formattedTime;
}
// 定义去除"天"的时间构造函数
function formatTimeNoDay(timeDifference) {
    const formattedTime = formatTime(timeDifference);
    return formattedTime.split("天")[1];
}
// 定义补"零"的函数
function padZero(number) {
    return (number < 10 ? "0" : "") + number;
}


/** 控制新书在information页面的显示信息 */
const readProgressElement = document.querySelector(".readProgress");
const readProgress = readProgressElement.innerText
if (readProgress === "0%") {
    const continueReadElement = document.querySelector(".continueRead");
    const recentRecordBlock = document.querySelector(".recentRecord");
    continueReadElement.style.display = "none";
    recentRecordBlock.style.display = "none";

    const NoReadText = "<p>并未阅读过此书</p>";
    readProgressElement.insertAdjacentHTML("afterend", NoReadText);
}
