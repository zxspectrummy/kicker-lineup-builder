import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import PlayerList from './playerlist.component';
import LineupComponent from './lineup.component';
import TopNavigationComponent from "./topnavigation.component";

const {Navigator, Screen} = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='PLAYERS'/>
        <BottomNavigationTab title='LINEUP'/>
    </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Screen name='Players' component={PlayerList} options={{headerShown: false}}/>
      <Screen name='Lineup' component={LineupComponent} options={{headerShown: false}}/>
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
      <TopNavigationComponent/>
      <TabNavigator/>
  </NavigationContainer>
);
