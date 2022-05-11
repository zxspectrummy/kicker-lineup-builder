import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import PlayerList from './playerlist.component';
import LineupComponent from './lineup.component';


const {Navigator, Screen} = createBottomTabNavigator();

const PlayersScreen = (PlayerList);

const LineupScreen = (
    LineupComponent
);

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='LINEUP'/>
        <BottomNavigationTab title='PLAYERS'/>
    </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Lineup' component={LineupScreen} />
    <Screen name='Players' component={PlayersScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);
