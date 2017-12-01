'use strict';

import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('react-visibility-sensor', () => 'div');

import FulfillerLogo from '../src/FufillerLogo.jsx';

describe('FulfillerLogo', function () {

  it('renders correctly', () => {
    const tree = renderer
      .create(<FulfillerLogo/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

});