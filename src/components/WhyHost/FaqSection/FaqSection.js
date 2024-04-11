import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Collapsible from 'react-collapsible';
import {
  Button,
  Form,
  Grid,
  Row, FormGroup,
  Col,
  ControlLabel,
  FormControl,
  FieldGroup,
  Panel,
  Label,
  Image,
  document,
} from 'react-bootstrap';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from 'react-accessible-accordion';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './FaqSection.css';
import { FormattedMessage } from 'react-intl';
import Link from '../../Link';
// Locale
import messages from '../../../locale/messages';



class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
    siteName: PropTypes.string.isRequired
  };


  render() {
    const { refer, siteName } = this.props;
   

    return (

      <Grid className="faq-Collaps">
        <Row className={s.faqsection}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={cx(s.seperator, s.boxseperator)}></div>
            <div className={s.mainhedding}>
              <h1><FormattedMessage {...messages.faqtitle} /></h1>
              <Col xs={12} sm={6} md={6} lg={6} className={s.faqcolumn}>
              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200" trigger={<FormattedMessage {...messages.faqcollapsetitle1} />}>
              
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent1} />
                    </p>
              </Collapsible>


              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle2} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent2} />
                    </p>
              </Collapsible>


              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle3} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent3} />
                    </p>
              </Collapsible>

              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle4} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent4} />
                    </p>
              </Collapsible>
 
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} className={s.faqcolumn}>
              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle5} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent5} />
                    </p>
              </Collapsible>


              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle6} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent6} />
                    </p>
              </Collapsible>


              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle7} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent7} />
                    </p>
              </Collapsible>

              <Collapsible triggerOpenedClassName={s.questionOpen} triggerClassName={s.question} transitionTime="200"  trigger={<FormattedMessage {...messages.faqcollapsetitle8} />}>
                    <p>
                    <FormattedMessage {...messages.faqcollapseContent8} />
                    </p>
              </Collapsible>
              </Col>
            </div>
          </Col>
        </Row>



      </Grid>






    );
  }
}



const mapState = state => ({
  siteName: state.siteSettings.data.siteName

});

const mapDispatch = {
};

export default withStyles(s)(connect(mapState, mapDispatch)(SocialLogin));
