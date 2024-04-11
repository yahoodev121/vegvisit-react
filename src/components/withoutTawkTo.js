import React from 'react';

function withoutTawkTo(WrappedComponent) {
  class WithoutTawkTo extends React.Component {
    componentDidMount() {
      this.timer = setInterval(() => {
        const id = this.timer;
        // console.log('Checking tawkto widget display, timer id is ' + id);
        if (window && window.Tawk_API && window.Tawk_API.hideWidget) {
          // console.log(`Tawkto widget is hidden: ${window.Tawk_API.isChatHidden()}`);
          window.Tawk_API.hideWidget();
          // console.log(`Tawkto widget is hidden after hideWidget() call: ${window.Tawk_API.isChatHidden()}`);
          if (id && window.Tawk_API.isChatHidden()) {
            clearInterval(id);
            // console.log('Cleared tawkto widget display timer with id ' + id);
            this.timer = null;
          }
        }
      }, 500);
    }

    componentWillUnmount() {
      if (window && window.Tawk_API && window.Tawk_API.showWidget) {
        window.Tawk_API.showWidget();
      }
      if (this.timer) {
        clearInterval(this.timer);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  WithoutTawkTo.displayName = `WithoutTawkTo(${getDisplayName(
    WrappedComponent
  )})`;
  return WithoutTawkTo;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withoutTawkTo;
