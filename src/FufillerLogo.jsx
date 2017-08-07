import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export default class FulfillerLogo extends React.Component {

  constructor(props) {
    super(props);
    this.url = `https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers/${props.fulfillerId}/logo`;
    this.state = {
      imageBlob: null,
    }
  }

  fetchImage(isVisible) {
    if (isVisible && !this.state.imageBlob) {
      let headers = new Headers();
      headers.append("Authorization", `Bearer ${this.props.accessToken}`);
      headers.append("Accept", "image/*");
      let init = { method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default' };
      fetch(this.url, init).then(response => {
        return response.blob();
      }).then(blob => {
        this.setState({imageBlob: blob})
      });
    }
  }

  render() {
    let content = null;
    if (this.state.imageBlob) {
      let objectURL = URL.createObjectURL(this.state.imageBlob);
      content = <img className={this.props.className} src={objectURL}/>;
    } else {
      content = <div className={this.props.className}>No image</div>;
    }

    return (
      <VisibilitySensor partialVisibility={true} scrollCheck={true} onChange={this.fetchImage.bind(this)}>
        {content}
      </VisibilitySensor>
    );
  }
}
