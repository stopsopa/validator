'use strict';

const Context           = require('../../validator/logic/Context');

const ViolationBuilder  = require('../../validator/logic/ViolationBuilder');

it('new ViolationBuilder() - no code', async () => {

    expect.assertions(1);

    try {

        const context   = new Context();

        const violation = new ViolationBuilder('msg', context);

        violation
            .addViolation()
        ;
    }
    catch (e) {

        expect(e + '').toBe("ViolationBuilder: this.code === undefined, call ViolationBuilder->setCode(code)");
    }
});

it('new ViolationBuilder() - not integer plural', async () => {

    expect.assertions(1);

    try {

        const context   = new Context();

        const violation = new ViolationBuilder('msg', context);

        violation
            .setPlural('t')
        ;
    }
    catch (e) {

        expect(e + '').toBe("ViolationBuilder.setPlural(plural) - plural parameter should be integer in range 0-inifinty");
    }
});
