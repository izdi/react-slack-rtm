/** @jsx React.DOM */

'use strict';

// main components chat rendering

var React = require('react');
var ChatNavPane = require('./ChatNavPane');
var TextArea = require('./ChatTextArea');


var ChatMainStructure = React.createClass({

    wsHandler: function (url) {
        var ws = new WebSocket(url),
            typesFilter = ['hello', 'presence_change', 'user_typing'],
            lastUserMessageSeen = false,
            self = this;

        ws.onmessage = function (evt) {
            var msg = JSON.parse(evt.data);
            if (typesFilter.indexOf(msg.type) == -1) {
                if (lastUserMessageSeen) {
                    console.log(msg);
                    self.setState({
                        channels: self.setNewChannelMessage(msg)
                    });
                } else {
                    lastUserMessageSeen = true;
                }
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
        // callback at webSocket.init
        var currentUser = data.self,
            teamMembers = data.users;

        var initialChannels = this.parseChannels(data.channels);
        var channelsWithMessages = this.getAllChannelsMessages(initialChannels, teamMembers,
                                                               currentUser.id);

        this.setState({
            connectedToSlack: true,
            channels: channelsWithMessages,
            teamMembers: teamMembers,
            slackSocket: this.wsHandler(data.url)
        });
    },

    parseChannels: function (channels) {
        var self = this;

        return channels.map(function (channel, i) {

            if (i == 0) {
                self.setCurrentChan(channel.id);
            }
            return {
                id: channel.id,
                name: channel.name,
                latest: channel.latest
            };
        });
    },

    setNewChannelMessage: function (slackEvent) {
        var member = this.getUsers(slackEvent.user);

        return this.state.channels.map(function (channel) {
            if (channel.id == slackEvent.channel) {
                channel.messages.push({
                    avatar: member.avatar,
                    user: slackEvent.user,
                    name: member.name,
                    text: slackEvent.text
                })
            }
            return channel
        });
    },

    getAllChannelsMessages: function (initialChannels, users, currentUser) {
        var self = this;

        return initialChannels.map(function (channel) {
            var name, avatar;

            users.map(function (user) {
                if (currentUser == user.id) {
                    self.setCurrentSlackUser({
                        user: user.id,
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

    getUsers: function (user) {
        var name, avatar;

        this.state.teamMembers.map(function (member) {
            if (member.id == user) {
                name = member.name;
                avatar = member.profile.image_24;
            }
        });

        return {name: name, avatar: avatar}
    },

    setUsers: function () {

    },

    getCurrentSlackUser: function () {
        return this.activeUser
    },

    setCurrentSlackUser: function (user) {
        this.activeUser = user;
    },

    setCurrentChan: function (channel) {
        this.setState({
            currentChan: channel
        });
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

        var chatState = {
            display: this.state.connectedToSlack ? 'block': 'none'
        };

        return (
            <div id='slack-react-main' style={chatState}>
                <ChatNavPane
                    channels={this.state.channels}
                    getSingleChannelMessages={this.getSingleChannelMessages}

                />
                <TextArea
                    channels={this.state.channels}
                    slackSocket={this.state.slackSocket}
                    getCurrentSlackUser={this.getCurrentSlackUser}
                    currentChan={this.state.currentChan}
                />
            </div>
        )

    }
});

module.exports = ChatMainStructure;
