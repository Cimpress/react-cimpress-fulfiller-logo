import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

export default class  FulfillerLogo extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      imageObjectUrl: null,
      fulfillerId: props.fulfillerId,
      visible: false,
      imageIsLoading: false,
      imageIsForbidden: false,
      imageIsNotPresent: false
    };
    this.defaultStyle = {
      maxWidth: "50px",
      maxHeight: "50px",
      objectFit: "contain",
      width: "50px",
      height: "50px",
      marginRight: "10px",
      verticalAlign: "middle",
      alignContent: "center"
  };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.fulfillerId !== this.props.fulfillerId) {
      if (this.state.imageObjectUrl) {
        URL.revokeObjectURL(this.state.imageObjectUrl);
      }
      this.setState({
        imageObjectUrl: null,
        fulfillerId: newProps.fulfillerId,
        imageIsLoading: false,
        imageIsForbidden: false,
        imageIsNotPresent: false
      }, () => this.fetchImage(this.state.visible));
    }
  }

  componentWillUnmount() {
    if (this.state.imageObjectUrl) {
      URL.revokeObjectURL(this.state.imageObjectUrl);
    }
  }

  shouldRetryLoading() {
    return !(this.state.imageIsForbidden || this.state.imageIsNotPresent);
  }

  fetchImage (isVisible) {
    this.setState({
      visible: isVisible
    });
    if (isVisible && !this.state.imageObjectUrl && this.shouldRetryLoading()) {
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
      let cacheSuffix = nulll
      if (this.props.accessToken) {
        try {
          cacheSuffix = JSON.parse(atob(this.props.accessToken.split('.')[1])).sub;
        } catch (err) {
          console.log("Unable to extract sub from the token");
        }
      }
      let url = `https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/${this.state.fulfillerId}/logo`;
      if (cacheSuffix) {
        url += `?user=${cacheSuffix}`;
      }
      fetch(url, init).then(response => {
        if (response.status === 200) {
          return response.blob();
        } else {
          throw response;
        }
      }).then(blob => {
        this.setState({imageObjectUrl: URL.createObjectURL(blob)})
      }).catch(err => {
        console.log(`Unable to fetch image for ${this.state.fulfillerId}, return status ${err.status}`);
        this.setState({
          imageIsForbidden: err.status === 403,
          imageIsNotPresent: err.status === 404
        });
      }).then(() => {
        this.setState({
          imageIsLoading: false
        });
      });
    }
  }

  render () {
    let childContent = this.props.placeholder;
    if (this.state.imageObjectUrl) {
      childContent = <img style={{maxWidth:"inherit", maxHeight:"inherit"}} src={this.state.imageObjectUrl}/>;
    } else if (this.state.imageIsLoading) {
      childContent = this.props.imageLoading || this.props.placeholder;
    } else if (this.state.imageIsForbidden) {
      childContent = this.props.noAccess || this.props.noImage || this.props.placeholder;
    } else if (this.props.noImage) {
      childContent = this.props.noImage || this.props.placeholder
    }

    let content = null;

    if (!childContent) {
      childContent = <span/>
    }

    if (this.props.className) {
      content = <div className={this.props.className}>{childContent}</div>;
    } else {
      content = <div style={this.defaultStyle}>{childContent}</div>;
    }

    return (
      <VisibilitySensor partialVisibility={true} scrollDelay={1000} scrollCheck={true} onChange={this.fetchImage.bind(this)}>
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
  noAccess: PropTypes.object,
  placeholder: PropTypes.object
};