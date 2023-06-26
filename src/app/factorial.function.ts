export function factorialCalculator(num: number): number {
  let z = 0;
  let a = 0;
  for (let x = 0; x < 10000; x++) {
    for (let y = 0; y < 100; y++) {
      a+= Math.exp(y * Math.log(x/2));
    }
  }

  return z;
}
