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
            if (msg.type != 'hello') {
                //self.setState({
                //    messages: msg
                //});
            }

        };

        ws.onclose = function () {
            alert('Connection been lost. Trying reconnect');
            self.slackConnectHandler();
        };

        return ws
    },

    slackConnectHandler: function () {
        this.props.webSocket.init(this.slackConnectedCallback);
        this.setState({
            connText: ''
        });
    },

    slackConnectedCallback: function (data) {
        // callback at webSocket init

        var currentUser = data.self;
        var channels = this.parseChannels(data.channels);
        var users = this.parseUsers(data.users, currentUser);
        var messages = this.parseLatestMessages(users);

        this.currentSlackUser(currentUser);

        this.setState({
            connectedToSlack: true,
            channels: channels,
            users: users,
            messages: messages,
            slackSocket: this.wsHandler(data.url)
        });
    },

    parseUsers: function (users, currentUser) {
        var self = this;

        return users.map(function (user) {
            if (user.id == currentUser.id) {
                self.currentSlackUser({
                    id: user.id,
                    name: user.name,
                    avatar: user.profile.image_24
                });
            }
            return {id: user.id, name: user.name, avatar: user.profile.image_24};
        });
    },

    parseChannels: function (channels) {
        var self = this;

        return channels.map(function (channel, i) {
            if (channel.is_member) {
                if (i == 0) {
                    self.getCurrentChanLatestData(channel);
                }
                return {
                    id: channel.id,
                    name: channel.name,
                    latest: channel.latest
                };
            }
        });
    },

    parseLatestMessages: function (users) {
        var latestMessage = this.state.currentChan.latest;
        var messages = users.map(function (user) {
            if (latestMessage.user == user.id) {
                return {
                    avatar: user.avatar,
                    name: user.name,
                    text: latestMessage.text
                }
            }
        });
        return messages.filter(function (msg) {
            return msg !== undefined
        });
    },

    currentSlackUser: function (user) {
        if (this.activeUser === undefined) {
            return this.activeUser = user;
        }
        return this.activeUser;
    },

    getChannelLatest: function (id) {
        var latest;

        this.state.channels.filter(function (channel) {
            if (channel.id == id) {
                return channel.latest;
            }
        });
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

    getCurrentChanLatestData: function (channel) {
        this.setState({
            currentChan: {
                id: channel.id,
                name: '#' + channel.name,
                latest: channel.latest
            }
        });
    },

    componentDidMount: function () {
        setTimeout(this.slackConnectHandler, 1000);
    },

    getInitialState: function () {
        return {
            connectedToSlack: false,
            channels: [],
            messages: [],
            users: [],
            connText: 'Connecting...',
            currentChan: {id: '', name: '', latest: {}},
            slackSocket: {}
        }
    },

    render: function () {

        return (
            <div>
                <span>{this.state.connText}</span>
                <ChatNavPane
                    connected={this.state.connectedToSlack}
                    setCurrentChan={this.setCurrentChan}
                    channels={this.state.channels}
                />
                <TextArea
                    connected={this.state.connectedToSlack}
                    currentChan={this.state.currentChan}
                    messages={this.state.messages}
                    users={this.state.users}
                    slackSocket={this.state.slackSocket}
                    currentSlackUser={this.currentSlackUser}
                />
            </div>
        )

    }
});

module.exports = ChatArea;
