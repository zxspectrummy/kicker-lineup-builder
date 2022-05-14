import {StyleSheet, View} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {Card, IndexPath, Select, SelectItem, Text} from '@ui-kitten/components';
import * as PropTypes from "prop-types";
import {useRef} from "react";

const renderOption = (props) => {
    const hint = (props) => (
        <Text style={styles.gamesPlayed}>{props.label}</Text>
    );
    return <SelectItem
        title={props.title}
        key={props.key}
        accessoryLeft={hint({...{label: props.gamesPlayed}, ...props})}
        disabled={props.disabled}/>
};

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

    const lastSelectedPlayerId = (selectedIndex, team) => {
        let playerIds = selectedIndexToPlayerIds(selectedIndex);
        return playerIds.filter(x => !team.includes(x)).concat(team.filter(x => !playerIds.includes(x)))[0];
    }
    const select = useRef(null)
    return <Select
        ref={select}
        placeholder={props.label}
        style={styles.row}
        label={props.label}
        multiSelect={true}
        selectedIndex={selectedIndex}
        onSelect={(selectedIndex) => {
            if (selectedIndex.length === 2) {
                select.current.blur()
            }
            if ((props.team.length < 2) || (selectedIndex.length < props.team.length)) {
                dispatch({
                    type: 'UPDATE_TEAM',
                    team: props.teamKey,
                    payload: selectedIndexToPlayerIds(selectedIndex)
                })
                dispatch({
                    type: 'UPDATE_PLAYER_GAMES_PLAYED',
                    index: lastSelectedPlayerId(selectedIndex, props.team),
                    payload: selectedIndex.length - props.team.length
                })
            }
        }}
        value={commaSeparatedPlayerList()}>
        {props.players && props.players.map((player) => renderOption({
            title: player.name,
            key: player.id,
            disabled: (selectedIndex.length >= 2 && !props.team.includes(player.id)),
            gamesPlayed: player.gamesPlayed
        }))}
    </Select>
}

TeamPicker.propTypes = {
    team: PropTypes.array,
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

const mapStateToProps = (state) => {
    const activePlayers = () => {
        return state.players.filter(player => player.isActive);
    }

    const playersAllowedPlayedClosingRounds = (team) => {
        return filterByGamesPlayed(team)
            .filter(x => state.lineup.doubles1.includes(x.id)
                || state.lineup.doubles2.includes(x.id)
                || state.lineup.singles.includes(x.id));
    }

    const playersForD3D4 = (team) => {
        if ((state.lineup.singles.length === 2) && (team.length === 1)
            && (state.lineup.singles.includes(team[0]))) {
            const secondSinglesPlayer = state.lineup.singles.filter(x => !team.includes(x));
            return playersAllowedPlayedClosingRounds(team).filter(player => player.id != secondSinglesPlayer)
        }
        return playersAllowedPlayedClosingRounds(team);
    }

    const filterByGamesPlayed = (team) => {
        return activePlayers().filter(player => player.gamesPlayed < 3)
            .concat(activePlayers().filter(player => team.includes(player.id) && player.gamesPlayed == 3));
    }

    return {
        lineup: state.lineup,
        players: activePlayers(),
        doubles1: filterByGamesPlayed(state.lineup.doubles1).filter(x => !state.lineup.doubles2.includes(x.id)),
        doubles2: filterByGamesPlayed(state.lineup.doubles2).filter(x => !state.lineup.doubles1.includes(x.id)),
        doubles3: playersForD3D4(state.lineup.doubles3).filter(x => !state.lineup.doubles4.includes(x.id)),
        doubles4: playersForD3D4(state.lineup.doubles4).filter(x => !state.lineup.doubles3.includes(x.id)),
        doubles5: playersAllowedPlayedClosingRounds(state.lineup.doubles5)
    }
}
const LineupComponent = (props) => {
    return (
        <View style={[styles.container]}>
            <Card>
                <TeamPicker team={props.lineup.doubles1}
                            teamKey='doubles1'
                            players={props.doubles1}
                            label='Doppel 1 (D1)'/>
                <TeamPicker team={props.lineup.doubles2}
                            teamKey='doubles2'
                            players={props.doubles2}
                            label='Doppel 2 (D2)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.singles}
                            teamKey='singles'
                            players={props.players}
                            label='Einzel 1 (E1), Einzel 2 (E2)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles3}
                            teamKey='doubles3'
                            players={props.doubles3}
                            label='Doppel 3 (D3)'/>
                <TeamPicker team={props.lineup.doubles4}
                            teamKey='doubles4'
                            players={props.doubles4}
                            label='Doppel 4 (D4)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles5}
                            teamKey='doubles5'
                            players={props.doubles5}
                            label='Doppel 5 (D5)'/>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        padding: 5,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    teamGroup: {
        padding: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray"
    },
    gamesPlayed: {
        color: "lightgray"
    }
});
export default connect(mapStateToProps)(LineupComponent);
