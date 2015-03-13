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
                    messages: msg
                });
        };

        ws.onclose = function () {
            alert('Connection been lost. Trying reconnect');
            self.slackConnectHandler();
        };

        return ws
    },

    slackConnectHandler: function () {
        if (this.state.ws instanceof WebSocket)
            this.state.ws.close();
        this.setState({
            btnConText: 'Connecting...'
        });
        this.props.webSocket.init(this.slackConnected);
    },

    slackConnected: function (data) {
        // called witihn ajax call at the moment of instantiating connection with slack
        var channels = data.channels.map(function (channel) {
            if (channel.is_member) {
                return {
                    id: channel.id,
                    name: channel.name
                }
            }
        });
        this.setState({
            connectedToSlack: true,
            channels: channels,
            ws: this.wsHandler(data.url),
            btnConText: 'Disconnect'
        });
    },

    getInitialState: function () {
        return {
            connectedToSlack: false,
            ws: {},
            channels: [],
            messages: [],
            btnConText: 'Connect'
        }
    },

    render: function () {
        return (
            <div className='chat-wrapper'>
                <ChatNavPane
                    btnConText={this.state.btnConText}
                    connected={this.state.connectedToSlack}
                    slackConnectHandler={this.slackConnectHandler}
                    ws={this.state.ws}
                    channels={this.state.channels}
                    messages={this.state.messages}
                />
            </div>
        )

    }
});

module.exports = ChatArea;
