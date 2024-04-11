import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Slider from 'react-slick';
import s from './Quotes.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Carousel,
} from 'react-bootstrap';

//local
import one from './image.jpg';


// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../locale/messages';

class Quotes extends React.Component {




  render() {

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 7000,

      responsive: [

        {
          breakpoint: 480,
          settings: {
            dots: false,
          }
        }
      ]
    };


    return (
      <Grid fluid>
        <div className={s.quotes}>
          <h1 className={s.sectionTitle}>Testimonials and Reviews</h1>
          <div className={s.displayTable}>
            <div className={s.displayRow}>
              <div className={cx(s.displayTableCell, s.bg, 'quotesSlider')}>
                <Slider {...settings}>
                  <div className={s.noOutline}>
                    <div className={s.contentHeight}>
                      <p className={s.contentOne}>
                        “… Leonie put me in touch with another vegan friend of hers who took me to the (Athens Vegan Life) festival, and later an awesome bar with an ex-pat/musician/vegan crowd. I had such an amazing time, and would highly recommend her place to other travelers!”
                      </p>
                      <p className={s.contentTwo}>Hart, USA (Vegvisits guest)</p>
                    </div>
                  </div>
                  <div  className={s.noOutline}>
                    <div className={s.contentHeight}>
                      <p className={s.contentOne}>
                        “We can't say enough good things about our stay with Fernando, it was wonderful from start to finish…Our vegan meals were DELICIOUS. We looked forward to every meal and often wrote down what he made because we were <b>inspired to make it ourselves back home</b>. And we loved that we got to take yoga classes with him in his yoga studio he built on-site, he is really a wonderful yoga teacher, so we would highly recommend choosing to visit if you love yoga!”
                      </p>
                      <p className={s.contentTwo}>Elisa, USA(Vegvisits guest)</p>
                    </div>
                  </div>
                  <div className={s.noOutline}>
                    <div className={s.contentHeight}>
                      <p className={s.contentOne}>
                        “I’m very grateful for finding Arjuna’s yoga centre on this website. It’s quiet remote location, however the village and train to Lisbon is easily accessible. I’ve been well looked after, Arjuna is a great host, chef, yoga teacher and a dog lover. His two dogs Josh and Teo will shower you with cuddles. The whole farm is very peaceful and full of fruit trees and vegetables. The view of sunrise and sunset is incredible.
                        <b>Go to Arjuna’s farm just a bit happy and your happiness will triple</b>”
                      </p>
                      <p className={s.contentTwo}>Denisa, Portugal (Vegvisits guest)</p>
                    </div>
                  </div>
                  <div className={s.noOutline}>
                    <div className={s.contentHeight}>
                      <p className={s.contentOne}>
                        “Zoe was so friendly and welcoming, <b>it felt like we were staying with family</b>. We were celebrating a birthday during the weekend and Zoe made a beautiful cake for us and made the day so special. She also cooked us delicious vegan food for dinner both nights, couldn't have wished for more!”
                      </p>
                      <p className={s.contentTwo}>Diane, France (Vegvisits guest)</p>
                    </div>
                  </div>
                  <div className={s.noOutline}>
                    <div className={s.contentHeight}>
                      <p className={s.contentOne}>
                        “Enya took me to <b>the lake nearby for the swim</b> and we <b>cooked an awesome whole food plant based</b> meal together using a lot of her homegrown vegetables! She can tell you a lot about animal rights activism and share some tips for vegan food in the city. Thank you Enya, I hope all your dreams come true and we’ll see each other again!”
                      </p>
                      <p className={s.contentTwo}>Johanna, Germany (Vegvisits guest)</p>
                    </div>
                  </div>
                  <div className={s.noOutline}>
                    <div className={s.contentHeight}>
                      <p className={s.contentOne}>
                        “<b>We had so much in common</b> and got on like a house on fire from the start and did stay up til a little late on the first night just chatting and being which was so nice.”
                      </p>
                      <p className={s.contentTwo}>Amrit, UK (Vegvisits guest)</p>
                    </div>
                  </div>
                </Slider>
              </div>
              <div className={cx(s.displayTableCell, s.whiteCss, 'hidden-xs')}></div>
              <div className={cx(s.displayTableCell, s.imageCss)} style={{ backgroundImage: `url(${one})` }}></div>
            </div>
          </div>
        </div>
      </Grid>
    );
  }
}

export default withStyles(s)(Quotes);
