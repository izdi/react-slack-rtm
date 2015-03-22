/** @jsx React.DOM */

var ChatMainStructure = require('./components/ChatMainStructure');
var React = require('react');
var webSocket = require('./actions/webSocketSlack');

React.render(
    <ChatMainStructure webSocket={webSocket} />,
    document.getElementById('slack-container')
);
