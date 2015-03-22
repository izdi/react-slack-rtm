/** @jsx React.DOM */

'use strict';

// responsible for message rendering

var React = require('react');

var TextArea = React.createClass({
    sendData: function (e) {
        var text = document.getElementById('text'),
            currentChan = this.props.currentChan,
            self = this;

        var slackMessage = {
            type: 'message',
            channel: currentChan,
            text: text.value
        };

        var currentUser = self.props.getCurrentSlackUser();

        // get current user & update slack message
        var messages = this.state.messages.map(function (channel) {
            if (channel.id == currentChan) {
                channel.messages.push({
                    avatar: currentUser.avatar,
                    name: currentUser.name,
                    text: text.value,
                    user: currentUser.user
                })
            }
            return channel
        });

        text.value = '';

        this.props.slackSocket.send(JSON.stringify(slackMessage));

        this.setState({messages: messages});
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            messages: nextProps.channels
        })
    },

    getInitialState: function () {
        return {messages: this.props.channels}
    },

    render: function () {

        var chatArea = {
            display: this.props.connected ? 'block': 'none'
        };

        return (
            <div className='chat-pane' style={chatArea}>
                <div className='messages-wrapper'>
                    <ChannelMessage
                        messages={this.state.messages} currentChan={this.props.currentChan}
                    />
                </div>
                <input type='text' id='text' />
                <input type='button' onClick={this.sendData} value='Send' />
            </div>
        )
    }
});

var ChannelMessage = React.createClass({

    render: function () {
        var self = this,
            channelMessages = [];

        this.props.messages.map(function (channel) {
            if (self.props.currentChan == channel.id) {
                channelMessages = channel.messages
            }
        });

        var sentMessages = function(message, i) {

            return (
                <span className='messages' key={i}>
                    <img src={message.avatar}/><span>{message.name}:</span> {message.text}
                </span>
            )
        };

        return <p>{channelMessages.map(sentMessages)}</p>
    }
});

module.exports = TextArea;