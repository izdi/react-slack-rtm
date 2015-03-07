/** @jsx React.DOM */

var ChatArea = require('./components/ChatArea');
var React = require('react');

React.renderComponent(
    <ChatArea />,
    document.getElementById('slack-container')
);
