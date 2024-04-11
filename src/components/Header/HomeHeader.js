// General
import React from 'react';
import PropTypes from 'prop-types';
// Redux
import { connect } from 'react-redux';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Styles
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import * as FontAwesome from 'react-icons/lib/fa'
import cx from 'classnames';
import { 
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';

// Internal Components
import Link from '../Link';
import Navigation from '../Navigation';
import LanguageSwitcher from '../LanguageSwitcher';
import Logo from '../Logo';
import HeaderLocationSearch from './HeaderLocationSearch';
import CurrencySwitcher from '../CurrencySwitcher';


// Assets
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';

// External Components
import Toaster from '../Toaster';
import LoadingBar from 'react-redux-loading-bar';

// Redux action
import { toggleOpen, toggleClose } from '../../actions/Menu/toggleControl';

import history from '../../core/history';

class HomeHeader extends React.Component {
  static propTypes = {
    borderLess : PropTypes.bool,
    showMenu: PropTypes.bool,
    toggleOpen: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
  };

  static defaultProps = {
    borderLess: false,
    showMenu: false,
    searchDisablePages: [
      '/',
      '/home',
      '/whyhost'
    ]
  }

  constructor(props) {
    super(props);
    this.state = {
      searchHide: true,
      load: false
    };
    this.handleMenu = this.handleMenu.bind(this);
    this.handleDisableSearchPages = this.handleDisableSearchPages.bind(this);
  }

  componentDidMount() {
    this.setState({
      load: true
    });
    this.handleDisableSearchPages();
  }

  componentDidUpdate(prevProps, prevState) {
    this.handleDisableSearchPages();
  }

  handleMenu() {
    const { showMenu, toggleOpen, toggleClose } = this.props;
    if(showMenu) {
      toggleClose();
    } else {
      toggleOpen();
    }
  }

  handleDisableSearchPages() {
    const { searchDisablePages } = this.props;
    let location = history.location ? history.location.pathname : null;
    let searchHide = false;
    if (location && searchDisablePages.length > 0) {
      searchHide = searchDisablePages.find((o) => location === o);
      searchHide = (searchHide) ? true : false;
    }

    if (this.state.searchHide !== searchHide) {
      this.setState({
        searchHide
      })
    }
  }

  render() {
    const { siteSettings, borderLess, showMenu, toggleOpen, layoutType } = this.props;
    const { searchHide, load } = this.state;
    let borderClass, headerDesignClass;
    let location;
    if(borderLess){
      borderClass = s.rentAllHeaderBorderLess;
    }

    if (layoutType && (layoutType == 1 || layoutType == 3)) {
      headerDesignClass = 'headerNewDesign';
    }
    
    if (history.location) {
      location = history.location.pathname;
    }

    if (!load) {
      return (
        <div className={cx(headerDesignClass)}>
        <div className={s.root} key={new Date().getTime()}>
          <Toaster />
          <LoadingBar />
          <div className={s.container}>
            <Navbar fluid className={cx(s.rentAllHeader, 'rentAllHeader', borderClass, { [s.fixedHeader]: location === '/s' }, { ['homeHeader']: location === '/' || location === '/home' || location === '/whyhost'})} 
              expanded={showMenu} onToggle={this.handleMenu}>
              <Navbar.Header>
                <Navbar.Brand className={cx('hidden-xs')}>
                  <Logo link={"/"} className={cx(s.brand, s.brandImg)} />
                </Navbar.Brand>
                <Navbar.Toggle className={s.navBarToggle} children={
                  <span>
                    <Logo link={"#"} className={cx(s.brand, s.brandImgToggle)} />
                    {
                      !showMenu && <FontAwesome.FaChevronDown />
                    }
  
                    {
                      showMenu && <FontAwesome.FaChevronUp />
                    }
                    
                  </span>
                }/>
              </Navbar.Header>
              <Navbar.Collapse className={'location'}>
                {
                  !searchHide &&
                    <Navbar.Form pullRight className={('hidden-xs', s.breakPoint)}>
                      <HeaderLocationSearch />
                    </Navbar.Form>
                }
                <Navbar.Form pullRight className={(s.currencySwitcherHomeNavBar)}>
                  <CurrencySwitcher header={'home'}/>
                </Navbar.Form>
                <Navigation />
              </Navbar.Collapse>
            </Navbar>
          </div>
        </div>
        </div>
      );
    }

    return (
      <div className={cx(headerDesignClass)}>
      <div className={s.root}>
        <Toaster />
        <LoadingBar />
        <div className={s.container}>
          <Navbar fluid className={cx(s.rentAllHeader, 'rentAllHeader', borderClass, { [s.fixedHeader]: location === '/s' }, { ['homeHeader']: location === '/' || location === '/home' || location === '/whyhost'})} 
            expanded={showMenu} onToggle={this.handleMenu}>
            <Navbar.Header>
              <Navbar.Brand className={cx('hidden-xs')}>
                <Logo link={"/"} className={cx(s.brand, s.brandImg)} />
              </Navbar.Brand>
              <Navbar.Toggle className={s.navBarToggle} children={
                <span>
                  <Logo link={"#"} className={cx(s.brand, s.brandImgToggle)} />
                  {
                    !showMenu && <FontAwesome.FaChevronDown />
                  }

                  {
                    showMenu && <FontAwesome.FaChevronUp />
                  }
                  
                </span>
              }/>
            </Navbar.Header>
            <Navbar.Collapse className={'location'}>
              {
                !searchHide && <Navbar.Form pullRight className={('hidden-xs', s.breakPoint)}>
                  <HeaderLocationSearch />
                </Navbar.Form>
              }
              <Navbar.Form pullRight className={(s.currencySwitcherHomeNavBar)}>
                <CurrencySwitcher header={'home'}/>
              </Navbar.Form>
              <Navigation />
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  siteSettings: state.siteSettings.data,
  showMenu: state.toggle.showMenu
});

const mapDispatch = {
  toggleOpen,
  toggleClose
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(HomeHeader)));
