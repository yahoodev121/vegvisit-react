import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WhyHostNew.css';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import cx from 'classnames';

// Components
import WhyHostBanner from './WhyHostBanner';
import WhyBlock from '../../components/WhyHost/WhyBlock';
import HostingBlock from '../../components/WhyHost/HostingBlock/HostingBlock';
import CoverSection from '../../components/WhyHost/CoverSection/CoverSection';
import ImageBanner from '../../components/WhyHost/ImageBanner/ImageBanner';
import PaymentContent from '../../components/WhyHost/PaymentContent/PaymentContent';
import QuoteSection from '../../components/WhyHost/QuoteSection/QuoteSection';
import CountingSection from '../../components/WhyHost/CountingSection/CountingSection';
import AboutSection from '../../components/WhyHost/AboutSection/AboutSection';
import FaqSection from '../../components/WhyHost/FaqSection/FaqSection';
import MoreSection from '../../components/WhyHost/MoreSection/MoreSection';
import OverlayImageBanner from '../../components/WhyHost/OverlayImageBanner/OverlayImageBanner';
import VideoSection from '../../components/WhyHost/VideoSection/VideoSection';

// ES6 Imports
import Scroll from 'react-scroll'; // Imports all Mixins
import { scroller } from 'react-scroll'; //Imports scroller mixin, can use as scroller.scrollTo()


let Link = Scroll.Link;
let Element = Scroll.Element;
let Events = Scroll.Events;
let scroll = Scroll.animateScroll;
let scrollSpy = Scroll.scrollSpy;

class EditProfile extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const { title } = this.props;
    return (
      <div className="whyhost-content">
       <WhyHostBanner />
       <Element name="test1" className="element">
            <WhyBlock />
         
           <HostingBlock />

           {/* <VideoSection /> */}
           
            {/* <CoverSection /> */}

           <ImageBanner />

           <PaymentContent />

           <QuoteSection />

          {/* <CountingSection /> */}

          {/* <AboutSection /> */}

          {/* <FaqSection />  */}

           {/* <MoreSection /> */}

           {/* <OverlayImageBanner /> */}
</Element>

           
      </div>
    );
  }

}


export default withStyles(s)(EditProfile);
