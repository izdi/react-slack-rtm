/** @jsx React.DOM */

// responsible for message rendering

var React = require('react');

var TextArea = React.createClass({
    sendData: function () {
        var channel = document.getElementById('channel'),
            text = document.getElementById('text');

        var data = {
            //id: 1,
            type: 'message',
            channel: 'C03VB3CFG',
            text: text.value
        };

        text.value = '';

        this.props.ws.send(JSON.stringify(data));

    },

    render: function () {

        var chatArea = {
            display: this.props.connected ? 'block': 'none'
        };

        return (
            <div style={chatArea}>
                <textarea rows='7' cols='50'></textarea>
                <input type='text' id='channel' />
                <input type='text' id='text' />
                <input type='button' onClick={this.sendData}/>
            </div>

        )
    }
});

module.exports = TextArea;