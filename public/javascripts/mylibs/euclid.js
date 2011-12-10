function bjorklund(steps, pulses) {
  var steps = parseInt(steps);
  var pulses = parseInt(pulses);

  if (pulses > steps) 
    throw "Steps must be greater than Beats.";

  var pattern = [];
  var counts = [];
  var remainders = [];
  var divisor = steps - pulses;
  remainders.push(pulses);
  var level = 0;
  var remainder_level = true;
  
  while (remainder_level) {
    counts.push(parseInt(divisor / remainders[level]));
    remainders.push(divisor % remainders[level]);
    divisor = remainders[level];
    level = level + 1;
    if (remainders[level] <= 1)
      remainder_level = false;
  }
  counts.push(divisor);

  function build(level) {
    if (level == -1)
      pattern.push(0);
    else if (level == -2)
      pattern.push(1);
    else {
      for (var i=0; i < counts[level]; i++) {
        build(level - 1);
      }
      if (remainders[level] != 0)
        build(level - 2);
    }
  }

  build(level);
  var k = pattern.indexOf(1);
  var patternSum = [];
  patternSum = pattern.slice(k).concat(pattern.slice(0,k));

  return patternSum;
}

// try {
//   var steps = parseInt(process.argv[2]);
//   var pulses = parseInt(process.argv[3]);
//   var e = [];
//   e = bjorklund(steps, pulses);
//   console.log(e);
// } 
// catch (error) {
//   console.log("usage: python bjorklund <STEPS> <PULSES>");
// }


