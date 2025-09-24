import 'package:flutter/material.dart';

customStyle(var fontSize, var color, var fontWeight) {
  var f=fontSize.toString();
  double size=double.parse(f);
  return TextStyle(
    fontSize: size,
    color: color,
    fontWeight: fontWeight,
  );
}
