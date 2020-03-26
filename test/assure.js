const express = require("express");
const request = require("supertest");
const expect = require("chai").expect;

const assure = require("../index");

const condT = (req, res) => true;
const condF = (req, res) => false;

describe("assure", function() {
  it("true conjunction", function(done) {
    const app = express();
    app.get("/conjunction", assure(condT), assure(condT), function(_, res, __) {
      res.send("conjunction of true and true");
    });
    request(app)
      .get("/conjunction")
      .expect(200)
      .end(function(err, res) {
        expect(res.text).to.equal("conjunction of true and true");
        done(err);
      });
  });

  it("false conjunction", function(done) {
    const app = express();
    app.get("/conjunction", assure(condT), assure(condF), function(_, res, __) {
      res.send("conjunction of true and false");
    });
    request(app)
      .get("/conjunction")
      .expect(401)
      .end(function(err, res) {
        expect(res.text).to.equal('{"message":"unauthorized"}');
        done(err);
      });
  });

  it("true disjunction", function(done) {
    const app = express();
    app.get("/disjunction", assure.either(condT, condF), function(_, res, __) {
      res.send("disjunction of true and false");
    });
    request(app)
      .get("/disjunction")
      .expect(200)
      .end(function(err, res) {
        expect(res.text).to.equal("disjunction of true and false");
        done(err);
      });
  });

  it("false disjunction", function(done) {
    const app = express();
    app.get("/disjunction", assure.either(condF, condF), function(_, res, __) {
      res.send("disjunction of false and false");
    });
    request(app)
      .get("/disjunction")
      .expect(401)
      .end(function(err, res) {
        expect(res.text).to.equal('{"message":"unauthorized"}');
        done(err);
      });
  });

  it("custom fail handler", function(done) {
    const app = express();
    assure.fail = function() {};
    app.get("/disjunction", assure.either(condF, condF), function(_, res, __) {
      res.send("disjunction of false and false");
    });
    assure.fail = function(req, res, next) {
      res.status(403).json({ message: "forbidden" });
    };

    request(app)
      .get("/disjunction")
      .expect(403)
      .end(function(err, res) {
        expect(res.text).to.equal('{"message":"forbidden"}');
        done(err);
      });
  });
});
