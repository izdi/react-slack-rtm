/** @jsx React.DOM */

var ChatArea = require('./components/ChatArea');
var React = require('react');
var webSocket = require('./actions/webSocketSlack');

React.render(
    <ChatArea webSocket={webSocket} />,
    document.getElementById('slack-container')
);
