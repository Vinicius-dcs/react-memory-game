import { useEffect, useState } from 'react';
import * as Styles from './App.styles';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items'
import { GridItem } from './components/GridItem';
import logoImage from './assets/devmemory_logo.png';
import restartIcon from './svgs/restart.svg';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
	const [playing, setPlaying] = useState<boolean>(false);
	const [timeElapsed, setTimeElapsed] = useState<number>(0);
	const [moveCount, setMoveCount] = useState<number>(0);
	const [showCount, setShowCount] = useState<number>(0);
	const [gridItems, setGridItems] = useState<GridItemType[]>([]);
	const [start, setStart] = useState<boolean>(false);
	const [disableStart, setDisableStart] = useState<boolean>(false);
	const [disableRestart, setDisableRestart] = useState<boolean>(true);
	const [cursor, setCursor] = useState<string>('unset')

	useEffect(() => {
		resetAndCreateGrid();
	}, []);

	useEffect(() => {
		if(start) {
			const timer = setInterval(() => {
				if (timeElapsed > 0) {
					setTimeElapsed(timeElapsed - 1);
				}
				if(timeElapsed === 1) {
					setStart(false);
					handleGrid(false);
					setPlaying(true);
					setDisableStart(true);
					setDisableRestart(false);
					setCursor('pointer');
				}
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [start, timeElapsed]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (playing && !start) {
				setTimeElapsed(timeElapsed + 1);
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [playing, timeElapsed]);

	useEffect(() => {
		if (showCount == 2) {
			let opened = gridItems.filter(item => item.show === true);

			if (opened.length === 2) {
				if (opened[0].item === opened[1].item) {
					let tempGrid = [...gridItems];

					for (let i in tempGrid) {
						if (tempGrid[i].show) {
							tempGrid[i].permanentShow = true;
							tempGrid[i].show = false;
						}
					}

					setGridItems(tempGrid);
					setShowCount(0);
				} else {
					setTimeout(() => {
						let tempGrid = [...gridItems];

						for (let i in tempGrid) {
							tempGrid[i].show = false;
						}

						setGridItems(tempGrid);
						setShowCount(0);
					}, 1000)
				}

				setMoveCount(moveCount => moveCount + 1);
			}
		}
	}, [showCount, gridItems]);

	useEffect(() => {
		if (moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
			setPlaying(false);
		}
	}, [moveCount, gridItems])

	const startGame = () => {
		setTimeElapsed(5);
		setStart(true);
		handleGrid(true);
	}

	const handleGrid = (show: boolean) => {
		let tempGrid = gridItems.map((item) => ({...item, show: show}))
		setGridItems(tempGrid);
	}

	const resetAndCreateGrid = () => {
		setPlaying(false);
		setDisableStart(false);
		setDisableRestart(true);

		// 1 - Reset game
		setTimeElapsed(0);
		setMoveCount(0);
		setShowCount(0);

		// 2 - Create grid

		// 2.1 - Create a empty grid 
		let tempGrid: GridItemType[] = [];

		for (let i = 0; i < (items.length * 2); i++) {
			tempGrid.push({
				item: null,
				show: false, //COLOCAR ESSE FALSE EM UM STATE PRA INICIAR COMO TRUE QUANDO CARA CLICAR EM INICIAR
				permanentShow: false
			});
		}

		// 2.2 - Fill the empty grid
		for (let w = 0; w < 2; w++) {
			for (let i = 0; i < items.length; i++) {
				let position = -1;

				while (position < 0 || tempGrid[position].item !== null) {
					position = Math.floor(Math.random() * (items.length * 2));
				}

				tempGrid[position].item = i;
			}
		}

		// 2.3 - Fill state
		setGridItems(tempGrid);

		// 3 - Start the game
		// setPlaying(true);
	};

	const handleItemClick = (index: number) => {
		if (playing && index !== null && showCount < 2) {
			let tempGrid = [...gridItems];

			if (tempGrid[index].permanentShow === false && tempGrid[index].show === false) {
				tempGrid[index].show = true;
				setShowCount(showCount + 1);
			}

			setGridItems(tempGrid);
		}
	}

	return (
		<Styles.Container>
			<Styles.Info>
				<Styles.LogoLink href="">
					<img src={logoImage} alt="" width="200" />
				</Styles.LogoLink>

				<Styles.InfoArea>
					<InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
					<InfoItem label="Movimentos" value={moveCount.toString()} />
				</Styles.InfoArea>

				<Button label="Iniciar" icon={restartIcon} onClick={startGame} disableButton={disableStart}></Button>
				<br />
				<Button label="Reiniciar" icon={restartIcon} onClick={resetAndCreateGrid} disableButton={disableRestart}></Button>
			</Styles.Info>

			<Styles.GridArea>
				<Styles.Grid>
					{gridItems.map((item, index) => (
						<GridItem key={index} item={item} onClick={() => handleItemClick(index)} cursor={cursor} />

					))}
				</Styles.Grid>
			</Styles.GridArea>
		</Styles.Container>
	);
}

export default App;