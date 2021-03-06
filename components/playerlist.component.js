import {Button, Card, Icon, Input, Toggle} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import * as PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {
        players: state.players
    }
}

const PlayerList = (props) => {
    const dispatch = useDispatch();

    const DeletePlayerIcon = (props) => (
        <Icon {...props} name='person-delete-outline'/>
    );

    const addHandler = () => {
        dispatch({type: 'NEW_PLAYER'});
    }

    const deleteHandler = (key) => {
        dispatch({type: 'DELETE_PLAYER', playerId: key});
    }

    const inputHandler = (name, key) => {
        dispatch({type: 'UPDATE_PLAYER_NAME', playerId: key, payload: name});
    }

    const stateHandler = (isActive, key) => {
        dispatch({
            type: 'UPDATE_PLAYER_STATE',
            playerId: key,
            payload: isActive
        })
        if (isActive === false) {
            dispatch({
                type: 'UPDATE_ACTIVE_PLAYERS',
                playerId: key
            })
        }
    }
    return (
        <Card>
            {props.players.map((player) => (
                <View style={styles.inputContainer} key={player.id}>
                    <Toggle
                        style={styles.toggle}
                        checked={player.isActive}
                        onChange={(isActive) => stateHandler(isActive, player.id)}
                        size='small'
                        style={{marginHorizontal: 2}}
                    />
                    <Input
                        style={styles.input}
                        value={player.name}
                        placeholder='Player name'
                        onChangeText={(changedName) => inputHandler(changedName, player.id)}
                    />
                    <Button
                        style={styles.button}
                        appearance='ghost'
                        onPress={() => deleteHandler(player.id)}
                        accessoryLeft={DeletePlayerIcon}
                        status='danger'
                        size='small'
                    />
                </View>
            ))}
            <Button style={styles.button} title="Add" onPress={addHandler}>Add</Button>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 2
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "lightgray"
    },
    input: {
        flex: 1,
        margin: 2,
    },
    button: {
        margin: 3,
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

PlayerList.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                isActive: PropTypes.bool,
                gamesPlayed: PropTypes.number,
            }
        ))
}

export default connect(mapStateToProps)(PlayerList);
