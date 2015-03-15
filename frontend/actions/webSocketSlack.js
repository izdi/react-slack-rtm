'use strict';

exports.init = function wsInit(callback) {
    var xhr = new XMLHttpRequest(),
        slackToken = document.getElementById('slack-container').getAttribute('data-st');

    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            var response = JSON.parse(xhr.responseText);
            if (response.ok) {
                callback.apply(null, [JSON.parse(xhr.responseText)])
            } else {
                alert(response.error);
            }
        }
    };

    xhr.open('GET', 'https://slack.com/api/rtm.start?token=' + slackToken, true);
    xhr.send();
};