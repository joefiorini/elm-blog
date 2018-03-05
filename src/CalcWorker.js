async function run() {
  const { Calc } = await import(/* webpackChunkName: "datastore" */
  /* webpackMode: "lazy" */
  './Calc.elm');

  const worker = Calc.worker();
  // const worker = self.Elm.Calc.worker();

  self.addEventListener('message', event => {
    console.log('received data', event.data);
    worker.ports.receiveNumbers.send(event.data);
  });

  worker.ports.sendResult.subscribe(result => {
    console.log('sending result', result);
    self.postMessage(result);
  });
}

run();
