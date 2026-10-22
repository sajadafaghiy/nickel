const externalProtocol = /^[a-z][a-z\d+.-]*:/i;

export function remarkObsidianLinks({ collection, base = '/' }) {
  const collectionPath = `${base.replace(/\/$/, '')}/${collection}/`.replace(/^\/?/, '/');

  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'link' || !isObsidianLink(node.url)) return;

      const [path, suffix = ''] = node.url.split(/(?=[?#])/u, 2);
      node.url = `${collectionPath}${path}/${suffix}`;
    });
  };
}

function visit(node, callback) {
  callback(node);
  node.children?.forEach((child) => visit(child, callback));
}

function isObsidianLink(url) {
  return Boolean(url) &&
    !url.startsWith('/') &&
    !url.startsWith('.') &&
    !url.startsWith('#') &&
    !externalProtocol.test(url) &&
    !url.includes('/') &&
    !url.split(/[?#]/u, 1)[0].includes('.');
}
