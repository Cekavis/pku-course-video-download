// ==UserScript==
// @name         北京大学教学网课堂实录下载
// @version      2024-09-13
// @author       Cekavis
// @match        https://onlineroomse.pku.edu.cn/*
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const interval = 100;
        const maxAttempts = 100;
        let attempts = 0;

        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (attempts++ >= maxAttempts) {
                clearInterval(timer);
                console.error('Element not found:', selector);
            }
        };

        const timer = setInterval(checkElement, interval);
    }

    function EnableDownload() {
        const downloadUrl = document.createElement('input');
        downloadUrl.type = 'text';
        downloadUrl.placeholder = '输入下载链接';
        downloadUrl.className = 'el-input__inner';

        const downloadButton = document.createElement('button');
        downloadButton.type = 'button';
        downloadButton.className = 'el-button el-button--default el-button--medium';
        downloadButton.innerText = '下载视频';
        downloadButton.onclick = () => {
            // Credit: https://leohlee.github.io/pkuVideo.html
            var inputText = downloadUrl.value;
            var mp4Pattern = /http.+\.mp4\?title=([\w\W]+)\&sub_title=([\d\-]+).*/;
            var m3u8Pattern = /https:\/\/resourcese\.pku\.edu\.cn\/play\/0\/harpocrates\/\d+\/\d+\/\d+\/([a-zA-Z0-9]+)\/\d+\/playlist\.m3u8\?title=([\w\W]+)\&sub_title=([\d\-]+).*/;

            if (mp4Pattern.test(inputText)) {
                let matches = inputText.match(mp4Pattern);
                GM_download(inputText, matches[1] + "-" + matches[2] + ".mp4");
                alert("请耐心等待后台下载完成");
            } else if (m3u8Pattern.test(inputText)) {
                let matches = inputText.match(m3u8Pattern);
                let hash = matches[1];
                GM_download('https://course.pku.edu.cn/webapps/bb-streammedia-hqy-BBLEARN/downloadVideo.action?resourceId=' + hash, matches[2] + "-" + matches[3] + ".mp4");
                alert("请耐心等待后台下载完成");
            } else {
                alert("无法识别的下载地址.");
            }
        };

        let selector = '#app > div.container > div > div > div.course-info__wrap > div.course-info__footer';
        waitForElement(selector, (ele) => {
            ele.insertBefore(downloadButton, ele.firstChild);
            ele.insertBefore(downloadUrl, ele.firstChild);
        });
    }

    window.addEventListener('load', EnableDownload);
})();