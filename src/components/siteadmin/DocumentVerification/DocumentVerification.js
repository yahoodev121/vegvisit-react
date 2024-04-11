import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table, Tr, Td } from 'reactable';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { graphql, gql, compose } from 'react-apollo';

import {
  Modal
} from 'react-bootstrap';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DocumentVerification.css';

import DocumentManagement from './DocumentManagementQuery.graphql';

// Send Email
import { sendEmail } from '../../../core/email/sendEmail';

//Document List
import FileList from './FileList';

import { documentsSignedUrlExpiration } from '../../../config';


const query = gql`
query showAllDocument
{
  showAllDocument {
    id,
    email,
     profile{
          firstName
    }
    document{      
       fileName
        fileType
        documentStatus
    }
    verification{
      isIdVerification
    }
  }
}
`;


class DocumentVerification extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.state = {
        showModal: false,
        url: null
    };
  }

  handleCloseModal() {
    this.setState({ showModal: false, url: null });
  }

  handleShowModal(filePath) {
    this.setState({ showModal: true, url: filePath });
  }

  async handleUpdate(e, id, status, item) {

    if (e.target.value == '') {
      toastr.warning('Select Approve/Reject', "You have to select either one option Approve/Reject");
      return false;
    }
    else {
      const { mutate } = this.props;
      const { data } = await mutate({
        variables: {
          userId: id,
          isIdVerification: status
        },
        refetchQueries: [{ query }]
      });

      if (data.DocumentManagement.status === 'success') {
        let msg = 'ID has been ';
        msg += (status) ? 'Approved!' : 'Rejected!' ;
        let content = {
          name: item.profile.firstName,
          verificationStatus: (status) ? 'approved' : 'rejected'
        }
        toastr.success("Success!", msg);
        if (content.verificationStatus === 'approved') {
          await sendEmail(item.email, 'documentVerification', content);
        } else if (content.verificationStatus === 'rejected') {
          await sendEmail(item.email, 'documentVerificationreject', content);
        }
      } else {
        toastr.success("Error!", "Something went wrong!");
      }
    }


  }


  render() {
    const { dataList, intl, title } = this.props;

    return (
      <div className={cx(s.pagecontentWrapper)}>
        <div className={s.contentBox}>
          <h1 className={s.headerTitle}>{title}</h1>
          <div className={'table-responsive'}>
            <Table className="table"
              noDataText="No matching records found."
            >
              {
                dataList && dataList.map((value, key) => {
                  let idStatus = "";
                  if (value.verification.isIdVerification == '1') {
                    idStatus = "1";
                  } 
                  if (value.verification.isIdVerification == '0') {
                    idStatus = "0";
                  } 
                  
                  return (
                    <Tr key={key}>
                      <Td column={"S.No"} data={key + 1} />
                      <Td column={"Owner Name"} data={value.profile.firstName} />
                      <Td column={"Owner Email"} data={value.email} />

                      <Td column="Requested Files">
                        <FileList key={'f' + key} data={value.document} handler={this.handleShowModal} />
                      </Td>

                      <Td column="Action">
                        <select
                          name="isIdVerification"
                          className={cx(s.formControlSelect, s.userVerticalAlign, s.btnMarginBottom)}
                          onChange={(e) => this.handleUpdate(e, value.id, !value.verification.isIdVerification, value)}
                          value={idStatus}
                        >
                          <option value="">Select</option>
                          <option value="1">Approve</option>
                          <option value="0">Reject</option>
                        </select>
                      </Td>
                    </Tr>
                  )
                })
              }
            </Table>
          </div>
        </div>
        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>ID Verification File</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                Please click the link below to open the file. The link will become invalid after {documentsSignedUrlExpiration} minutes.
              </div>
              <a href={this.state.url} target="_blank">Open the file</a>
            </Modal.Body>
        </Modal>
      </div>
    );
  }

}

const mapState = (state) => ({
});

const mapDispatch = {

};

export default compose(
  withStyles(s),
  connect(mapState, mapDispatch),
  graphql(DocumentManagement, { options: { fetchPolicy: 'network-only' } })
)(DocumentVerification);


