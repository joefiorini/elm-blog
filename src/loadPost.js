import localForage from 'localForage';

localForage.setDriver(localForage.INDEXEDDB);

export default function loadPost(post) {
  console.log(post);
  return localForage.setItem(post.sha, post);
}
