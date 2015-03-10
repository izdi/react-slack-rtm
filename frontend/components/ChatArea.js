/** @jsx React.DOM */

// main components chat rendering

var React = require('react');
var TextArea = require('./ChatTextArea');

var ChatArea = React.createClass({
    slackConnect: function (evt) {
        this.props.ws.wsInit(this.slackConnected, evt.target);
    },

    slackConnected: function (el, ws) {
        el.innerText = 'Connected';
        this.setState({
            connectedToSlack: true,
            ws: ws
        });
    },

    getInitialState: function () {
        return {connectedToSlack: false}
    },

    render: function () {
        return (
            <div className='chat-wrapper'>
                <button onClick={this.slackConnect}>Connect</button>
                <TextArea ws={this.state.ws} connected={this.state.connectedToSlack} />
            </div>
        )
    }
});

module.exports = ChatArea;
