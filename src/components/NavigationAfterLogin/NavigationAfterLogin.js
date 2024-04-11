import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, injectIntl} from 'react-intl';
import {graphql, compose} from 'react-apollo';
// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NavigationAfterLogin.css';
import {
    Navbar,
    Nav,
    NavDropdown,
    MenuItem,
} from 'react-bootstrap';
// Internal Components
import Link from '../Link';
import NavLink from '../NavLink';
import MenuItemLink from '../MenuItemLink';
import Avatar from '../Avatar';
import Logout from '../Logout';
import Message from '../Message';
import WishListModal from '../WishListModal';
// Graphql
import UserBanStatusQuery from './getUserBanStatus.graphql';
import CheckUserStatusQuery from './getCheckUserStatus.graphql';
// Graphql to check the user status deleted or not
import UserStatusQuery from './getUserStatus.graphql';
// Locale
import messages from '../../locale/messages';
// Redux
import {connect} from 'react-redux';

import {setUserLogout} from '../../actions/logout';

class NavigationAfterLogin extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        setUserLogout: PropTypes.any,
        formatMessage: PropTypes.any,
        loginUserBanStatus: PropTypes.shape({
            loading: PropTypes.bool.isRequired,
            getUserBanStatus: PropTypes.shape({
                userBanStatus: PropTypes.number,
            }),
        }),
    };
    static defaultProps = {
        loginUserBanStatus: {
            loading: true,
            getUserBanStatus: {
                userBanStatus: 0,
            },
        },
        userDeleteStatus: {
            userLoading: true,
            getUserStatus: {
                userStatus: null,
            },
        },
        checkLoginUserExist: {
            userExistloading: true,
            getCheckUserStatus: {
                userExistStatus: null,
            },
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    showDropdown = (e)=>{
        this.setState({show: true});
    }
    hideDropdown = e => {
        this.setState({show: false});
    }

    render() {
        const {loginUserBanStatus: {loading, getUserBanStatus}, userDeleteStatus: {userLoading, getUserStatus}} = this.props;
        const {checkLoginUserExist: {userExistloading, getCheckUserStatus}, className, setUserLogout, wishListModal} = this.props;
        const {formatMessage} = this.props.intl;
        const {userData} = this.props;
        let isVerified;
        const {show} = this.state;
        if (userData) {
            isVerified = userData.profileId;
        }
        if (!userExistloading && getCheckUserStatus) {
            if (getCheckUserStatus.userExistStatus) {
                const isBrowser = typeof window !== 'undefined';
                if (isBrowser) {
                    window.location.reload();
                    setUserLogout();
                }
            }
        }
        if (!loading && getUserBanStatus) {
            if (getUserBanStatus.userBanStatus) {
                const isBrowser = typeof window !== 'undefined';
                if (isBrowser) {
                    window.location.reload();
                    setUserLogout();
                }
            }
        }
        if (!userLoading && getUserStatus) {
            if (getUserStatus.userStatus) {
                const isBrowser = typeof window !== 'undefined';
                if (isBrowser) {
                    window.location.reload();
                    setUserLogout();
                }
            }
        }
        return (
            <Nav pullRight>
                <NavLink
                    to="/"
                    className={cx('visible-xs', s.breakPointScreen)}
                >
                    <FormattedMessage {...messages.homeMenu} />
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className={cx('visible-xs', s.breakPointScreen)}
                >
                    <FormattedMessage {...messages.dashboard} />
                </NavLink>
                <li className={'hidden-xs NavigationAfterLogin-nonBreakPointScreen-2rBRz dropdown ' + (show ? 'open' : '')}
                    onMouseEnter={this.showDropdown}
                    onMouseLeave={this.hideDropdown}>
                    <a id="basic-nav-dropdown" role="button" className="dropdown-toggle" aria-haspopup="true"
                       aria-expanded="true" href="#">
                        Host
                    </a>
                    <ul role="menu" className="dropdown-menu" aria-labelledby="basic-nav-dropdown">
                        <NavLink to="/rooms">
                            <span>Manage Listings</span>
                        </NavLink>
                        <NavLink to="/become-a-host?mode=new">
                            <span>List Your Space</span>
                        </NavLink>
                        <NavLink to="/list-retreat?mode=new">
                            <span>List Your Retreat</span>
                        </NavLink>
                        <NavLink to="/reservation/current">
                            <span>Your Reservations</span>
                        </NavLink>
                        <NavLink to="/user/transaction">
                            <span>Transaction History</span>
                        </NavLink>
                    </ul>
                </li>
                <NavLink
                    // to={"/users/show/" + isVerified}
                    to={"/user/edit"}
                    className={cx('visible-xs', s.breakPointScreen)}
                >
                    <FormattedMessage {...messages.profile} />
                </NavLink>
                <NavLink
                    to="/user/payout"
                    className={cx('visible-xs', s.breakPointScreen)}
                >
                    <FormattedMessage {...messages.accountSettings} />
                </NavLink>
                <NavLink to="/wishlists">
                    <FormattedMessage {...messages.saved} />
                </NavLink>
                <NavLink to="/trips/current">
                    <FormattedMessage {...messages.trips} />
                </NavLink>
                <NavLink to="/rooms" className={cx('visible-xs', s.breakPointScreen)}>
                    <FormattedMessage {...messages.host} />
                </NavLink>
                <Message/>
                <NavLink externalLink to=" https://store.vegvisits.com">
                    <FormattedMessage {...messages.store} />
                </NavLink>
                <Logout className={cx('visible-xs', s.breakPointScreen)}/>
                <NavDropdown
                    className={cx('hidden-xs', s.nonBreakPointScreen)} eventKey={3} title={
                    <Avatar
                        isUser
                        type={'small'}
                        height={30}
                        width={30}
                        className={s.userAvatar}
                    />
                } noCaret id="basic-nav-dropdown"
                >
                    <MenuItemLink to="/dashboard">
                        <FormattedMessage {...messages.dashboard} />
                    </MenuItemLink>
                    <MenuItemLink to="/user/edit">
                        <FormattedMessage {...messages.editProfile} />
                    </MenuItemLink>
                    <MenuItemLink to="/user/payout">
                        <FormattedMessage {...messages.accountSettings} />
                    </MenuItemLink>
                    <Logout/>
                </NavDropdown>
                {
                    wishListModal && <WishListModal/>
                }
            </Nav>
        );
    }
}

const mapState = state => ({
    wishListModal: state.modalStatus.wishListModalOpen,
    userData: state.account.data,
});
const mapDispatch = {
    setUserLogout
};
export default compose(
    injectIntl,
    withStyles(s),
    graphql(UserBanStatusQuery, {
        name: 'loginUserBanStatus',
        options: {
            ssr: false,
            pollInterval: 5000,
        },
    }),
    graphql(UserStatusQuery, {
        name: 'userDeleteStatus',
        options: {
            ssr: false,
            pollInterval: 5000,
        },
    }),
    graphql(CheckUserStatusQuery, {
        name: 'checkLoginUserExist',
        options: {
            ssr: false,
            pollInterval: 5000,
        },
    }),
    (connect(mapState, mapDispatch)))(NavigationAfterLogin);
