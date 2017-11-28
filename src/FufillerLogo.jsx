import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types'

export default class FulfillerLogo extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      imageBlob: null,
      url: `https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/${props.fulfillerId}/logo`,
      imageIsLoading: false,
      imageIsForbidden: false,
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.fulfillerId !== this.props.fulfillerId) {
      this.setState({
        imageBlob: null,
        url: `https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/${newProps.fulfillerId}/logo`
      })
    }
  }

  fetchImage (isVisible) {
    if (isVisible && !this.state.imageBlob) {
      this.setState({
        imageIsLoading: true
      });
      let headers = new Headers();
      headers.append('Authorization', `Bearer ${this.props.accessToken}`);
      headers.append('Accept', 'image/*');
      let init = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
      };
      fetch(this.url, init).then(response => {
        if (response.status === 200) {
          return response.blob();
        } else {
          throw response;
        }
      }).then(blob => {
        this.setState({imageBlob: blob});
      }).catch(err => {
          this.setState({
            imageIsForbidden: err.status === 403
          });
      }).then(() => {
        this.setState({
          imageIsLoading: false
        });
      })
    }
  }

  render () {
    let content = null;
    if (this.state.imageBlob) {
      let objectURL = URL.createObjectURL(this.state.imageBlob);
      content = <img className={this.props.className} src={objectURL}/>;
    } else if (this.state.imageIsLoading && this.props.imageLoading) {
      content = <div className={this.props.className}>{this.props.imageLoading}</div>;
    } else if (this.state.imageIsForbidden && this.props.noAccess) {
      content = <div className={this.props.className}>{this.props.noAccess}</div>;
    } else if (this.props.noImage) {
      content = <div className={this.props.className}>{this.props.noImage}</div>;
    } else if (this.props.noImage) {
      content = <div className={this.props.className}/>
    }

    return (
      <VisibilitySensor partialVisibility={true} scrollCheck={true} onChange={this.fetchImage.bind(this)}>
        {content}
      </VisibilitySensor>
    );
  }
}

FulfillerLogo.propTypes = {
  fulfillerId: PropTypes.string.required,
  accessToken: PropTypes.string.required,
  noImage: PropTypes.object,
  imageLoading: PropTypes.object,
  noAccess: PropTypes.object
}