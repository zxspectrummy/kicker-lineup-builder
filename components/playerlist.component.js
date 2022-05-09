import { Button, Icon, Input, Text, Layout, withStyles } from '@ui-kitten/components';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const PlayerList = () => {
    const [playerNames, setInputs] = useState([{ key: '', value: '' }]);

    const DeletePlayerIcon = (props) => (
        <Icon {...props} name='person-delete-outline' />
    );

    const addHandler = () => {
        const _inputs = [...playerNames];
        _inputs.push({ key: '', value: '' });
        setInputs(_inputs);
    }

    const deleteHandler = (key) => {
        const _inputs = playerNames
        .filter((input, index) => index != key);
        setInputs(_inputs);
    }

    const inputHandler = (text, key) => {
        const _inputs = [...playerNames
        ];
        _inputs[key].value = text;
        _inputs[key].key = key;
        console.log(_inputs);
        setInputs(_inputs);
    }

    return (
        <View>
            {playerNames
            .map((input, key) => (
                <View style={styles.inputContainer}>
                    <Input
                        key={key}
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
                title="Add" onPress={addHandler} />
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