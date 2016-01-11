'use strict';

// The MIT License (MIT)
//
// Copyright (c) 2015 Jonathan Brachthäuser
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function assure(pred) {
  return function (req, res, next) {
    handle(pred(req, res), req, res, next);
  }
}

// fail and succeed can be overriden for customization
assure.fail = function (req, res, next) {
  res.status(401).json({ message: 'unauthorized' });
}

assure.succeed = function (req, res, next) {
  next();
}

assure.either = function() {
  var args = [].slice.apply(arguments);

  return function (req, res, next) {
    var allowed = args.reduce(function (acc, pred) {
      return acc || pred(req, res);
    }, false);

    handle(allowed, req, res, next);
  }
}

function handle(pred, req, res, next) {
  if (pred) {
    assure.succeed(req, res, next);
  } else {
    assure.fail(req, res, next);
  }
}

module.exports = assure
