import '@babel/polyfill';
import CalcWorker from './CalcWorker.js?worker';
import { Main } from './Main.elm';
// TODO: Split the post loading & Elm UI integration into two separate webpack bundles
// - One that uses the Web Worker plugin and loads posts in the background
// - The other that loads the Elm app & port interop

const preloads = [
  import(/* webpackChunkName: "posts" */ '../posts/hello-world.md')
];
const worker = new CalcWorker();

async function loadPosts(posts) {
  const contentsToLoad = (await Promise.all(posts)).map(p => p.default);
  console.log(contentsToLoad);
  contentsToLoad.forEach(async post => await loadPost(post));
}

// loadPosts(preloads).then(() => {
window.onload = () => {
  const app = Main.fullscreen();

  // app.ports.requestPost.subscribe(async sha => {

  //   console.log(sha);
  //   const post = await localForage.getItem(sha);

  //   if (post) {
  //     app.ports.loadPost.send({
  //       title: post.metadata.title,
  //       date: post.metadata.date,
  //       content: post.content
  //     });
  //   }
  // });

  app.ports.sendNumbers.subscribe(([num1, num2]) => {
    worker.postMessage({ num1, num2 });
  });
  worker.onmessage = event => {
    app.ports.receiveAnswer.send(event.data);
  };
};
// });
