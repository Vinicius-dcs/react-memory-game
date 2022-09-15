import { GridItemType } from '../../types/GridItemType';
import * as Styles from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../data/items';

type Props = {
    item: GridItemType;
    onClick: () => void;
    cursor: string;
}

export const GridItem = ({ item, onClick, cursor }: Props) => {
    return (
        <Styles.Container onClick={onClick} showBackground={item.permanentShow || item.show} cursor={cursor}>
            {item.permanentShow === false && item.show === false &&
                <Styles.Icon src={b7Svg} opacity={.1} alt="" />
            }

            {(item.permanentShow || item.show) && item.item !== null &&
                <Styles.Icon src={items[item.item].icon} alt="" />
            } 
        </Styles.Container>
    );
}