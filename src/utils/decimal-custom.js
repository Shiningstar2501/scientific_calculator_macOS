import Decimal from 'decimal.js'

/**
 * Decimal.js is arbitrary-precision decimal library with a robust api.
 */

Decimal.prototype.percent = function percent() {
  let x = new Decimal(this)
  return x.dividedBy(100)
}

Decimal.prototype.square = function square() {
  let x = new Decimal(this)
  return x.toPower(2)
}

Decimal.prototype.cube = function cube() {
  let x = new Decimal(this)
  return x.toPower(3)
}

Decimal.prototype.tenToXPower = function tenToXPower() {
  let x = new Decimal(this)
  let y = new Decimal(10)
  return y.toPower(x)
}

Decimal.prototype.eToXPower = function eToXPower() {
  let x = new Decimal(this)
  let e = new Decimal(Math.E)
  return e.toPower(x)
}

Decimal.prototype.inverse = function inverse() {
  let x = new Decimal(this)
  let y = new Decimal(1)
  return y.dividedBy(x)
}

Decimal.prototype.factorial = function factorial() {
  let x = new Decimal(this)
  let y = new Decimal(x.minus(1))

  if (x.lessThanOrEqualTo(1)) return new Decimal(1)
  for (; y.greaterThanOrEqualTo(1); y = y.minus(1)) x = x.times(y)
  return x
}

Decimal.PI = Decimal.acos(-1)
Decimal.E = new Decimal(2.7182818284590452353602874713527)

export default Decimal
