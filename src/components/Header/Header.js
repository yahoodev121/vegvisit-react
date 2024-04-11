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

class Header extends React.Component {
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
      '/whyVegvisits'
    ]
  }

  constructor(props) {
    super(props);
    this.state = {
      searchHide: true,
      load: false,
      smallDevice: false,
    };
    this.handleMenu = this.handleMenu.bind(this);
    this.handleDisableSearchPages = this.handleDisableSearchPages.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillUnmount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize(e) {
    let isBrowser = typeof window !== 'undefined';
    let smallDevice = isBrowser ? window.matchMedia('(max-width: 991px)').matches : false;
    this.setState({ smallDevice });
  }

  componentDidMount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  
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
    const { searchDisablePages, searchType } = this.props;
    let location = history.location ? history.location.pathname : null;
    if(location === '/s' && searchType === 'retreats') return;
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
    const { siteSettings, borderLess, showMenu, toggleOpen, searchType } = this.props;
    const { searchHide, load, smallDevice } = this.state;
    let borderClass;
    let location;
    if(borderLess){
      borderClass = s.rentAllHeaderBorderLess;
    }
    
    if (history.location) {
      location = history.location.pathname;
    }

    return (
      <div className={cx({ ['headerNewDesign']: location === '/whyhost' || (location === '/s' && searchType === 'retreats')})} >
        <div className={s.root}>
          <Toaster />
          <LoadingBar />
          <div className={s.container}>
            <Navbar fluid className={cx(s.rentAllHeader, 'rentAllHeader', borderClass, { [s.fixedHeader]: location === '/s' }, { ['homeHeader']: location === '/' || location === '/home' || location === '/whyhost'}, { ['headerNewDesign']: location === '/whyhost'})}
              expanded={showMenu} onToggle={this.handleMenu}>
              <Navbar.Header>
                <Navbar.Brand className={cx('hidden-xs')}>
                  <Logo link={"/"} className={cx(s.brand, s.brandImg)} searchType={searchType}/>
                </Navbar.Brand>
                <Navbar.Toggle className={s.navBarToggle} children={
                  <span>
                    <Logo link={null} className={cx(s.brand, s.brandImgToggle)} searchType={searchType}/>
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
                  !searchHide && <span>
                    <Navbar.Form pullLeft className={('hidden-xs', s.breakPoint)}>
                      <HeaderLocationSearch />
                    </Navbar.Form>
                    <Navbar.Form pullLeft className={(s.currencySwitcherNavBar)}>
                      <CurrencySwitcher header={'header'}/>
                    </Navbar.Form>
                  </span>
                }
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

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Header)));
