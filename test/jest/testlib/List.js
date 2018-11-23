'use strict';

// https://facebook.github.io/jest/#use

const React             = require('react');

// https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.createclass
const createReactClass  = require('create-react-class');

module.exports = createReactClass({
    render: function () {
        return (
            <div
                // https://facebook.github.io/jest/docs/en/getting-started.html#using-babel
            >
                <h1 key="1">{this.props.title}</h1>
                <ul key="2">
                    {this.props.list.map((e) => {
                        return <li key={e.emoji}>{`${e.title} - ${e.emoji}`}</li>
                    })}
                </ul>
            </div>
            // React.createElement('div', null, [
            //     React.createElement('h1', {key: 1}, this.props.title),
            //     React.createElement('ul', {key: 2}, this.props.list.map((e) => {
            //         return React.createElement('li', {key: e.emoji}, `${e.title} - ${e.emoji}`)
            //     }))
            // ])
        );
    }
});