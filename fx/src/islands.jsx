// Lets React components wrap parts of a page that was built without React.
// The existing DOM node is moved (not re-created) into the React tree, so its
// event listeners and the page's own scripts keep working.
import { useLayoutEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

function Adopt({ node }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    ref.current.appendChild(node);
  }, [node]);
  return <div ref={ref} style={{ display: 'contents' }} />;
}

// Replace `node` in place with wrap(<the node>), e.g. wrapInPlace(card, (c) => <AnimatedContent>{c}</AnimatedContent>).
export function wrapInPlace(node, wrap) {
  const host = document.createElement('div');
  host.style.display = 'contents';
  node.replaceWith(host);
  const root = createRoot(host);
  flushSync(() => root.render(wrap(<Adopt node={node} />)));
  return root;
}

// Replace `node` with a React element entirely (the node is used only as a placeholder).
export function replaceWith(node, element) {
  const host = document.createElement('div');
  host.style.display = 'contents';
  node.replaceWith(host);
  const root = createRoot(host);
  flushSync(() => root.render(element));
  return root;
}
