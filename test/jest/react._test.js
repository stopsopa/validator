'use strict';

const React             = require('react');
const renderer          = require('react-test-renderer');
const List              = require('./testlib/List');
const veg               = require('./testlib/veg');


it('react test', () => {

    ['one', 'two', 'three'].forEach((title) => {

        const component = renderer.create(
            React.createElement(List, {list: veg, title: title})
        );

        expect(component).toMatchSnapshot();

    });

    // to test "testEnvironment" : "node"
    // console.log(window);

});