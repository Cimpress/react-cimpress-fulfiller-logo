import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

export default class FulfillerLogo extends React.Component {


  constructor (props) {
    super(props);
    this.state = {
      imageBlob: null,
      fulfillerId: props.fulfillerId,
      visible: false,
      imageIsLoading: false,
      imageIsForbidden: false,
    };
    this.defaultStyle = {
      maxWidth: "50px",
      maxHeight: "50px",
      display: "inline-block",
      objectFit: "contain",
      width: "50px",
      height: "50px",
      marginRight: "10px",
      verticalAlign: "middle"
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.fulfillerId !== this.props.fulfillerId) {
      this.setState({
        imageBlob: null,
        fulfillerId: newProps.fulfillerId,
      }, () => this.fetchImage(this.state.visible));
    }
  }

  fetchImage (isVisible) {
    this.setState({
      visible: isVisible
    });
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
      let url = `https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/${this.state.fulfillerId}/logo`;

      fetch(url, init).then(response => {
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
      });
    }
  }

  render () {
    let childContent = null;
    if (this.state.imageBlob) {
      let objectURL = URL.createObjectURL(this.state.imageBlob);
      childContent = <img style={{width: "100%", height: "auto", maxWidth: "100%"}} src={objectURL}/>;
    } else if (this.state.imageIsLoading && this.props.imageLoading) {
      childContent = this.props.imageLoading;
    } else if (this.state.imageIsForbidden && this.props.noAccess) {
      childContent = this.props.noAccess;
    } else if (this.props.noImage) {
      childContent = this.props.noImage
    }

    let content = null;

    if (this.props.className) {
      content = <div className={this.props.className}>{childContent}</div>;
    } else {
      content = <div style={this.defaultStyle}>{childContent}</div>;
    }

    return (
      <VisibilitySensor partialVisibility={true} scrollCheck={true} onChange={this.fetchImage.bind(this)}>
        {content}
      </VisibilitySensor>
    );
  }
}

FulfillerLogo.propTypes = {
  fulfillerId: PropTypes.string,
  accessToken: PropTypes.string,
  noImage: PropTypes.object,
  imageLoading: PropTypes.object,
  noAccess: PropTypes.object
};