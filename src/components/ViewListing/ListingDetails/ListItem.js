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

class ListItem extends React.Component {
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
    let count, firstArray, restArray, dotString = false;
    let itemListData = itemList && itemList.length > 0 ? itemList.filter(o => o.listsettings.isEnable == "1") : [];
    
    listItemCount ? count = listItemCount : count = 6;

    if (itemListData) {
      firstArray = itemListData.slice(0, count);
      restArray = itemListData.slice(count, itemListData.length);
    }
    if (restArray && restArray.length > 0) {
      dotString = true;
    }

    return (
      <Col xs={12} sm={12} md={12} lg={12} className={cx(s.horizontalLineThrough)}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space1)}>
            <p className={cx(s.textMutedNew, s.titleResizeFont)}> {label} </p>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className={cx(s.spaceTop1)}>
            <Row>
              <Col md={12} lg={12}>
                {
                  firstArray.map((item, key) => {
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
                <Collapse className={s.collapseContainer} in={open}>
                  <div>
                    {
                      restArray && restArray.length > 0 && restArray.map((item, key) => {
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
                      {details && details}
                    </p> 
                  </div>
                </Collapse>
                {
                  (dotString || details) && <div className={s.showHideMargin}>
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

export default injectIntl(withStyles(s)(ListItem));