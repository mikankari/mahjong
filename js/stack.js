(function() {
  var hai, stack, unique, _, _i, _j, _len;

  unique = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "tton", "tnan", "tsha", "tpei", "thaku", "thatu", "tchun"];

  stack = [];

  for (_i = 0, _len = unique.length; _i < _len; _i++) {
    hai = unique[_i];
    for (_ = _j = 0; _j <= 3; _ = ++_j) {
      stack.push(hai);
    }
  }

  window.stack = stack;

}).call(this);
