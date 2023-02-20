import { useState } from 'react';
import classnames from 'classnames';
import { IPokemonRow } from '../../interfaces';
import styles from './InfoPanel.module.scss';
import { useQuery } from "@apollo/client"
import type { ISinglePokemonData } from '../../interfaces';
import { GET_POKEMON_DATA } from '../../graphql/queries';
import BarChart from '../BarChart';

export type IInfoPanelProps = {
  selectedPokemon: IPokemonRow | null
}

const statNameMap : { [key: string]: string } = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  ['special-attack']: 'SAtk',
  ['special-defense']: 'SDef',
  speed: 'Spd',
};

const BAR_CHART_HEIGHT = 250;
const BAR_CHART_WIDTH = 300;

function InfoPanel({ selectedPokemon }: IInfoPanelProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { data, loading } = useQuery<ISinglePokemonData>(GET_POKEMON_DATA, {
    variables: { 
      pokemonId: selectedPokemon?.id || 0,
    },
  })

  const flavorText = data?.pokemon_v2_pokemonspeciesflavortext?.[0]?.flavor_text;
  const baseStats = (data?.pokemon_v2_pokemonstat || []).map(datum => ({
    label: statNameMap[datum.pokemon_v2_stat.name],
    value: datum.base_stat,
  }))

  const onImageLoaded = () => {
    setImageLoaded(true);
  }

  return (
    <div className={styles.InfoPanel}>
      {!selectedPokemon && <h1 className={styles.InfoPanel__Title}>Select a Pokémon to get started</h1>}
      {selectedPokemon && <div className={styles.InfoPanel__Content}>
        <h1 className={styles.InfoPanel__Title}>{selectedPokemon.name} #{selectedPokemon.id}</h1>
        {selectedPokemon.imageUrl && 
          <img 
            className={classnames(styles.InfoPanel__Image,  { [styles['InfoPanel__Image--loaded']] : imageLoaded })} 
            src={selectedPokemon.imageUrl} 
            alt={`sidebar-${selectedPokemon.name}-sprite`} 
            onLoad={onImageLoaded}
          />
        }
        <div className={classnames(styles.InfoPanel__Flavor, { [styles['InfoPanel__Flavor--redacted']] : !flavorText })}>
          {/* {loading && <div className={styles['lds-ring']}><div></div><div></div><div></div><div></div></div>} */}
          {!loading && flavorText && <p>{flavorText}</p>}
        </div>
        <div className={classnames(styles.InfoPanel__Row, styles['InfoPanel__Row--chart'])}>
          <h1 className={styles.InfoPanel__RowTitle}>Base Stats</h1>
          <BarChart data={baseStats} height={BAR_CHART_HEIGHT} width={BAR_CHART_WIDTH}/>
        </div>
      </div>}
    </div>
  )
}

export default InfoPanel;