import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import IntlGlobalProvider from '../store/IntlGlobalProvider';

import deepForceUpdate from 'react-deep-force-update';

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.any.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store: PropTypes.shape({
    subscribe: PropTypes.any.isRequired,
    dispatch: PropTypes.any.isRequired,
    getState: PropTypes.any.isRequired,
  }).isRequired,
  // Apollo Client
  client: PropTypes.object.isRequired,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      load: false
    }
  }

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  componentDidMount() {
    const store = this.props.context && this.props.context.store;
    if (store) {
      this.unsubscribe = store.subscribe(() => {
        const state = store.getState();
        const newIntl = state.intl;
        if (this.intl !== newIntl) {
          this.intl = newIntl;
          if (__DEV__) {
            // eslint-disable-next-line no-console
            //console.log('Intl changed — Force rendering');
          }
          deepForceUpdate(this);
        }
      });
    }

    this.setState({
      load: true
    })
  }

  // componentDidMount() {
  //   const store = this.props.context && this.props.context.store;
  //   if (store) {
  //     this.unsubscribe = store.subscribe(() => {
  //       const state = store.getState();
  //       const newIntl = state.intl;
  //       if (this.intl !== newIntl) {
  //         this.intl = newIntl;
  //         if (__DEV__) {
  //           // eslint-disable-next-line no-console
  //           console.log('Intl changed — Force rendering');
  //         }
  //         deepForceUpdate(this);
  //       }
  //     });
  //   }
  //   this.setState({
  //     load: true
  //   })
  // }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    const store = this.props.context && this.props.context.store;
    const state = store && store.getState();
    this.intl = (state && state.intl) || {};
    const { initialNow, locale, messages } = this.intl;
    const localeMessages = (messages && messages[locale]) || {};
    const { load } = this.state;
    if (load) {
      return (
        <IntlProvider
          initialNow={initialNow}
          locale={locale}
          messages={localeMessages}
          defaultLocale="en-US"
        >
          {Children.only(this.props.children)}
        </IntlProvider>
      );
    } else {
      return (
        <IntlProvider
          initialNow={initialNow}
          locale={locale}
          messages={localeMessages}
          defaultLocale="en-US"
        >
          <IntlGlobalProvider>
          {Children.only(this.props.children)}
          </IntlGlobalProvider>
        </IntlProvider>
      );
    }
  }

}

export default App;
