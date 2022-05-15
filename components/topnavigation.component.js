import React from "react";
import {StyleSheet, Text, View} from 'react-native';

import {Avatar, Icon, Layout, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import {useDispatch} from "react-redux";


const MenuIcon = (props) => (
    <Icon {...props} name='more-vertical'/>
);

const ResetIcon = (props) => (
    <Icon {...props} name='refresh'/>
);

const TopNavigationComponent = () => {
    const dispatch = useDispatch();

    const [menuVisible, setMenuVisible] = React.useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const renderMenuAction = () => (
        <TopNavigationAction icon={MenuIcon} onPress={toggleMenu}/>
    );

    const renderTitle = (props) => (
        <View style={styles.titleContainer}>
            <Avatar
                style={styles.logo}
                source={require('../assets/table-football.png')}
            />
            <Text {...props}>Lineup Builder</Text>
        </View>
    );

    const renderRightActions = () => (
        <React.Fragment>
            <OverflowMenu
                anchor={renderMenuAction}
                visible={menuVisible}
                onBackdropPress={toggleMenu}>
                <MenuItem accessoryLeft={ResetIcon} title='Reset lineup'
                          onPress={() => dispatch({type: 'LINEUP_RESET'})}/>
            </OverflowMenu>
        </React.Fragment>
    );
    return (
        <Layout style={styles.container} level='1'>
            <TopNavigation
                title={renderTitle}
                accessoryRight={renderRightActions}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 64,
        marginTop: 32
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        marginHorizontal: 16,
    },
})

export default TopNavigationComponent
