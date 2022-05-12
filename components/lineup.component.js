import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Lineup from "../services/lineup";
import {Card, Select, SelectItem, Text} from '@ui-kitten/components';
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
        return props.selectedIndex.map(index => props.players[index.row]).sort().join(', ');
    }

    return <Select
        placeholder={props.label}
        style={styles.row}
        label={props.label}
        multiSelect={true}
        selectedIndex={props.selectedIndex}
        onSelect={props.onSelect}
        value={commaSeparatedPlayerList()}>
        {props.players && props.players.map((player, index) => renderOption({
            title: player, key: index, disabled: props.selectedIndex.length >= 2
        }))}
    </Select>
}

TeamPicker.propTypes = {
    selectedIndex: PropTypes.arrayOf(PropTypes.any),
    onSelect: PropTypes.func,
    players: PropTypes.arrayOf(PropTypes.any),
    label: PropTypes.string,
};
const LineupComponent = () => {
    const players = useSelector(store => store.players);

    const lineup = new Lineup(players);
    const teams = lineup.getAllPairs();
    const [singlesIndex, setSinglesIndex] = useState([]);
    const [doubles1Index, setDoubles1Index] = useState([]);
    const [doubles2Index, setDoubles2Index] = useState([]);
    const [doubles3Index, setDoubles3Index] = useState([]);
    const [doubles4Index, setDoubles4Index] = useState([]);
    const [doubles5Index, setDoubles5Index] = useState([]);

    return (
        <View style={[styles.container]}>
            <Card>
                <TeamPicker selectedIndex={singlesIndex}
                            onSelect={index => setSinglesIndex(index)}
                            players={players}
                            label='Einzel 1, Einzel 2'/>
            </Card>
            <Card>
                <TeamPicker selectedIndex={doubles1Index}
                            onSelect={index => setDoubles1Index(index)}
                            players={players}
                            label='Doppel 1 (D1)'/>
                <TeamPicker selectedIndex={doubles2Index}
                            onSelect={index => setDoubles2Index(index)}
                            players={players}
                            label='Doppel 2 (D2)'/>
            </Card>
            <Card>
                <TeamPicker selectedIndex={doubles3Index}
                            onSelect={index => setDoubles3Index(index)}
                            players={players.filter((_, i) => !doubles4Index.map(i => i.row).includes(i))}
                            label='Doppel 3 (D3)'/>
                <TeamPicker selectedIndex={doubles4Index}
                            onSelect={(index) => {
                                setDoubles4Index(index)
                            }}
                            players={players}
                            label='Doppel 4 (D4)'/>
            </Card>
            <Card style={styles.teamGroup}>
                <TeamPicker selectedIndex={doubles5Index}
                            onSelect={
                                index => setDoubles5Index(index)
                            }
                            players={players}
                            label='Doppel 5 (D5)'/>
            </Card>
            {/*<View style={{flex: 1}}>*/}
            {/*    <Text>{teams.toString()}</Text>*/}
            {/*</View>*/}
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
export default LineupComponent;
