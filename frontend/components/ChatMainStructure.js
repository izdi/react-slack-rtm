/** @jsx React.DOM */

'use strict';

// main components chat rendering

var React = require('react');
var ChatNavPane = require('./ChatNavPane');
var TextArea = require('./ChatTextArea');


var ChatMainStructure = React.createClass({

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
    },

    slackConnectedCallback: function (data) {
        // callback at webSocket init

        var currentUser = data.self;
        var self = this;
        var initialChannels = this.parseChannels(data.channels);
        var channelsWithMessages = this.getAllChannelsMessages(initialChannels, data.users, currentUser.id);

        this.setState({
            connectedToSlack: true,
            channels: channelsWithMessages,
            slackSocket: this.wsHandler(data.url)
        });
    },

    parseChannels: function (channels) {
        var self = this;

        return channels.map(function (channel, i) {
            if (channel.is_member) {
                if (i == 0) {
                    self.setCurrentChan(channel);
                }
                return {
                    id: channel.id,
                    name: channel.name,
                    latest: channel.latest
                };
            }
        });
    },

    getAllChannelsMessages: function (initialChannels, users, currentUser) {
        var self = this;

        return initialChannels.map(function (channel) {
            var name, avatar;

            users.map(function (user) {
                if (currentUser == user.id) {
                    self.setCurrentSlackUser({
                        id: user.id,
                        name: user.name,
                        avatar: user.profile.image_24
                    });
                }
                if (channel.latest.user == user.id) {
                    name = user.name;
                    avatar = user.profile.image_24;
                }
            });

            return {
                id: channel.id,
                name: channel.name,
                messages : [
                    {
                        text: channel.latest.text,
                        user: channel.latest.user,
                        name: name,
                        avatar: avatar
                    }
                ]
            }
        });
    },

    setCurrentSlackUser: function (user) {
        this.activeUser = user;
    },

    setCurrentChan: function (channel) {
        this.setState({
            currentChan: channel.id
        })
    },

    getSingleChannelMessages: function (channel) {
        this.setCurrentChan(channel);
    },

    componentDidMount: function () {
        this.slackConnectHandler();
    },

    getInitialState: function () {
        return {
            connectedToSlack: false,
            channels: [],
            slackSocket: {},
            currentChan: ''
        }
    },

    render: function () {

        return (
            <div>
                <ChatNavPane
                    connected={this.state.connectedToSlack}
                    channels={this.state.channels}
                    getSingleChannelMessages={this.getSingleChannelMessages}
                />
                <TextArea
                    connected={this.state.connectedToSlack}
                    channels={this.state.channels}
                    slackSocket={this.state.slackSocket}
                    currentSlackUser={this.currentSlackUser}
                    currentChan={this.state.currentChan}
                />
            </div>
        )

    }
});

module.exports = ChatMainStructure;
