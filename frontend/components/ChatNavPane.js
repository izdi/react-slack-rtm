/** @jsx React.DOM */

'use strict';

// responsible for navigation

var React = require('react');
var TextArea = require('./ChatTextArea');

var ChatNavPane = React.createClass({
    handleChannelClick: function (e) {
        var channelsParagraphs = document.querySelectorAll('.channels > p'),
            clickedBtn = e.target;

        var dropActive = function (chan) {
            if (e.target == chan) {
                return clickedBtn.className = 'active'
            }
            return chan.className = ''
        };

        Array.prototype.map.call(channelsParagraphs, dropActive);

        this.props.getSingleChannelMessages(clickedBtn.dataset.chanid);
    },

    render: function () {
        var self = this;

        var navHidden = {
            display: this.props.connected ? 'block': 'none'
        };

        var renderChannels = function (chan, i) {
            var channel = '#' + chan.name;
            if (i == 0) {
                return <p className='active' onClick={self.handleChannelClick} data-chanid={chan.id} key={i}>{channel}</p>
            }
            return <p onClick={self.handleChannelClick} data-chanid={chan.id} key={i}>{channel}</p>
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
