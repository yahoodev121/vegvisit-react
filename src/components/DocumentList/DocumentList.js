import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { gql, graphql, compose } from 'react-apollo';

// Redux
import { connect } from 'react-redux';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DocumentList.css';

// Component
import Loader from '../Loader';

//pdf image
import pdfIcon from './pdf_image.png';

//GraphGL
import ShowDocumentListQuery from './ShowListDocument.graphql';
import RemoveDocumentList from './RemoveDocumentList.graphql';

//toastr
import { toastr } from 'react-redux-toastr';

// Helpers
import { documentBaseUrl } from '../../helpers/cdnImages'


class DocumentList extends Component {
 
  static defaultProps = {
    data: {
      loading: true,
      showDocumentList: []
    },
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    
}

  async handleClick(id,fileName){    
    const { mutate } = this.props;

    const { data } = await mutate({
      RemoveDocumentList,
      variables: { id },
      refetchQueries: [{ query: ShowDocumentListQuery }]
    }); 


    if(data &&  data.RemoveDocumentList && data.RemoveDocumentList.status == "success"){
      const resp = await fetch('/deleteDocuments', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
        credentials: 'include',
      });
      const { status } = await resp.json();
      if (status === 'success') {
        toastr.success("Success", "ID verification removed successfully.");
      } else {
        toastr.error("Warning", "ID verification not completely deleted.");
      }
    } else {
      toastr.error("Error", "ID verification could not be deleted.");
    }
  }


  render() {
    const { data: { ShowDocumentList },  data } = this.props;
    let path = documentBaseUrl();

    return(
      <div className={cx('row', s.space2)}>
        {
          ShowDocumentList && ShowDocumentList.map((item, key) => { 

            let icon = item.fileType == 'application/pdf' ? pdfIcon : (item.url);
            return (
              <div key={key} className={cx('col-lg-4 col-md-4 col-sm-6 col-xs-12 text-center')}>
                {/* <a href={path + item.fileName} target="_blank"> */}
                <a href={item.url} target="_blank">
                  <div className={s.listPhotoCover}>
                    <div className={s.listPhotoMedia}>
                  
                      <img className={s.imgResponsive} src={icon} />
                    </div>
                  </div> 
                </a>
                
                <a href="javascript:void(0);" onClick={() => this.handleClick(item.id,item.fileName)}>
                  Remove file
                </a>
              </div>
            );
            
          })
        }
      </div>
    );
  }
}

export default compose(
  withStyles(s) ,      
  graphql(ShowDocumentListQuery, {
    options: { 
      fetchPolicy: 'network-only' 
    } 
  }),
  graphql(RemoveDocumentList, { 
    options: { 
      fetchPolicy: 'network-only'  
    } 
  }),
)(DocumentList);
  




