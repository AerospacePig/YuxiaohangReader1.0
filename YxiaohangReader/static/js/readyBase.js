/** 选择或创建存档页面的返回按钮显示时机 */
let currentUrl = window.location.href;
if (currentUrl.includes("createArchive")) {
    let backLink = document.createElement('a');
    const strong = document.createElement('strong');
    strong.innerText= '返回';
    backLink.onclick = function() {
        history.back();
    };
    const elementNav = document.getElementsByTagName("nav")[0];
    elementNav.insertBefore(backLink, elementNav.firstChild);
    backLink.appendChild(strong);
    // 通过消除主元素间接消除伪元素
    document.addEventListener("DOMContentLoaded", function() {
        const selectArchiveLink = document.querySelector(".selectArchiveLink");
        if (selectArchiveLink) {
            selectArchiveLink.classList.toggle("selectArchiveLink");
        }
    });

} else {
    document.addEventListener("DOMContentLoaded", function() {
        const createArchiveLink = document.querySelector(".createArchiveLink");
        if (createArchiveLink) {
        createArchiveLink.classList.toggle("createArchiveLink");
        }
    });
}