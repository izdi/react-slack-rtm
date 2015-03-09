/** @jsx React.DOM */

var ChatArea = require('./components/ChatArea');
var React = require('react');

React.render(
    <ChatArea />,
    document.getElementById('slack-container')
);
