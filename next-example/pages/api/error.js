export default function error(req, res) {
  throw new Error("Throwing an error to see if it appears in the logs");
}
