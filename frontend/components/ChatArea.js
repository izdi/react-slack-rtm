/** @jsx React.DOM */

'use strict';

// main components chat rendering

var React = require('react');
var ChatNavPane = require('./ChatNavPane');


var ChatArea = React.createClass({

    wsHandler: function (url) {
        var ws = new WebSocket(url),
            self = this;

        ws.onmessage = function (evt) {
            var msg = JSON.parse(evt.data);
            if (msg.type != 'hello')
                self.setState({
                    msg: msg
                });
        };

        ws.onclose = function () {
            alert('Connection been lost. Trying reconnect')
            this.slackConnect();
        }
    },

    slackConnect: function (evt) {
        evt.target.innerText = 'Connecting...';
        this.props.webSocket.wsInit(this.slackConnected);
    },

    slackConnected: function (data) {
        var channels = data.channels.map(function (channel) {
            if (channel.is_member) {
                return {
                    id: channel.id,
                    name: channel.name
                }
            }
        });
        this.wsHandler(data.url);
        this.setState({
            connectedToSlack: true,
            msg: channels
        });
    },

    getInitialState: function () {
        return {
            connectedToSlack: false,
            ws: {},
            msg: []
        }
    },

    render: function () {
        return (
            <div className='chat-wrapper'>
                <ChatNavPane
                    connected={this.state.connectedToSlack}
                    slackConnect={this.slackConnect}
                    ws={this.state.ws}
                    msg={this.state.msg}
                />
            </div>
        )

    }
});

module.exports = ChatArea;
