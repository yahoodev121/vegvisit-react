import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListingDetails.css';
import {
  Row,
  Col,
  Collapse,
  Button
} from 'react-bootstrap';
import cx from 'classnames';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
import * as FontAwesome from 'react-icons/lib/fa';

class HouseRulesDetails extends React.Component {
  static propTypes = {
    itemList: PropTypes.arrayOf(PropTypes.shape({
      listsettings: PropTypes.shape({
        itemName: PropTypes.string,
        settingsType: PropTypes.shape({
          typeName: PropTypes.string
        }),
      }),
      spacesId: PropTypes.string,
    })).isRequired,
    label: PropTypes.string.isRequired,
  };

  static defaultProps = {
    itemList: [],
    showLabel: 'Show More Description',
    hideLabel: 'Hide Description'
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { itemList, label, showLabel, hideLabel, details, listItemCount } = this.props;
    const { open } = this.state;
    let count, firstArray, restArray, itemFirstArray, itemRestArray, dotString = false;
    let itemListData = itemList && itemList.length > 0 ? itemList.filter(o => o.listsettings.isEnable == "1") : [];
    let detailsCount = 100;
    listItemCount ? count = listItemCount : count = 6;

    if(itemListData.length > 0) {
      itemFirstArray = itemListData.slice(0, count);
      itemRestArray = itemListData.slice(count, itemListData.length);
    }
    else if(details && itemListData.length == 0) {
      firstArray = details.slice(0, detailsCount);
      restArray = details.slice(detailsCount, details.length);
    }

    if (itemListData && itemListData.length >= 4 && details) {
       dotString = true;
    } 
    if(itemListData.length < 4 && itemListData.length != 0 && (restArray || details)) {
        dotString = true;
    } 
    if(details && itemListData.length == 0 && restArray){
        dotString = true;
    }
  

    return (
      <Col xs={12} sm={12} md={8} lg={8} className={cx(s.horizontalLineThrough)}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space1)}>
            <p className={cx(s.textMutedNew)}> {label} </p>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1)}>
            <Row>
              <Col md={12} lg={12}>
                {
                  itemFirstArray && itemFirstArray.map((item, key) => {
                    if (item.listsettings.isEnable === "1") {
                      return (
                        <p
                          key={key}
                          className={cx(s.splitList, s.vtrTop)}
                        >
                          <span className={cx(s.text, s.overflowText)}>
                            {item.listsettings.itemName}
                          </span>
                        </p>
                      )
                    }
                  })
                }
                 {
                  !this.state.open && itemListData.length == 0 && firstArray && (firstArray.trim()).split("\n").map((item, key, array) => {
                        return (
                          <p
                            key={key}
                          >
                            <span className={cx(s.text, s.overflowText)}>
                              {item}
                            </span>
                            {key === (array.length - 1) && restArray && '...'}
                          </p>
                        )
                    })
                  }
                <Collapse className={s.collapseContainer} in={open}>
                  <div>
                    {
                      itemRestArray && itemRestArray.map((item, key) => {
                        if (item.listsettings.isEnable === "1") {
                          return (
                            
                            <p
                              key={key}
                              className={cx(s.splitList, s.vtrTop)}
                            >
                              <span className={cx(s.text, s.overflowText)}>
                                {item.listsettings.itemName}
                              </span>
                            </p>
                            
                          )
                        }
                      })
                    }
                    <p className={s.boldFont}>
                      {
                      itemListData.length == 0 && restArray && (details.trim()).split("\n").map((item, key) => {
                            return (
                              <p
                                key={key}
                              >
                                <span className={cx(s.text, s.overflowText)}>
                                  {item}
                                </span>
                              </p>
                            )
                        })
                      }
                       {details && itemListData.length != 0 && <span className={cx(s.preserveLineBreaks)}>{details}</span>}
                    </p> 
                  </div>
                </Collapse>
                {
                  dotString && <div className={s.showHideMargin}>
                    <Button
                      bsStyle="link"
                      type="button"
                      className={cx(s.btn, s.btnLink, s.btnLinkSecondary, s.toggleLink, s.showHideBtn, s.noPadding)}
                      onClick={() => this.handleClick()}
                    >
                      {this.state.open ? hideLabel : showLabel}
                      {
                        this.state.open && <FontAwesome.FaAngleUp className={s.toggleIcon} />
                      }
                      {
                        !this.state.open && <FontAwesome.FaAngleDown className={s.toggleIcon} />
                      }
                    </Button>
                  </div>
                }

              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }

}

export default injectIntl(withStyles(s)(HouseRulesDetails));