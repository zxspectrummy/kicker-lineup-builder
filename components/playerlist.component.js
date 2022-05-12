import {Button, Card, Icon, Input, Toggle} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect, useDispatch} from 'react-redux';

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
        dispatch({type: 'DELETE_PLAYER', index: key});
    }

    const inputHandler = (name, key) => {
        dispatch({type: 'UPDATE_PLAYER', index: key, payload: name});
    }
    const [activeChecked, setActiveChecked] = React.useState(false);

    return (
        <Card>
            {props.players.map((name, key) => (
                <View style={styles.inputContainer} key={key}>
                    <Toggle
                        style={styles.toggle}
                        checked={activeChecked}
                        onChange={setActiveChecked}>
                    </Toggle>
                    <Input
                        style={styles.input}
                        value={name}
                        placeholder='Player name'
                        onChangeText={(changedName) => inputHandler(changedName, key)}
                    />
                    <Button
                        style={styles.button}
                        appearance='ghost'
                        onPress={() => deleteHandler(key)}
                        accessoryLeft={DeletePlayerIcon}
                        status='danger'
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

export default connect(mapStateToProps)(PlayerList);
