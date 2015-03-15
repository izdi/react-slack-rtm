/** @jsx React.DOM */

'use strict';

// main components chat rendering

var React = require('react');
var ChatNavPane = require('./ChatNavPane');
var TextArea = require('./ChatTextArea');


var ChatArea = React.createClass({
    setCurrentChan: function (channel) {
        var chan = '#' + channel;
        return this.setState({
            currentChan: chan
        })
    },

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
        // callback at webSocket init at webSocketSlack.js
        var self = this,
            currentChan,
            channels = data.channels.map(function (channel, i) {
            if (channel.is_member) {
                if (i == 0) {
                    currentChan = '#' + channel.name;
                }
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
            currentChan: currentChan
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
        var btnState = {
            display: this.state.connectedToSlack ? 'none': 'block'
        };

        return (
            <div>
                <button onClick={this.slackConnectHandler} style={btnState}>{this.state.btnConText}</button>
                <ChatNavPane
                    btnConText={this.state.btnConText}
                    connected={this.state.connectedToSlack}
                    slackConnectHandler={this.slackConnectHandler}
                    ws={this.state.ws}
                    channels={this.state.channels}
                    setCurrentChan={this.setCurrentChan}
                />
                <TextArea
                    connected={this.state.connectedToSlack}
                    ws={this.state.ws}
                    messages={this.state.messages}
                    currentChan={this.state.currentChan}
                />
            </div>
        )

    }
});

module.exports = ChatArea;
