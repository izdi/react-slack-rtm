/** @jsx React.DOM */

var ChatArea = require('./components/ChatArea');
var React = require('react');
var ws = require('./actions/ws');

React.render(
    <ChatArea ws={ws} />,
    document.getElementById('slack-container')
);
