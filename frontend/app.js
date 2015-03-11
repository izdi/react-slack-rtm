/** @jsx React.DOM */

var ChatArea = require('./components/ChatArea');
var React = require('react');
var webSocket = require('./actions/ws');

React.render(
    <ChatArea webSocket={webSocket} />,
    document.getElementById('slack-container')
);
