import Polygonscan from './plugins/polygonscan';

const polygonScan = new Polygonscan('./test/data/polygonscan/rndr.csv');
polygonScan.getReport().then((report: string[][]) => {
  let income = 0.0;
  report.forEach((line: string[]) => {
    income += parseFloat(line[4]);
    console.log(line.join());
  });
  console.log(income);
});
