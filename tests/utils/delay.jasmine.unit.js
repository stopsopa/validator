"use strict";



const delay = require("../../validator/utils/delay");

const time = () => new Date().getTime();

it("delay()", (done) => {
  const start = time();

  delay(40, "resolved").then(
    (data) => {
      expect(time() - start).toBeGreaterThan(30);

      expect(data).toBe("resolved");

      done();
    },
    (e) => done({ e })
  );
});

it("delay()", (done) => {
  const start = time();

  delay(undefined, "resolved").then(
    (data) => {
      expect(time() - start).toBeLessThan(5);

      expect(data).toBe("resolved");

      done();
    },
    (e) => done({ e })
  );
});

it("delay.reject()", (done) => {
  const start = time();

  delay.reject(40, "rejected").catch(
    (e) => {
      expect(time() - start).toBeGreaterThan(30);

      expect(e).toBe("rejected");

      done();
    },
    (e) => done({ e })
  );
});

it("delay.reject()", (done) => {
  const start = time();

  delay.reject(undefined, "rejected").catch(
    (e) => {
      expect(time() - start).toBeLessThan(5);

      expect(e).toBe("rejected");

      done();
    },
    (e) => done({ e })
  );
});

it("delay.then() - resolved", (done) => {
  const start = time();

  Promise.resolve("resolved")
    .then(...delay.then(40))
    .then(
      (data) => {
        expect(time() - start).toBeGreaterThan(30);

        expect(data).toBe("resolved");

        done();
      },
      (e) => done({ e })
    );
});

it("delay.then() - rejected", (done) => {
  const start = time();

  Promise.reject("rejected")
    .then(...delay.then(40))
    .catch(
      (e) => {
        expect(time() - start).toBeGreaterThan(30);

        expect(e).toBe("rejected");

        done();
      },
      (e) => done({ e })
    );
});
