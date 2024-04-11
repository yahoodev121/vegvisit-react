
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RetreatSearchHeader.css';
import cx from 'classnames';
// Locale
import messages from '../../../locale/messages';

// Components
import Dates from '../RetreatFilters/Dates';
import Guests from '../RetreatFilters/Guests';
import Price from '../RetreatFilters/Price';
import Duration from '../RetreatFilters/Duration';
import InstantBook from '../RetreatFilters/InstantBook';
import MoreFilters from '../RetreatFilters/MoreFilters';
import ShowMap from '../RetreatFilters/ShowMap';
import CheckboxGroupFilter from '../RetreatFilters/CheckboxGroupFilter';

class RetreatSearchHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabs: {
        category: false,
        atmosphere: false,
        retreatOptions: false,
        retreatStyle: false,
        skillLevel: false,
        localInformation: false,
        language: false,
        price: false,
        duration: false,
        dates: false,
        guests: false,
        meal: false,
        roomType: false,
        instantBook: false,
        moreFilters: false,
        houseType: false,
        kitchenType: false,
        dietType: false
      },
      overlay: false,
      smallDevice: false,
      verySmallDevice: false
    };

    this.handleTabToggle = this.handleTabToggle.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillUnmount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize(e) {
    let isBrowser = typeof window !== 'undefined';
    let smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : false;
    let verySmallDevice = isBrowser ? window.matchMedia('(max-width: 480px)').matches : false;
    this.setState({ smallDevice, verySmallDevice });
  }

  handleTabToggle(currentTab, isExpand) {
    const { showForm, showResults, showFilter } = this.props;
    const { tabs, smallDevice } = this.state;

    for (let key in tabs) {
      if (key == currentTab) {
        tabs[key] = isExpand;
      } else {
        tabs[key] = false;
      }
    }

    this.setState({
      tabs,
      overlay: isExpand
    });

    if (smallDevice) {
      if (isExpand) {
        showFilter();
      } else {
        showResults();
      }
    }
  }

  render() {
    const { searchSettings, searchType } = this.props;
    const { tabs, overlay, smallDevice, verySmallDevice } = this.state;
    //const isBrowser = typeof window !== 'undefined';
    //const smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : undefined;

    return (
      <div className={s.sticky}>
        <div className={cx(s.searchHeaderContainerBox, { [s.fullResponsiveContainer]: (tabs.dates == true || tabs.guests == true || tabs.moreFilters == true) })}>
          <div className={cx(s.searchHeaderContainer, { [s.fixed]: searchType !== 'retreats' })}>
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='category'
              isExpand={tabs.category} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='atmosphere'
              isExpand={tabs.atmosphere} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='retreatOptions'
              isExpand={tabs.retreatOptions} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='retreatStyle'
              isExpand={tabs.retreatStyle} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='skillLevel'
              isExpand={tabs.skillLevel} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='localInformation'
              isExpand={tabs.localInformation} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='language'
              isExpand={tabs.language} />
            <Price
              className={cx(s.filterButtonContainer)}
              handleTabToggle={this.handleTabToggle}
              searchSettings={searchSettings}
              isExpand={tabs.price} />
            <Duration
              className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
              handleTabToggle={this.handleTabToggle}
              searchSettings={searchSettings}
              isExpand={tabs.duration} />
            <Dates
              className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
              handleTabToggle={this.handleTabToggle}
              isExpand={tabs.dates}
              smallDevice={smallDevice}
              verySmallDevice={verySmallDevice} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='meal'
              isExpand={tabs.meal} />
            <CheckboxGroupFilter
              className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
              handleTabToggle={this.handleTabToggle}
              searchFilterPropertyName='roomType'
              isExpand={tabs.roomType} />
            {/* <MoreFilters */}
            {/*   className={s.filterButtonContainer} */}
            {/*   handleTabToggle={this.handleTabToggle} */}
            {/*   isExpand={tabs.moreFilters} */}
            {/*   searchSettings={searchSettings} */}
            {/*   smallDevice={smallDevice} /> */}
            <ShowMap
              className={cx(s.filterButtonContainer, 'pull-right', 'hidden-xs', s.hideTabletSection)}
              handleTabToggle={this.handleTabToggle} />
          </div>
        </div>
        {/* {
          overlay && <div className={s.searchFilterPopoverOverlay}></div>
        } */}
      </div>
    );
  }
}

export default withStyles(s)(RetreatSearchHeader);
