// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

// import history from '../../core/history';

// import { NavItem } from 'react-bootstrap';
// // Redux action
// import { toggleClose } from '../../actions/Menu/toggleControl';

// function isLeftClickEvent(event) {
//   return event.button === 0;
// }

// function isModifiedEvent(event) {
//   return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
// }

// class NavLink extends React.Component {
//   static propTypes = {
//     to: PropTypes.string.isRequired,
//     children: PropTypes.node,
//     onClick: PropTypes.any,
//     noLink: PropTypes.bool,
//     className: PropTypes.string,
//     toggleClose: PropTypes.any.isRequired,
//   };

//   handleClick = (event) => {
//     const { noLink, toggleClose } = this.props;
//     toggleClose();
//     if (this.props.onClick) {
//       this.props.onClick(event);
//     }

//     if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
//       return;
//     }

//     if (event.defaultPrevented === true) {
//       return;
//     }

//     event.preventDefault();
    
//     if(!noLink){
//       history.push(this.props.to);
//     }
//   };

//   render() {
//     const { to, children, className } = this.props;
//     return <NavItem href={to} onClick={this.handleClick} className={className}>{children}</NavItem>;
//   }
// }

// const mapState = (state) => ({});

// const mapDispatch = {
//   toggleClose
// };

// export default connect(mapState, mapDispatch)(NavLink);
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import history from '../../core/history';

import { NavItem } from 'react-bootstrap';
// Redux action
import { toggleClose } from '../../actions/Menu/toggleControl';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}


class NavLink extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node,
    onClick: PropTypes.any,
    noLink: PropTypes.bool,
    className: PropTypes.string,
    toggleClose: PropTypes.any.isRequired,
  };

  handleClick = (event) => {
    const { noLink, toggleClose } = this.props;
    toggleClose();
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();

    if (!noLink) {
      history.push(this.props.to);
    }
  };

  render() {
    const { to, children, className, externalLink, externalLinkto } = this.props;
    if (externalLink) {
      return <li role={'presentation'}><a href={to} target={'_blank'} className={className}>{children}</a></li>;
    } else if (externalLinkto) {
      return <li role={'presentation'}><a href={to} className={className}>{children}</a></li>;
    } else {
      return <NavItem href={to} onClick={this.handleClick} className={className}>{children}</NavItem>;
    }
    //  }
    //     return <NavItem href={to} onClick={this.handleClick} className={className}>{children}</NavItem>;
    //   }
  }
}

const mapState = (state) => ({});

const mapDispatch = {
  toggleClose
};

export default connect(mapState, mapDispatch)(NavLink);

