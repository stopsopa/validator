const validator = require("../../validator");

const { Collection, All, Required, Optional, NotBlank, Length, Email, Type, IsTrue, Callback, Regex } = validator;

describe("option_require_case", () => {
  it("object string fields required", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: "string",
          },
          new Collection({
            one: new Type("str"),
          })
        );

        const tree = errors.getTree();

        expect(tree).toEqual({});

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("object string fields required but missed", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            // one: "string",
          },
          new Collection({
            one: new Type("str"),
          })
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          one: "This field is missing.",
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("object string fields optional", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: "string",
          },
          new Collection({
            one: new Optional(new Type("str")),
          })
        );

        const tree = errors.getTree();

        expect(tree).toEqual({});

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("object string fields optional but missed", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            // one: "string",
          },
          new Collection({
            one: new Optional(new Type("str")),
          })
        );

        const tree = errors.getTree();

        expect(tree).toEqual({});

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("object string fields required and deeper required case 1 - two required by implicitly", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: "string",
          },
          new Collection({
            one: new Required([
              new Type("object"),
              new Collection({
                two: new Type("string"),
              }),
            ]),
          })
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          one: "This value should be of type 'object'.",
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("object string fields required and deeper required case 2 - required implicitly", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: {},
          },
          new Required([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Required(new Type("string")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          one: {
            two: "This field is missing.",
          },
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("WRONG CASE BUT ONLY WHEN ON THE ROOT LEVEL", (done) => {
    (async function () {
      try {
        const errors = await validator(
          undefined,
          new Optional([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Required(new Type("string")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          // THIS SHOULD BE JUST EMPTY OBJECT BECAUSE IN GENERAL ENTIRE ROOT OBJECT
          // IS OPTIONAL BUT THERE IS NO WAY OF TELLING THAT BECAUSE OPTIONAL CAN BE
          // AN ONLY ELEMENT ON THE OBJECT BUT ROOT IS JUST ROOT, IT'S NOT ELEMENT ON THE OBJECT

          "": "This value should be of type 'object'.",
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("WRONG CASE BUT ONLY WHEN ON THE ROOT LEVEL - required makes no difference", (done) => {
    (async function () {
      try {
        const errors = await validator(
          undefined,
          new Required([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Required(new Type("string")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          // THIS SHOULD BE JUST EMPTY OBJECT BECAUSE IN GENERAL ENTIRE ROOT OBJECT
          // IS OPTIONAL BUT THERE IS NO WAY OF TELLING THAT BECAUSE OPTIONAL CAN BE
          // AN ONLY ELEMENT ON THE OBJECT BUT ROOT IS JUST ROOT, IT'S NOT ELEMENT ON THE OBJECT

          "": "This value should be of type 'object'.",
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("required on the second level", (done) => {
    (async function () {
      try {
        const errors = await validator(
          { one: "test" },
          new Required([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Required(new Type("string")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          // this is ok because on the second level 'one' field is required but it
          // can actually be detected because its a field on the object

          one: "This value should be of type 'object'.",
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("required on the second level case 2", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: {},
          },
          new Required([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Required(new Type("string")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          one: {
            two: "This field is missing.",
          },
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("required on the second level case 3", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: {
              two: "test",
            },
          },
          new Required([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Required(new Type("obj")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({
          one: {
            two: "This value should be of type 'obj'.",
          },
        });

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });

  it("should be object but no warning since optional and missing", (done) => {
    (async function () {
      try {
        const errors = await validator(
          {
            one: {
              // two: "test",
            },
          },
          new Required([
            new Type("object"),
            new Collection({
              one: new Required([
                new Type("object"),
                new Collection({
                  two: new Optional(new Type("obj")),
                }),
              ]),
            }),
          ])
        );

        const tree = errors.getTree();

        expect(tree).toEqual({});

        done();
      } catch (e) {
        done(`Shouldn't happen: >${e}<`);
      }
    })();
  });
});
