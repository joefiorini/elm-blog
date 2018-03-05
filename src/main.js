import '@babel/polyfill';
import loadPost from './loadPost';
import localForage from 'localforage';
// TODO: Split the post loading & Elm UI integration into two separate webpack bundles
// - One that uses the Web Worker plugin and loads posts in the background
// - The other that loads the Elm app & port interop

const preloads = [
  import(/* webpackChunkName: "posts" */ '../posts/hello-world.md')
];

async function loadPosts(posts) {
  const contentsToLoad = (await Promise.all(posts)).map(p => p.default);
  console.log(contentsToLoad);
  contentsToLoad.forEach(async post => await loadPost(post));
}

loadPosts(preloads).then(() => {
  const app = Elm.Main.fullscreen();

  app.ports.requestPost.subscribe(async sha => {
    console.log(sha);
    const post = await localForage.getItem(sha);

    if (post) {
      app.ports.loadPost.send({
        title: post.metadata.title,
        date: post.metadata.date,
        content: post.content
      });
    }
  });
});
