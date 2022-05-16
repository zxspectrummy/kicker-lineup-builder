import {connect, useDispatch} from "react-redux";
import {IndexPath, Select, SelectItem, Text} from "@ui-kitten/components";
import * as PropTypes from "prop-types";
import {useRef} from "react";
import {StyleSheet} from "react-native";
import SubstitutionMenu from "./substitutionmenu.component";


const renderPlayerOption = (props) => {
    const hint = (props) => (
        <Text>{props.label}</Text>
    );
    return <SelectItem
        title={props.currentPlayer.name}
        key={props.currentPlayer.id}
        accessoryLeft={hint({...{label: props.currentPlayer.gamesPlayed}, ...props})}
        accessoryRight={props.substitutionPossible &&
            <SubstitutionMenu currentGame={props.currentGame} currentPlayerId={props.currentPlayer.id}/>}
        disabled={props.disabled}/>
};

const mapStateToProps = (state, ownProps) => {
    return {
        lineup: state.lineup,
        team: ownProps.teamKey === 'substitutions'
            ? state.lineup.substitutions.available.concat(state.lineup.substitutions.broughtIn)
            : state.lineup.games[ownProps.teamKey]
    }
}

const TeamPicker = (props) => {
    const dispatch = useDispatch();
    props.players.sort((a, b) => a.name.localeCompare(b.name));
    const commaSeparatedPlayerList = () => {
        return selectedIndex.filter(index => index.row >= 0)
            .map(index => `${props.players[index.row].name} (${props.players[index.row].gamesPlayed})`).sort().join(', ');
    }
    const selectedIndexToPlayerIds = (indexPath) => {
        return indexPath.filter(index => index.row >= 0).map(index => props.players[index.row].id);
    }
    const playerIdsToSelectedIndex = (playerIds) => {
        return playerIds.map(id => props.players.map(item => item.id).indexOf(id))
            .map(index => new IndexPath(index));
    }
    const selectedIndex = playerIdsToSelectedIndex(props.team);
    const gamesPlayedSoFar = (playerId, currentGame) => {
        let gameCount = 0;
        for (let game in props.lineup.games) {
            if (game == currentGame) {
                break;
            }
            if (props.lineup.games[game].includes(playerId)) {
                gameCount++;
            }
        }
        return gameCount;
    }
    const select = useRef(null)

    const isSubstitutionPossible = (player) => {
        return !props.lineup.substitutions.broughtIn.includes(player.id)
            && props.lineup.substitutions.available.length > 0
            && props.team.includes(player.id)
            && gamesPlayedSoFar(player.id, props.teamKey);
    }

    const onPlayerSelected = (selectedIndex) => {
        if (selectedIndex.length === 2) {
            select.current.blur()
        }
        if ((props.team.length < 2) || (selectedIndex.length < props.team.length)) {
            dispatch({
                type: 'LINEUP_UPDATE_TEAM',
                team: props.teamKey,
                payload: selectedIndexToPlayerIds(selectedIndex)
            })
        }
    }

    return <Select
        ref={select}
        placeholder={props.label}
        style={styles.row}
        label={props.label}
        multiSelect={true}
        selectedIndex={selectedIndex}
        onSelect={onPlayerSelected}
        value={commaSeparatedPlayerList()}>
        {props.players && props.players.map((player) => renderPlayerOption({
            disabled: (props.team.length >= 2 && !props.team.includes(player.id)),
            substitutionPossible: isSubstitutionPossible(player),
            substitutions: props.lineup.substitutions,
            currentGame: props.teamKey,
            currentPlayer: player
        }))}
    </Select>
}

export default connect(mapStateToProps)(TeamPicker);

TeamPicker.propTypes = {
    teamKey: PropTypes.string,
    players: PropTypes.arrayOf(
        PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                isActive: PropTypes.bool,
                gamesPlayed: PropTypes.number,
            }
        )),
    label: PropTypes.string,
};


const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        padding: 5,
    },
});
