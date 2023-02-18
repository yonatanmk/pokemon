import React from 'react'
import {
  render,
  fireEvent,
} from '@testing-library/react'

import PokeSpriteCell, { baseFrontImageUrl, baseShinyFrontImageUrl } from '../PokeSpriteCell';

const mockProps = {
  id: 12,
  name: "Test Pokekmon"
}

describe('SpokeSprite', () => {
  it('renders successfully', async () => {
    const wrapper = render(<PokeSpriteCell {...mockProps} />)
    const { getAllByRole } = wrapper;
    const imgs = getAllByRole('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute('src', `${baseFrontImageUrl}${mockProps.id}.png`);
    expect(imgs[1]).toHaveAttribute('src', `${baseShinyFrontImageUrl}${mockProps.id}.png`);
  })
})

// import ShallowRenderer from 'react-test-renderer/shallow';

// const renderer = new ShallowRenderer();


// import React from 'react';
// // import { render, screen } from '@testing-library/react';
// // import App from './App';

// test('renders learn react link', () => {
//   // render(<App />);
//   // const linkElement = screen.getByText(/learn react/i);
//   // expect(linkElement).toBeInTheDocument();
//   expect(true).toBe(true);
// });
