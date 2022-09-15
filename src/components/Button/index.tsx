import * as Styles from './styles';

type Props = {
    label: string;
    icon?: any;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disableButton: boolean;
}

export const Button = ({ label, icon, onClick, disableButton }: Props) => {
    return (
        <Styles.Container onClick={onClick} disabled={disableButton}>
            {icon &&
                <Styles.IconArea>
                    <Styles.Icon src={icon} />
                </Styles.IconArea>
            }

            <Styles.Label>{label}</Styles.Label>
        </Styles.Container>
    );
}