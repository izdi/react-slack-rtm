/** @jsx React.DOM */

'use strict';

// responsible for navigation

var React = require('react');
var TextArea = require('./ChatTextArea');

var ChatNavPane = React.createClass({

    render: function () {

        var btnHidden = {
            display: this.props.connected ? 'none': 'block'
        };

        var navHidden = {
            display: this.props.connected ? 'block': 'none'
        };

        return (
            <div>
                <button onClick={this.props.slackConnect} style={btnHidden}>Connect</button>
                <div style={navHidden}>
                    <ul>{this.props.msg.map(function (chan) {
                            return <li key={chan.id}>{chan.name}</li>})
                        }
                    </ul>
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