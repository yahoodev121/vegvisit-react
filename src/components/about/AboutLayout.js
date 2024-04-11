import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AboutLayout.css';

import Vegvisits_20000_feet from './vegvisits_20000_feet.png';
import Vegvisits_10000_feet from './vegvisits_10000_feet.png';
import Vegvisits_basecamp from './vegvisits_basecamp.png';
import Vegvisits_village from './vegvisits_village.png';
import Vegvisits_founders from './founder.jpg';


class AboutLayout extends Component {

  render() {

    return (
      <div>

        <section className={s.containerfluid} id={s.inside_header}>
        </section>
        <section className={s.containerfluid} id={s['about_1']}>
          <div className={s.container}>
            <div className={s.row}>
              <div className={s['col-xs-12']}>
                <h1>About Us</h1>
              </div>
            </div>
            <div className={s.row}>
              <div className={s['col-xs-12']}>
                <div className={s.row}>
                  <div className={[s['col-xs-12'], s['col-sm-push-7'], s['col-sm-5']].join(' ')}>
                    <img alt="20000" src={Vegvisits_20000_feet} />
                  </div>
                  <div className={[s['col-xs-12'], s['col-sm-pull-5'], s['col-sm-7']].join(' ')}>
                    <h2>20,000 foot view</h2>
                    <p>
                      <strong>Vegvisits is a home-sharing platform for (and run by) the global community of vegans, vegetarians, and the veg-curious!</strong> The idea was born out of a practical need to accommodate this specific world of locals and travelers. But ultimately we like to think of ourselves more as a tight-knit community of friends from around the world that haven’t quite met yet!

                      </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={s.containerfluid} id={s['about_2']}>
          <div className={s.container}>
            <div className={s.row}>
              <div className={[s['col-xs-12'], s['col-sm-4']].join(' ')}>
                <img alt="10000" src={Vegvisits_10000_feet} />
              </div>
              <div className={[s['col-xs-12'], s['col-sm-8']].join(' ')}>
                <h2>10,000 foot view</h2>
                <p><strong>The Vegvisits community is made up of both travelers and local vegan and vegetarian hosts.</strong> At a basic level, there’s a real practical purpose for Vegvisits. As a traveler, you can rest assured on having access to either a vegan or vegetarian kitchen, and helpful inside knowledge from your host who shares a similar lifestyle as you — all while truly experiencing what it is like to live in another part of the world! As a host, you can keep your home just as you like it for a unique and homey feel while earning some extra income!</p>

                <p>But the real heart of the community is both hosts and travelers alike meeting people from around the world that share similar lifestyles. Everyone can also feel slightly more at ease with a fellow vegan or vegetarian, whether they’re in a new environment or opening their home to visitors, knowing <strong>they’re not all that different from you!</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={s.containerfluid} id={s['about_3']}>
          <div className={s.container}>
            <div className={s.row}>
              <div className={[s['col-xs-12'], s['col-sm-push-7'], s['col-sm-5']].join(' ')}>
                <img alt="basecamp" src={Vegvisits_basecamp} />
              </div>
              <div className={[s['col-xs-12'], s['col-sm-pull-5'], s['col-sm-7']].join(' ')}>
                <h2>Basecamp</h2>
                <p><strong>Getting started with Vegvisits is super easy!</strong> Vegan and vegetarian locals can list their homes, vacation properties, retreats, B&B’s, rooms or other space types to accommodate guests. Travelers can search for accommodations at their desired destination, and use filters created to support their lifestyle to find the perfect place, such as being served a vegan breakfast or having access to a blender.</p>

                <p>Hosts and travelers have the opportunity to read all about accommodations and each other through profiles, reviews, and detailed listings. They can also message each other through the platform to get all their questions answered before booking or confirming a trip. Payments are made securely online at time of booking, so travelers and hosts can just sit back and enjoy the experience!</p>
              </div>
            </div>
          </div>
        </section>
        <section className={s.containerfluid} id={s['about_4']}>
          <div className={s.container}>
            <div className={s.row}>
              <div className={[s['col-xs-12'], s['col-sm-4']].join(' ')}>
                <img alt="village" src={Vegvisits_village} />
              </div>
              <div className={[s['col-xs-12'], s['col-sm-8']].join(' ')}>
                <h2>The village</h2>
                <p><strong>We have a vision for this community and are working hard to make things the best they can be.</strong> But it is everyone on here, our experiences together, and the things we think, say and do that really defines who we are. Vegvisits may be an online platform, but we are not robots, and are truly excited to grow, change and evolve to whatever else we all come up with in the future! We’ll always be a community of vegans and vegetarians, but the sky is truly the limit on what more it can be!</p>
              </div>
            </div>
          </div>
        </section>

        <section className={s.containerfluid} id={s['founders']}>
          <div className={s.container}>
            <div className={s.row}>
              <div className={s['col-xs-12']}>
                <h1 className={s.textCenter}>About the founders</h1>
                <p className={s['aboutFounder']}> “Being on the road for so long, we didn’t have a clear idea of what home looked like anymore. All we knew was that we wanted to be around people who understood us, who shared a similar lifestyle, one that was becoming more important to us in daily life as we opened our eyes to new social, environmental and ethical issues.” </p>
              </div>
            </div>
            <div className={s.row}>
              <div className={[s['col-xs-12'], s['col-sm-6'], s['col-md-4'], s['col-lg-4']].join(' ')}>
                <img alt="founders" className={s['founderImage']} src={Vegvisits_founders} />
              </div>
              <div className={[s['col-xs-12'], s['col-sm-6'], s['col-md-8'], s['col-lg-8']].join(' ')}>

                <p className={s.topMobile}><strong>Hey guys, we’re Nick & Linsey Minnella!</strong> The two of us have been vegans since 2010. We’ve lived in quite a few places in the U.S. and abroad over the past few years, and came up with the vision for Vegvisits during our cross-country adventure after leaving our jobs on Wall Street. It’s been a fun ride so far creating this big family, and meeting so many of you from around the world. We’re grateful for all of your support, helping us create this amazing community, and contributing your own personal touch that all together makes us who we are!</p>
              </div>
            </div>
            </div>
        </section>  

       <section className={s.containerfluid} id="cta">
          <div className={s.container}>
            <div className={s.row}>
              <div className={[s['col-xs-12'], s.cta, s.textCenter, s.marginBottom ,s['col-sm-6'], s['col-md-4'], s['col-lg-4']].join(' ')}>
                <a href="/s" className={s.button} rel="nofollow">Find an Amazing Place to Stay</a>
              </div>
              <br/>
            </div>
          </div>
        </section>  
        

      </div>
    );
  }
}

export default withStyles(s)(AboutLayout);
