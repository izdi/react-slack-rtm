/** @jsx React.DOM */

'use strict';

// responsible for message rendering

var React = require('react');

var TextArea = React.createClass({
    sendData: function () {
        var text = document.getElementById('text'),
            channel = document.querySelector('article').dataset.chanid;

        var slackMessage = {
            type: 'message',
            channel: channel,
            text: text.value
        };

        // get current user & update slack message
        var newMessage = this.props.currentSlackUser();
        newMessage.text = slackMessage.text;

        var messages = this.props.messages.concat([newMessage]);

        text.value = '';

        this.props.slackSocket.send(JSON.stringify(slackMessage));

        this.setState({messages: messages});
    },

    render: function () {

        var chatArea = {
            display: this.props.connected ? 'block': 'none'
        };

        return (
            <div className='chat-pane' style={chatArea}>
                <div className='messages'>
                    <ChannelMessage
                        messages={this.props.channels} currentChan={this.props.currentChan}
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
                <span key={i}>
                    <img src={message.avatar}/><span>{message.name}:</span> {message.text}
                </span>
            )
        };

        return <p>{channelMessages.map(sentMessages)}</p>
    }
});

module.exports = TextArea;