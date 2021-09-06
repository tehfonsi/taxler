export default interface Report {
  getReport(): Promise<string[][]>;
}
