/** @jsx React.DOM */

// responsible for message rendering

var React = require('react');

var TextArea = React.createClass({

    render: function () {
        var chatArea = {
            display: this.props.connected ? 'block': 'none'
        };

        return (
            <textarea rows='7' cols='50' style={chatArea}></textarea>
        )
    }
});

module.exports = TextArea;