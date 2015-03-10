/** @jsx React.DOM */

// main components chat rendering

var React = require('react');
var ws = require('../actions/ws');
var TextArea = require('./ChatTextArea');

var ChatArea = React.createClass({
    slackConnect: function (evt) {
        ws.wsInit(this.slackConnected, evt.target);
    },

    slackConnected: function (el) {
        el.innerText = 'Connected';
        this.setState({
           connectedToSlack: true
        });
    },

    getInitialState: function () {
        return {connectedToSlack: false}
    },

    render: function () {
        return (
            <div className='chat-wrapper'>
                <button onClick={this.slackConnect}>Connect</button>
                <TextArea connected={this.state.connectedToSlack}/>
            </div>
        )
    }
});

module.exports = ChatArea;
