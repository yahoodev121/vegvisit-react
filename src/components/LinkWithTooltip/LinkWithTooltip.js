import React from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';

class LinkWithTooltip extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    tooltip: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { id, children, href, tooltip, className } = this.props;
    return (
         <OverlayTrigger
         overlay={<Tooltip className={className} id={id}>{tooltip}</Tooltip>}
         placement="top"
         delayShow={300}
         delayHide={150}
       >
         {/* <a href={href}>{children}</a> */}
         {children}
       </OverlayTrigger>
     );
  }
}

export default LinkWithTooltip;
