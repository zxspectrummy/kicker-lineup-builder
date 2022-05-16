import {useDispatch} from "react-redux";
import {IndexPath, Select, SelectItem, Text} from "@ui-kitten/components";
import * as PropTypes from "prop-types";
import {useRef} from "react";
import {StyleSheet} from "react-native";

const renderOption = (props) => {
    const hint = (props) => (
        <Text>{props.label}</Text>
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
                    type: 'LINEUP_UPDATE_TEAM',
                    team: props.teamKey,
                    payload: selectedIndexToPlayerIds(selectedIndex)
                })
            }
        }}
        value={commaSeparatedPlayerList()}>
        {props.players && props.players.map((player) => renderOption({
            title: player.name,
            key: player.id,
            disabled: (props.team.length >= 2 && !props.team.includes(player.id)),
            isSelected: props.team.includes(player.id),
            gamesPlayed: player.gamesPlayed
        }))}
    </Select>
}

export default TeamPicker;

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


const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        padding: 5,
    },
});
