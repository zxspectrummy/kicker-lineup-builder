import {Button, Icon, Input} from '@ui-kitten/components';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';

const PlayerList = () => {
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState([{key: '', value: ''}]);

    const DeletePlayerIcon = (props) => (
        <Icon {...props} name='person-delete-outline'/>
    );

    const addHandler = () => {
        const _inputs = [...inputs];
        _inputs.push({key: _inputs.length.toString(), value: ''});
        dispatch({type: 'NEW_PLAYER'});
        setInputs(_inputs);
    }

    const deleteHandler = (key) => {
        const _inputs = inputs.filter((_input, index) => index !== key);
        dispatch({ type: 'DELETE_PLAYER', index: key });
        setInputs(_inputs);
    }

    const inputHandler = (text, key) => {
        const _inputs = [...inputs];
        _inputs[key].value = text;
        _inputs[key].key = key;
        dispatch({ type: 'UPDATE_PLAYER', index: key, payload: text });
        setInputs(_inputs);
    }

    return (
        <View>
            {inputs.map((input, key) => (
                <View style={styles.inputContainer} key={key}>
                    <Input
                        style={styles.input}
                        value={input.value}
                        placeholder='Player name'
                        onChangeText={(text) => inputHandler(text, key)}
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
            <Button style={styles.button}
                title="Add" onPress={addHandler} >Add</Button>
        </View>
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

export default PlayerList;
