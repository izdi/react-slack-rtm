exports.wsInit = function wsInit(callback, args) {
    var xhr = new XMLHttpRequest(),
        slackToken = document.getElementById('slack-container').getAttribute('data-st');

    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            var response = JSON.parse(xhr.responseText);
            if (response.ok) {
                wsActions(JSON.parse(xhr.responseText).url);
                callback.apply(null, [args])
            } else {
                alert(response.error);
            }
        }
    };
    xhr.open('GET', 'https://slack.com/api/rtm.start?token=' + slackToken, true);
    xhr.send();

};

function wsActions(url) {
    var ws = new WebSocket(url);

    ws.onopen = function (data) {
        console.log('WS is opened');
    };
    ws.onmessage = function (evt) {
    }
}