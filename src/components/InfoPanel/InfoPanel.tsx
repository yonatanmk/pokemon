import { useState, useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { IPokemonRow } from '../../interfaces';
import styles from './InfoPanel.module.scss';
import filterPanelStyles from '../FilterPanel/FilterPanel.module.scss';
import { useQuery } from "@apollo/client"
import type { ISinglePokemonData, IBarChartData } from '../../interfaces';
import { GET_POKEMON_DATA } from '../../graphql/queries';
import BarChart from '../BarChart';
import Table from '../Table';
import { moveColumns } from '../../util/tableData';
import { formatPokemonMove } from '../../util';

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
  const infoPanelRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false)
  const [cachedBasedStats, setCachedBaseStats] = useState<IBarChartData[]>([])
  const { data, loading } = useQuery<ISinglePokemonData>(GET_POKEMON_DATA, {
    variables: {
      pokemonId: selectedPokemon?.id || 0,
    },
  })

  const flavorText = data?.pokemon_v2_pokemonspeciesflavortext?.[0]?.flavor_text;

  const onImageLoaded = () => {
    setImageLoaded(true);
  }

  const moveset = useMemo(() => (data?.pokemon_v2_pokemonmove || []).map(formatPokemonMove), [data]);

  const baseStats = useMemo(() => (data?.pokemon_v2_pokemonstat || []).map(datum => ({
    label: statNameMap[datum.pokemon_v2_stat.name],
    value: datum.base_stat,
  })), [data]);

  useEffect(() => {
    if (baseStats[0]) setCachedBaseStats(baseStats)
  }, [baseStats])

  useEffect(() => {
    if (infoPanelRef?.current) {
      (infoPanelRef.current as any).scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [data]);

  const baseStatsChartData = (baseStats[0] || !cachedBasedStats[0]) ? baseStats : cachedBasedStats;

  return (
    <div ref={infoPanelRef} className={styles.InfoPanel}>
      {!selectedPokemon && <h1 className={styles.InfoPanel__Title}>Select a Pokémon to get started</h1>}
      {selectedPokemon && <div className={styles.InfoPanel__Content}>
        <div className={styles.InfoPanel__Row}>
          <h1 className={styles.InfoPanel__Title}>{selectedPokemon.name} #{selectedPokemon.id}</h1>
          {selectedPokemon.imageUrl &&
            <img
              className={classnames(styles.InfoPanel__Image,  { [styles['InfoPanel__Image--loaded']] : imageLoaded })}
              src={selectedPokemon.imageUrl}
              alt={`sidebar-${selectedPokemon.name}-sprite`}
              onLoad={onImageLoaded}
            />
          }
          <div className={styles.InfoPanel__Flavor}>
            {!loading && flavorText && <p>{flavorText}</p>}
          </div>
        </div>
        <div className={classnames(styles.InfoPanel__Row, styles['InfoPanel__Row--chart'])}>
          <h1 className={styles.InfoPanel__RowTitle}>Base Stats</h1>
          <BarChart data={baseStatsChartData} height={BAR_CHART_HEIGHT} width={BAR_CHART_WIDTH}/>
        </div>
        {moveset && moveset[0] && <div className={classnames(styles.InfoPanel__Row, styles['InfoPanel__Row--table'])}>
          <p className={classnames(filterPanelStyles["FilterPanel__Row--head"], filterPanelStyles["FilterPanel__Row--label"])}>Moveset</p>
          <div className={styles.InfoPanel__Table__Container}>
            <Table
              className={styles.InfoPanel__Table}
              rows={moveset}
              columns={moveColumns}
              defaultSortPredicate="level"
              backupSortPredicate="level"
              filters={[]}
            />
          </div>
        </div>}
      </div>}
    </div>
  )
}

export default InfoPanel;