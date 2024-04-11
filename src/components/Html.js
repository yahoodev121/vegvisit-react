import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import { analytics, facebookId, url } from '../config';
import { pathExists } from 'fs-extra';

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    styles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired,
    }).isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    // eslint-disable-next-line react/forbid-prop-types
    state: PropTypes.object,
    lang: PropTypes.string,
    children: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  };

  static defaultProps = {
    styles: [],
    scripts: [],
    state: null,
    lang: 'en',
  };

  render() {
    const { title, description, styles, scripts, state, lang, children, image, path } = this.props;

    return (
      <html className="no-js" lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>{title}</title>
          <meta name="description" content={description} />
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta property="og:url" content={url + path} />
          <meta property="og:type" content="website" />
          <meta property="fb:app_id" content={facebookId} />
          <meta name="twitter:card" content="photo" />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-slick/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/react-slick/slick-theme.min.css" />
          <link rel="stylesheet" href="/css/rentall-common.css" />
          <link rel="stylesheet" href="/css/min/dropzone.min.css" />
          <link rel="stylesheet" media="print" href="/css/print.css" />
          <link rel="stylesheet" type="text/css" href="/css/quill-snow.css" />
          <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
          <link rel="icon" type="image/png" href="/Favicon-Main-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0-1/css/all.css" integrity="sha256-EcGUi8tmNNttsaS+YXRx8L85zgJkdkUNahQr5mQKMUI=" crossorigin="anonymous" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff"></meta>

          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />,
          )}


        </head>
        <body>
          <div
            id="app"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: children }}
          />
          {state && (
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html:
                  `window.APP_STATE=${serialize(state, { isJSON: true })}`
              }}
            />
          )}
          {scripts.map(script => <script key={script} src={script} />)}
          <script

            dangerouslySetInnerHTML={{
              __html:
                `(function(){ var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/5d80be01c22bdd393bb63c43/default';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();`
            }}
          />
          {/* <script id="stripe-js" src="https://js.stripe.com/v3/" async></script> */}
        </body>
      </html>
    );
  }
}

export default Html;
