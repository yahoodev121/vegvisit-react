import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./GiveBack.css";
import {
  Row,
  Col,
} from "react-bootstrap";

//local
import icon1 from "./icon1.png";
import icon2 from "./icon2.png";
import icon3 from "./icon3.png";

class GiveBack extends React.Component {
  render() {
    return (
      <div>
        <h1 className={s.sectionTitle}>You Travel. We Give Back.</h1>
        <div className={s.content}>
          <Row className={s.row}>
            <Col xl={4} lg={4} md={4} sm={4} xs={12}>
              <div className={s.item}>
                <div className={s.icon}>
                  <img src={icon1} alt={"icon1"} />
                </div>
                <h3 className={s.title}>Protect Biodiversity</h3>
                <p className={s.description}>
                  A single tree can be home to hundreds of species of insect, fungi, moss, mammals, and plants. Without trees, forest creatures would have nowhere to call home.
                </p>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={12}>
              <div className={s.item}>
                <div className={s.icon}>
                  <img src={icon2} alt={"icon2"} />
                </div>
                <h3 className={s.title}>Create Social Impact</h3>
                <p className={s.description}>
                  Your booking aids in community-led reforestation, which fosters femail farmer empowerment, preserves tradition and culture, and increases the quality of life for marginalized communities, working together for a common goal.
                </p>
              </div>
            </Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={12}>
              <div className={s.item}>
                <div className={s.icon}>
                  <img src={icon3} alt={"icon3"} />
                </div>
                <h3 className={s.title}>Combat Climate Change</h3>
                <p className={s.description}>
                  One roundtrip LA - New York flight produces more CO2 than the amount we can emit every year to keep our climate stable. Fortunately, a single mature tree can absorb an average of 22lbs of carbon dioxide per year, helping to off-set your flight's impact.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(GiveBack);
