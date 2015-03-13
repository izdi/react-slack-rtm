/** @jsx React.DOM */

'use strict';

// responsible for navigation

var React = require('react');
var TextArea = require('./ChatTextArea');

var ChatNavPane = React.createClass({

    handleChannelClick: function (e) {
        console.log(e)
    },

    render: function () {
        var self = this;

        var navHidden = {
            display: this.props.connected ? 'block': 'none'
        };

        var renderChannels = function (chan, i) {
            return <li onClick={self.handleChannelClick} data-chanid={chan.id} key={i}>{chan.name}</li>
        };

        return (
            <div>
                <button onClick={this.props.slackConnectHandler}>{this.props.btnConText}</button>
                <div style={navHidden}>
                    <ul>{this.props.channels.map(renderChannels)}</ul>
                </div>
                <TextArea
                    connected={this.props.connected}
                    ws={this.props.ws}
                />
            </div>
        )
    }
});

module.exports = ChatNavPane;
