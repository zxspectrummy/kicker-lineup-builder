import {StyleSheet, View} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {Card, IndexPath, Select, SelectItem, Text} from '@ui-kitten/components';
import * as PropTypes from "prop-types";

const renderOption = (props) => {
    const hint = (props) => (
        <Text style={styles.gamesPlayed}>{props.label}</Text>
    );
    return <SelectItem
        title={props.title}
        key={props.key}
        accessoryRight={hint({...{label: props.gamesPlayed}, ...props})}
        disabled={props.disabled}/>
};

const TeamPicker = (props) => {
    const dispatch = useDispatch();

    const commaSeparatedPlayerList = () => {
        return selectedIndex.filter(index => index.row >= 0).map(index => props.players[index.row].name).sort().join(', ');
    }
    const selectedIndexToPlayerIds = (indexPath) => {
        return indexPath.map(index => props.players[index.row].id);
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
    return <Select
        placeholder={props.label}
        style={styles.row}
        label={props.label}
        multiSelect={true}
        selectedIndex={selectedIndex}
        onSelect={(selectedIndex) => {
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
        value={commaSeparatedPlayerList()}
    >
        {props.players && props.players.map((player) => renderOption({
            title: player.name, key: player.id, disabled: selectedIndex.length >= 2, gamesPlayed: player.gamesPlayed
        }))}
    </Select>
}

TeamPicker.propTypes = {
    //selectedIndex: PropTypes.arrayOf(PropTypes.any),
    //onSelect: PropTypes.func,
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
    return {
        lineup: state.lineup,
        players: state.players.filter(player => player.isActive)
    }
}
const LineupComponent = (props) => {
    console.log(props);

    return (
        <View style={[styles.container]}>
            <Card>
                <TeamPicker team={props.lineup.singles}
                            teamKey='singles'
                            players={props.players}
                            label='Einzel 1, Einzel 2'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles1}
                            teamKey='doubles1'
                            players={props.players}
                            label='Doppel 1 (D1)'/>
                <TeamPicker team={props.lineup.doubles2}
                            teamKey='doubles2'
                            players={props.players}
                            label='Doppel 2 (D2)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles3}
                            teamKey='doubles3'
                            players={props.players}
                            label='Doppel 3 (D3)'/>
                <TeamPicker team={props.lineup.doubles4}
                            teamKey='doubles4'
                            players={props.players}
                            label='Doppel 4 (D4)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles5}
                            teamKey='doubles5'
                            players={props.players}
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
