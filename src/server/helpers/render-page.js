import serialize from 'serialize-javascript';
import { generateStyleForBrand } from './brand-fonts';
import { generateInspectletScript } from './inspectlet-snippet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */

function renderInspectlet(store) {
  const { config } = store.getState();
  const wid = config.inspectlet && config.inspectlet.wid;

  if (wid) {
    return generateInspectletScript(wid);
  }

  return '';
}

export const renderPage = ({
  store,
  content,
  assets,
  brand,
  helmet: head
}) => `<!doctype html>
<html lang="en">
  <head>
    ${head.base.toString()}
    ${head.title.toString()}
    ${head.meta.toString()}
    ${generateStyleForBrand(brand)}
    ${head.link.toString()}
    <link rel="shortcut icon" href="/favicon.ico?v2" />
    <meta
      name="viewport"
      content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />

    ${
      !__DEVELOPMENT__
        ? assets.entrypoints.main.css.map(
            style =>
              `<link
          href="${style}"
          media="screen, projection"
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
        />`
          )
        : ''
    }
    ${head.style.toString()}
    ${renderInspectlet(store)}
  </head>

  <body>
    <div id="content" class="${brand.name.toLowerCase()}">${content}</div>
    ${head.script.toString()}
    <script charset="UTF-8">
      window.__data=${serialize(store.getState())};
    </script>  
    ${
      __DEVELOPMENT__
        ? '<script src="/dist/main.js" charset="UTF-8"></script>'
        : assets.entrypoints.main.js.map(
            js => `<script src="${js}" charset="UTF-8"></script/>`
          )
    }
  </body>
</html>
`;
