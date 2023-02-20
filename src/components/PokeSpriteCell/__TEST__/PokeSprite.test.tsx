import { render } from '@testing-library/react'
import PokeSpriteCell from '../PokeSpriteCell';

const mockProps = {
  id: 12,
  name: "Test Pokekmon",
  defaultUrl: 'defaultUrl',
  shinyUrl: 'shinyUrl',
}

describe('SpokeSprite', () => {
  it('renders successfully', async () => {
    const wrapper = render(<PokeSpriteCell {...mockProps} />)
    const { getAllByRole } = wrapper;
    const imgs = getAllByRole('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute('src', mockProps.defaultUrl);
    expect(imgs[1]).toHaveAttribute('src', mockProps.shinyUrl);
  })
})
