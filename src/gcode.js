function roundTo(num, decimals) {
  const m = 10 * decimals;
  return Math.round((num + Number.EPSILON) * m) / m
}

export function pointsToGcode(points, feedRate) {
  let gcode = '';

  const gotoPt = (x, y, z, speed) => {
    let command = `G1 X${roundTo(x, 4)} Y${roundTo(y, 4)} Z${roundTo(z, 4)}`;

    if (speed !== undefined) {
      command += ` F${roundTo(speed, 4)}`;
    }

    command += '\n';

    return command;
  };

  gcode += 'T0 ; temperature to zero\n';
  gcode += 'M109 S0 ; set extruder temp and wait\n';
  gcode += 'G28 ; home\n';
  gcode += 'G90 ; absolute position mode\n';
  gcode += 'M82 ; absolute extrusion mode\n'; // M83 is relative

  if (points.length > 0) {
    // Move to the first point
    const fpt = points[0];
    gcode += gotoPt(fpt.x, fpt.z, fpt.y, feedRate);

    // Start the extrusion
    gcode += 'G1 E6\n';

    for (let i = 1; i < points.length; i++) {
        const pt = points[i];
        gcode += gotoPt(pt.x, pt.z, pt.y);
    }

    // Stop the extrusion
    gcode += `G1 E0 F${feedRate}\n`;
  }

  gcode += 'M84 ; disable idle hold\n';

  return gcode;
}
