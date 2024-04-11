import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
} from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './WhyVegvisits.css';
import { FormattedMessage } from 'react-intl';

// Locale
import imageOne from './673963.jpg';
import imageTwo from './channey-vocTComP2lE-unsplash_Fotor.jpg';
import imageThree from './three.jpg'
import imageFour from './one.jpg';
import imageFive from './2136292.jpg';
import imageSix from './seven.jpg'

import messages from '../../locale/messages';


// History
import history from '../../core/history';


class WhyVegvisits extends Component {

  handleClick() {
    history.push('/become-a-host?mode=new');
  }

  render() {


    return (

      <Grid className={s.containerWidth}>
        <div className={s.whyVegvisits}>
          <div className={s.sectionOne}>
            <h1><FormattedMessage {...messages.WhyVegVisitsTitle} /></h1>
            <p><FormattedMessage {...messages.WhyVegVisitsTitleDesc} /></p>
          </div>
          <div className={s.sectionTwo}>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <div className={s.leftSide}>
                  <div className={s.leftHeading}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderOne} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={s.leftContentOne}>
                    Sitting half-way across the world, looking 6 months down the road, you can give a nice sigh of relief as you plan your trip. You share something in common with your host. It isn't just food. It isn't just a deeper awareness.
                </div>
                  <div className={s.leftContentTwo}>
                    Technically strangers at first, but feels more like bumping into someone from your same small town or 'old neighborhood'. There’s a <span className={s.fontBold}>familiarity that jumps out</span>, and you want to talk for hours. It's like you know each other, without ever having met yet. It's a great feeling, and just an overall more comfortable and relaxing way to travel.
                </div>
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <div className={s.rightImage}>
                  <div className={s.imageCss} style={{ backgroundImage: `url(${imageOne})` }}></div>

                </div>
              </Col>
            </Row>
          </div>
          <div className={s.sectionThree}>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <div className={s.leftSide}>
                  <div className={s.leftHeading}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderTwo} /></span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={s.leftContentOne}>
                    You’ll be shown around like the new kid on the block. Farmer’s markets, hiking trails, yoga classes, meditation spots, eco-friendly shops, you name it. And you can always trust your host to know the <span className={s.fontBold}>best vegan food in the area</span> - after all, they live here!
                </div>
                  <div className={s.leftHeadingTwo}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderThree} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    Whether it’s a new lasagna recipe, a cheaper way to buy produce, or an entirely new way of eating, you can learn how <span className={s.fontBold}>another person in the world 'does vegan'</span>.
                </div>
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <div className={cx(s.rightImageTwo, s.oneMargin)}>
                  <div className={s.imageCssHeight} style={{ backgroundImage: `url(${imageTwo})` }}></div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={s.sectionFour}>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <div className={s.leftSide}>
                  <div className={cx(s.leftHeading, s.marginTop)}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderFour} /></span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={s.leftContentOne}>
                    Hosts on Vegvisits often offer other services such as private yoga instruction, personal training, massage therapy, juice cleanses, and nutrition counseling. Whether it’s a whole-foods, plant-based cooking demo, a 3-course vegan dinner, or a 90 minute yoga class each morning, these extras can really <span className={s.fontBold}>make your trip a life-changing one.</span>
                  </div>
                  <div className={s.leftHeadingTwo}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={cx(s.displayTableCell, s.displayTop)}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderFive} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    Eating out can get old. With all the oil, salt and processed foods served at restaurants, it’s nice to know that, wherever you find yourself in the world, you can use a kitchen <span className={s.fontBold}>equipped with everything you need</span> to make your favorite meals, save money and also feel your best.
                </div>
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <div className={s.rightImageTwo}>
                  <div className={s.imageCssHeight} style={{ backgroundImage: `url(${imageThree})` }}></div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={s.sectionFive}>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <div className={s.leftSide}>
                  <div className={cx(s.leftHeading)}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderSix} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    You open the fridge and there’s cut up mangos, grapes, swiss chard, sweet potatoes, fresh squeezed OJ, leftover cauliflower rice, salsa and guacamole. No need to strategically plan out breakfast, lunch and dinner to avoid awful smells and sights. And you have free reign to use utensils, plates, pots/pans, etc. -  <span className={s.fontBold}>all worry free</span> from how they were used prior to your arrival.
                </div>
                  <div className={s.leftHeadingTwo}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderSeven} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    Vegvisits hosts often serve breakfast, either for free or a little extra. You wake up to your <span className={s.fontBold}>meal conveniently waiting for you</span>, so you’re ready to get out there and seize the day (or just chill, up to you)!
                </div>
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <div className={cx(s.rightImageTwo, s.twoMargin)}>
                  <div className={cx(s.imageCss, s.imgPadding)} style={{ backgroundImage: `url(${imageFour})` }}></div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={s.sectionSix}>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <div className={s.leftSide}>
                  <div className={s.leftHeading}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderEight} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    Many of our hosts are also <span className={s.fontBold}>conscious about other non-food related products</span> they buy, to make sure they’re healthy for humans, the environment and also not tested on animals. Natural detergents, cleaners, and air fresheners are also common, but if you’re allergic to the commercial stuff, just ask to be on the safe side!
                </div>
                  <div className={s.leftHeadingTwo}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderNine} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    Hosts on Vegvisits <span className={s.fontBold}>frequently charge less</span> than they do on other platforms because they want to support our big family. You pay for the trip securely online through Vegvisits, so you’re protected and don’t have to worry about it once you get there.
                </div>
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <div className={cx(s.rightImageTwo, s.threeMargin)}>
                  <div className={cx(s.imageCss, s.imgPadding)} style={{ backgroundImage: `url(${imageFive})` }}></div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={s.sectionSeven}>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <div className={s.leftSide}>
                  <div className={s.leftHeading}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeaderTen} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>
                    In addition to detailed host profiles, reviews, and ID verification, all accommodations on Vegvisits are <span className={s.fontBold}>carefully screened and verified</span>. So it’s easy to feel comfortable with every booking you make.
                </div>
                  <div className={s.leftHeadingTwo}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={cx(s.displayTableCell, s.displayTop)}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeader11} /></span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className={s.leftContentOne}>

                    With Airbnb, your money can be used to buy a Big Mac 24 hours after check-in. When you rent from hosts on Vegvisits, you’ll be <span className={s.fontBold}>helping out others more like you</span> who are likely to support environmentally-friendly and cruelty-free businesses.
    
                </div>
                  <div className={s.leftHeadingTwo}>
                    <div className={s.displayTable}>
                      <div className={s.displayTableRow}>
                        <div className={s.displayTableCell}>
                          <span className={s.icon}>♡</span>
                        </div>
                        <div className={s.displayTableCell}>
                          <span className={s.headContent}><FormattedMessage {...messages.WhyVegVisitsHeader12} /></span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={s.leftContentOne}>
                    We're a minority group, but at times it can feel like it’s us against the world, especially if you’re the lone vegan in your circle of friends and family. It's just really cool to connect, share stories and have that first-hand experience that there are others out there... and know <span className={s.fontBold}>you’re not alone</span>.
              </div>
                  <div className={s.Buttons}>
                    <div className={s.explore}>
                      <button>
                        <a href="/s">Explore Listings</a>
                      </button>
                    </div>
                    <div className={s.listYour} onClick={this.handleClick}>
                      <button >
                        List Your Space
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <div className={cx(s.rightImageTwo, s.fourMargin)}>
                  <div className={s.imageCssTwo} style={{ backgroundImage: `url(${imageSix})` }}></div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Grid>
    );
  }
}

const mapState = state => ({
  siteName: state.siteSettings.data.siteName

});

const mapDispatch = {
};

export default withStyles(s)(connect(mapState, mapDispatch)(WhyVegvisits));
