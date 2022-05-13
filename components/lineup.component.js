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
        accessoryRight={hint({...{label: '0'}, ...props})}
        disabled={props.disabled}/>
};

const TeamPicker = (props) => {
    const commaSeparatedPlayerList = () => {
        console.log(props.selectedIndex)
        return props.selectedIndex.filter(index => index.row >= 0).map(index => props.players[index.row].name).sort().join(', ');
    }
    return <Select
        placeholder={props.label}
        style={styles.row}
        label={props.label}
        multiSelect={true}
        selectedIndex={props.selectedIndex}
        onSelect={props.onSelect}
        value={commaSeparatedPlayerList()}
    >
        {props.players && props.players.map((player) => renderOption({
            title: player.name, key: player.id, disabled: props.selectedIndex.length >= 2
        }))}
    </Select>
}

TeamPicker.propTypes = {
    selectedIndex: PropTypes.arrayOf(PropTypes.any),
    onSelect: PropTypes.func,
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
    const dispatch = useDispatch();

    console.log(props);

    const rowsToPlayerIds = (indexPath) => {
        return indexPath.map(index => props.players[index.row].id);
    }
    const playerIdsToSelectedIndex = (playerIds) => {
        return playerIds.map(id => props.players.map(item => item.id).indexOf(id))
            .map(index => new IndexPath(index));
    }
    return (
        <View style={[styles.container]}>
            <Card>
                <TeamPicker selectedIndex={playerIdsToSelectedIndex(props.lineup.singles)}
                            onSelect={(selectedIndex) => {
                                dispatch({
                                    type: 'UPDATE_TEAM',
                                    team: 'singles',
                                    payload: rowsToPlayerIds(selectedIndex)
                                })
                            }}
                            players={props.players}
                            label='Einzel 1, Einzel 2'/>
            </Card>
            <Card>
                <TeamPicker selectedIndex={playerIdsToSelectedIndex(props.lineup.doubles1)}
                            onSelect={(selectedIndex) => {
                                dispatch({
                                    type: 'UPDATE_TEAM',
                                    team: 'doubles1',
                                    payload: rowsToPlayerIds(selectedIndex)
                                })
                            }}
                            players={props.players}
                            label='Doppel 1 (D1)'/>
                <TeamPicker selectedIndex={playerIdsToSelectedIndex(props.lineup.doubles2)}
                            onSelect={(selectedIndex) => {
                                dispatch({
                                    type: 'UPDATE_TEAM',
                                    team: 'doubles2',
                                    payload: rowsToPlayerIds(selectedIndex)
                                })
                            }}
                            players={props.players}
                            label='Doppel 2 (D2)'/>
            </Card>
            <Card>
                <TeamPicker selectedIndex={playerIdsToSelectedIndex(props.lineup.doubles3)}
                            onSelect={(selectedIndex) => {
                                dispatch({
                                    type: 'UPDATE_TEAM',
                                    team: 'doubles3',
                                    payload: rowsToPlayerIds(selectedIndex)
                                })
                            }}
                    //players={players.filter((_, i) => !doubles4Index.map(i => i.row).includes(i))}
                            players={props.players}
                            label='Doppel 3 (D3)'/>
                <TeamPicker selectedIndex={playerIdsToSelectedIndex(props.lineup.doubles4)}
                            onSelect={(selectedIndex) => {
                                dispatch({
                                    type: 'UPDATE_TEAM',
                                    team: 'doubles4',
                                    payload: rowsToPlayerIds(selectedIndex)
                                })
                            }}
                            players={props.players}
                            label='Doppel 4 (D4)'/>
            </Card>
            <Card style={styles.teamGroup}>
                <TeamPicker selectedIndex={playerIdsToSelectedIndex(props.lineup.doubles5)}
                            onSelect={(selectedIndex) => {
                                dispatch({
                                    type: 'UPDATE_TEAM',
                                    team: 'doubles5',
                                    payload: rowsToPlayerIds(selectedIndex)
                                })
                            }}
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
