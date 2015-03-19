/** @jsx React.DOM */

'use strict';

// responsible for message rendering

var React = require('react');

var TextArea = React.createClass({
    sendData: function () {
        var text = document.getElementById('text');

        var data = {
            type: 'message',
            channel: 'C03VB3CFG',
            text: text.value
        };

        text.value = '';

        this.props.slackSocket.send(JSON.stringify(data));

    },

    currentUserMessages: function () {

    },

    render: function () {
        var latestMessage = this.props.currentChan.latest, latestUserAvatar, latestUserName;

        this.props.users.map(function (user) {
            if (latestMessage.user == user.id) {
                latestUserAvatar = user.avatar;
                latestUserName = user.name;
            }
        });

        var chatArea = {
            display: this.props.connected ? 'block': 'none'
        };

        return (
            <div className='chat-pane' style={chatArea}>
                <article data-chanid={this.props.currentChan.id}>{this.props.currentChan.name}</article>
                <div className='messages'>
                    <ChannelMessage
                        latestUserAvatar={latestUserAvatar}
                        latestUserName={latestUserName}
                        latestMessage={latestMessage.text}
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
        return <p><img src={this.props.latestUserAvatar}/><span>{this.props.latestUserName}:</span> {this.props.latestMessage}</p>
    }

});

module.exports = TextArea;