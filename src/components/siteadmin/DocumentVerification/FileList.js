import React, { Component } from 'react';
import log from '../../../helpers/clientLog';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';

// Helpers
import { documentBaseUrl } from '../../../helpers/cdnImages'
import { toastr } from 'react-redux-toastr';


class FileList extends React.Component {

    constructor(props) {
        super(props);
        this.getTemporaryLink = this.getTemporaryLink.bind(this);
    }

    async getTemporaryLink(fileName){
        const { handler } = this.props;
        const URL = '/documentLink?fileName=' + fileName;
        const resp = await fetch(URL, {
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        try {
            const { status, url } = await resp.json();
            if (status == 200) {
                handler(url);
            } else {
                throw new Error('The document link could not be received.');
            }
        } catch (error) {
            log.error(`components.siteadmin.DocumentVerification.FileList.FileList.getTemporaryLink: Error getting temporary link from backend for file ${fileName}: ${error.message}, Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
            toastr.error('Error', 'The document link could not be received.');
        }
    }

    render(){

        const { data, handler } = this.props;
        let pdf = "PDF";
        let img = "Image";
        let path = documentBaseUrl();

        return(
            <div>
                {
                    data.map((item, index) =>{
                        let icon = item.fileType == 'application/pdf' ? pdf : (img);                                           
                        return (
                            <div key={index}>
                                {/* <a href={path + item.fileName} target="_blank">{icon} </a> */}    
                                <a href="#" onClick={() => this.getTemporaryLink(item.fileName)}>{icon}</a>                             
                            </div>
                        )                               
                   })
                }               
           </div>
        )
    }

}
export default FileList;

