/** @jsx React.DOM */

'use strict';

// responsible for navigation

var React = require('react');
var TextArea = require('./ChatTextArea');

var ChatNavPane = React.createClass({

    handleChannelClick: function (e) {
        this.props.setCurrentChan(e.target.innerText);
    },

    render: function () {
        var self = this;

        var navHidden = {
            display: this.props.connected ? 'block': 'none'
        };

        var renderChannels = function (chan, i) {
            if (i == 0) {
                return <p className='active' onClick={self.handleChannelClick} data-chanid={chan.id} key={i}>&#35; {chan.name}</p>
            }
            return <p onClick={self.handleChannelClick} data-chanid={chan.id} key={i}>&#35; {chan.name}</p>
        };

        return (
            <div className='nav-pane' style={navHidden}>
                <div className='channels'>
                    {this.props.channels.map(renderChannels)}
                </div>
            </div>
        )
    }
});

module.exports = ChatNavPane;
