/** @jsx React.DOM */

var React = require('react');

var ChatArea = React.createClass({
    render: function () {
        return (
            <div className='chat-wrapper'>
                <button>Instantiate connection</button>
                <textarea className='chat-frame'></textarea>
            </div>
        )
    }
});

module.exports = ChatArea;
