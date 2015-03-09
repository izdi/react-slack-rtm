/** @jsx React.DOM */

var React = require('react');

var ChatArea = React.createClass({
    wsInit: function (event) {
        var xhr = new XMLHttpRequest(),
            slackToken = document.getElementById('slack-container').getAttribute('data-st'),
            clickedBtn = event.target,
            url,
            self = this;
        clickedBtn.innerText = 'Loading...';
        xhr.onreadystatechange = function () {
            if (xhr.status == 200 && xhr.readyState == 4) {
                clickedBtn.innerText = 'Loaded';
                self.setState({
                   connectedToSlack: true
                });
                url = JSON.parse(xhr.responseText).url;
                self.wsCon(url);
            }
        };
        xhr.open('GET', 'https://slack.com/api/rtm.start?token=' + slackToken, true);
        xhr.send();
    },

    wsCon: function (url) {
        var ws = new WebSocket(url);
        ws.onopen = function (data) {
            console.log(data)
        };
        ws.onmessage = function (evt) {
            console.log(evt);
        }
    },

    getInitialState: function () {
        return {connectedToSlack: false}
    },

    render: function () {
        var chatArea = {
            display: this.state.connectedToSlack ? 'block': 'none'
        };

        return (
            <div className='chat-wrapper'>
                <button onClick={this.wsInit} ref='btnCon'>Connect</button>
                <textarea rows='7' cols='50' style={chatArea}></textarea>
            </div>
        )
    }
});

module.exports = ChatArea;
