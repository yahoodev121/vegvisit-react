import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListPlaceTips.css';
import {
  Grid,
  Row,
  Col } from 'react-bootstrap';

// Tips Component
import Page1Tips from './Tips/Page1Tips';
import Page5Tips from './Tips/Page5Tips';
import Page6Tips from './Tips/Page6Tips';
import DescriptionTips from './Tips/DescriptionTips';
import GuestRequirementsTips from './Tips/GuestRequirementsTips';
import HouseRulesTips from './Tips/HouseRulesTips';
import AdvanceNoticeTips from './Tips/AdvanceNoticeTips';
import MaxDaysNoticeTips from './Tips/MaxDaysNoticeTips';
import PricingTips from './Tips/PricingTips';
import AdditionalServiceTips from './Tips/AdditionalServiceTips';
class ListPlaceTips extends React.Component {
  static propTypes = {
    page: PropTypes.string
  };

  static defaultProps = {
    page: ''
  };

  render() {
    const {page} = this.props;
    return (
      <Col xs={12} sm={5} md={5} lg={5}>
         {page === "index" && <Page1Tips />}
         {page === "location" && <Page5Tips />}
         {page === "map" && <Page6Tips />}

         {page === "description" && <DescriptionTips />}
         {page === "additional-services" && <AdditionalServiceTips />}

         {page === "guest-requirements" && <GuestRequirementsTips />}
         {page === "house-rules" && <HouseRulesTips />}
         {/* {page === "advance-notice" && <AdvanceNoticeTips />} */}
         {page === "booking-window" && <MaxDaysNoticeTips />}
         {page === "pricing" && <PricingTips />}
      </Col>
    );
  }
}

export default withStyles(s)(ListPlaceTips);

