import {Button, Icon, MenuItem, OverflowMenu} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {useState} from 'react';
import {connect, useDispatch} from "react-redux";

const SwapIcon = (props) => (
    <Icon {...props} name='swap'/>
);

const mapStateToProps = (state, ownProps) => {
    return {
        currentGame: ownProps.currentGame,
        currentPlayerId: ownProps.currentPlayerId,
        players: state.players.filter(player => player.isActive)
            .filter(player => state.lineup.substitutions.available.includes(player.id))
    }
}

const SubstitutionMenu = (props) => {
    const dispatch = useDispatch();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [visible, setVisible] = useState(false);
    const ReplaceButton = () => (
        <Button accessoryLeft={SwapIcon} onPress={() => setVisible(true)} appearance='ghost' size='tiny'/>
    )

    const renderMenuItem = (props) => {
        return (<MenuItem title={props.title} key={props.key}/>)
    }

    const substitutePlayer = (indexPath) => {
        const playerId = props.players[indexPath.row].id;
        dispatch({
            type: 'LINEUP_SUBSTITUTE_PLAYER',
            playerId: playerId,
            currentGame: props.currentGame,
            currentPlayerId: props.currentPlayerId
        });
        setVisible(false);
    }

    return (
        <OverflowMenu
            backdropStyle={styles.backdrop}
            visible={visible}
            anchor={ReplaceButton}
            selectedIndex={selectedIndex}
            onSelect={substitutePlayer}
            onBackdropPress={() => setVisible(false)}>
            {props.players && props.players.map((player) => renderMenuItem({title: player.name, key: player.id}))}
        </OverflowMenu>
    );
}

export default connect(mapStateToProps)(SubstitutionMenu);

const styles = StyleSheet.create({
    container: {
        minHeight: 144,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    avatar: {
        marginHorizontal: 4,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
