# react-cimpress-fulfiller-logo

This repository stores a react compontent that anyone can use to conveniently place a fullfiller logo in their react application.

## Usage

Install the npm package

`npm install react-cimpress-fulfiller-logo --save`

import the component

`import FulfillerLogo from 'react-cimpress-fulfiller-logo'`

and then use wherever needed

`<FulfillerLogo fulfillerId="fulfillerId" accessToken={localStorage.getItem('accessToken')}/>`

Component uses sane defaults, which can be overridden.

### To override styles

In order to override styles provide `className`

    `<FulfillerLogo className="fulfillerLogos" fulfillerId="fulfillerId" accessToken={localStorage.getItem('accessToken')}/>`

### To override default loading behaviour

In order to override loading behaviour provide `imageLoading` with the content.

    import { colors, shapes } from '@cimpress/react-components';
    let { Spinner } = shapes;

    <FulfillerLogo imageLoading={{<Spinner/>}} fulfillerId="fulfillerId" accessToken={localStorage.getItem('accessToken')}/>

### To override default behaviour when no image is available

In order to override behaviour when no image is available provide `noImage` with the content.

    <FulfillerLogo noImage={"No Image"} fulfillerId="fulfillerId" accessToken={localStorage.getItem('accessToken')}/>


### Other overrides

Fulfiller Logo defines following props, that take content

      noImage: PropTypes.object,
      imageLoading: PropTypes.object,
      noAccess: PropTypes.object,
      placeholder: PropTypes.object

`placeholder` is the image that is displayed from the mounting moment till the loading starts (since the component automatically loads the image when it comes into view this should very short period of time

`imageLoading` is the content that is displayed while loading, falls back to `placeholder`

`noAccess` is shown when the user doesn't have access to see fulfiller logo, falls back to `noImage`

`noImage` what gets displayed if the image is not available (for whatever reason)
