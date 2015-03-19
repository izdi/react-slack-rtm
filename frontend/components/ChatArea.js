/** @jsx React.DOM */

'use strict';

// main components chat rendering

var React = require('react');
var ChatNavPane = require('./ChatNavPane');
var TextArea = require('./ChatTextArea');


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
        this.setState({
            btnConnText: 'Connecting...'
        });
        this.props.webSocket.init(this.slackConnectedCallback);
    },

    slackConnectedCallback: function (data) {
        // callback at webSocket init
        var self = this,
            currentChanName,
            currentChanId,
            currentChanLatest,
            channels = data.channels.map(function (channel, i) {
            if (channel.is_member) {
                if (i == 0) {
                    currentChanId = channel.id;
                    currentChanName = '#' + channel.name;
                    currentChanLatest = channel.latest;
                }

                return {
                    id: channel.id,
                    name: channel.name,
                    latest: channel.latest
                };
            }
        }),
            users = data.users.map(function (user) {
                return {id: user.id, name: user.name, avatar: user.profile.image_24};
        });

        this.setState({
            connectedToSlack: true,
            channels: channels,
            users: users,
            slackSocket: this.wsHandler(data.url),
            currentChan: {
                id: currentChanId,
                name: currentChanName,
                latest: currentChanLatest
            }
        });
    },

    getChannelLatest: function (id) {
        var latest;
        
        this.state.channels.map(function (channel) {
            if (channel.id == id) {
                latest = channel.latest;
            }
        });

        return latest;
    },

    setCurrentChan: function (channel) {
        var latest = this.getChannelLatest(channel.id);
        this.setState({
            currentChan: {
                id: channel.id,
                name: channel.name,
                latest: latest
            }
        });
    },

    getCurrentChan: function () {
        return (<article data-cid={this.state.currentChan.id}>{this.state.currentChan.name}</article>)
    },

    getInitialState: function () {
        return {
            connectedToSlack: false,
            channels: [],
            messages: [],
            users: [],
            btnConnText: 'Connect',
            currentChan: {id: '', name: '', latest: {}},
            slackSocket: {}
        }
    },

    render: function () {
        var btnState = {
            display: this.state.connectedToSlack ? 'none': 'block'
        };

        return (
            <div>
                <button onClick={this.slackConnectHandler} style={btnState}>{this.state.btnConnText}</button>
                <ChatNavPane
                    connected={this.state.connectedToSlack}
                    setCurrentChan={this.setCurrentChan}
                    channels={this.state.channels}
                    slackConnectHandler={this.slackConnectHandler}
                />
                <TextArea
                    connected={this.state.connectedToSlack}
                    currentChan={this.state.currentChan}
                    messages={this.state.messages}
                    users={this.state.users}
                    slackSocket={this.state.slackSocket}
                />
            </div>
        )

    }
});

module.exports = ChatArea;
