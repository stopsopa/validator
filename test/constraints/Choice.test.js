'use strict';

try {require("karma_polyfill")}catch(e){}

const validator     = require('../../validator');

const IsNull        = require('../../validator/constraints/IsNull');

const Choice        = require('../../validator/constraints/Choice');

const Collection    = require('../../validator/constraints/Collection');

it('Choice - error types', done => {

    var k = new Choice(['test']);

    expect(k.errorNames()).toEqual({
        NO_SUCH_CHOICE_ERROR    : Choice.prototype.NO_SUCH_CHOICE_ERROR,
        TOO_FEW_ERROR           : Choice.prototype.TOO_FEW_ERROR,
        TOO_MANY_ERROR          : Choice.prototype.TOO_MANY_ERROR,
    });

    done();
});

it('Choice - error types x2', done => {

    var k = new Choice(['test']);

    k.errorNames()

    expect(k.errorNames()).toEqual({
        NO_SUCH_CHOICE_ERROR    : Choice.prototype.NO_SUCH_CHOICE_ERROR,
        TOO_FEW_ERROR           : Choice.prototype.TOO_FEW_ERROR,
        TOO_MANY_ERROR          : Choice.prototype.TOO_MANY_ERROR,
    });

    done();
});

it('Choice - no arg', done => {

    try {

        const k = new Choice();
    }
    catch (e) {

        expect(String(e)).toBe("Choice: choices have to be non empty list");

        done();
    }
});

it('Choice - wrong arg type', done => {

    try {

        const k = new Choice(false);
    }
    catch (e) {

        expect(String(e)).toBe("Choice: choices have to be non empty list");

        done();
    }
});

it('Choice - empty list', done => {

    try {

        const k = new Choice([]);
    }
    catch (e) {

        expect(String(e)).toBe("Choice: choices have to be non empty list");

        done();
    }
});

it('Choice - no min & no max - (actually the case is empty choices)', done => {

    try {

        const k = new Choice({});
    }
    catch (e) {

        expect(String(e)).toBe("Choice: choices have to be non empty list");

        done()
    }
});

it('Choice - null', async done => {

    const errors = await validator({
        a: null
    },new Collection({
        a: new Choice(['test'])
    }));

    expect(errors.getTree(true)).toEqual({});

    done();
});

it("Choice - ''", async done => {

    const errors = await validator({
        a: ''
    }, new Collection({
        a: new Choice(['test'])
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["The value you selected is not a valid choice."]}
    );

    done();
});

it("Choice - 'f'", async done => {

    let errors;

    errors = await validator({
        a: 'f'
    },new Collection({
        a: new Choice(['test'])
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["The value you selected is not a valid choice."]}
    );

    done();
});

it("Choice - 'test'", async done => {

    let errors;

    errors = await validator({
        a: 'test'
    },new Collection({
        a: new Choice(['test'])
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice - 'test1' in [test, test1]'", async done => {

    let errors;

    errors = await validator({
        a: 'test1'
    },new Collection({
        a: new Choice(['test', 'test1'])
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice - 'test2' in [test, test1]'", async done => {

    let errors;

    errors = await validator({
        a: 'test2'
    },new Collection({
        a: new Choice(['test', 'test1'])
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["The value you selected is not a valid choice."]}
    );

    done();
});

it('Choice - null', async done => {

    const errors = await validator({
        a: null
    },new Collection({
        a: new Choice({
            choices: ['test']
        })
    }));

    expect(errors.getTree(true)).toEqual({});

    done();
});

it('Choice multiple - null', async done => {

    const errors = await validator({
        a: null
    },new Collection({
        a: new Choice({
            choices: ['test'],
            multiple: true
        })
    }));

    expect(errors.getTree(true)).toEqual({});

    done();
});

it("Choice multiple - '' - add NotBlank()", async done => {

    const errors = await validator({
        a: ''
    }, new Collection({
        a: new Choice({
            choices: ['test'],
            multiple: true
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice multiple - 'f'", async done => {

    let errors;

    errors = await validator({
        a: ['f']
    },new Collection({
        a: new Choice({
            choices: ['test'],
            multiple: true
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": {"0": ["One or more of the given values is invalid."]}}
    );

    done();
});

it("Choice multiple - 'test'", async done => {

    let errors;

    errors = await validator({
        a: ['test']
    },new Collection({
        a: new Choice({
            choices: ['test'],
            multiple: true
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice multiple 1", async done => {

    let errors;

    errors = await validator({
        a: ['test1']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1'],
            multiple: true
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice multiple 2", async done => {

    let errors;

    errors = await validator({
        a: ['test2']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1'],
            multiple: true
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": {"0": ["One or more of the given values is invalid."]}}
    );

    done();
});

it("Choice multiple 3", async done => {

    let errors;

    errors = await validator({
        a: ['test1']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1'],
            multiple: true,
            min: 1
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice multiple 4", async done => {

    let errors;

    errors = await validator({
        a: ['test1']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1'],
            multiple: true,
            min: 2
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["You must select at least 2 choices."]}
    );

    done();
});

it("Choice multiple 5", async done => {

    let errors;

    errors = await validator({
        a: ['test1']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1'],
            multiple: true,
            max: 3
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {}
    );

    done();
});

it("Choice multiple 6", async done => {

    let errors;

    errors = await validator({
        a: ['test1', 'test']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            max: 1
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["You must select at most 1 choice."]}
    );

    done();
});

it("Choice multiple 7", async done => {

    let errors;

    errors = await validator({
        a: ['test1', 'test', 'test2']
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            max: 2
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["You must select at most 2 choices."]}
    );

    done();
});

it("Choice multiple 8", async done => {

    let errors;

    errors = await validator({
        a: []
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            min: 1
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["You must select at least 1 choice."]}
    );

    done();
});

it("Choice multiple stop 1", async done => {

    let errors;

    errors = await validator({
        a: []
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            min: 1
        }),
        b: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            min: 1
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["You must select at least 1 choice."], "b": ["This field is missing."]}
    );

    done();
});

it("Choice multiple stop 2", async done => {

    let errors;

    errors = await validator({
        a: []
    },new Collection({
        a: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            min: 1
        }, {
            stop: true,
            async: -1,
        }),
        b: new Choice({
            choices: ['test', 'test1', 'test2'],
            multiple: true,
            min: 1
        })
    }));

    expect(errors.getTree(true)).toEqual(
        {"a": ["You must select at least 1 choice."]}
    );

    done();
});




