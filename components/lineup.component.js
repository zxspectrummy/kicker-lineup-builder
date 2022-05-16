import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {Card} from '@ui-kitten/components';
import {createSelector} from "reselect";
import TeamPicker from "./teampicker.component";


const addGamesPlayed = (players, games) => {
    const allGames = Object.keys(games).map((key) => games[key]).flat(1)
    return players.map(player => ({
        ...player,
        gamesPlayed: allGames.reduce((count, item) => (item === player.id ? count + 1 : count), 0)
    }));
}

const playersWithGamesPlayed = createSelector(
    [state => state.players, state => state.lineup.games],
    addGamesPlayed
);

const mapStateToProps = (state) => {
    const games = state.lineup.games;
    const activePlayers = () => {
        return playersWithGamesPlayed(state).filter(player => player.isActive)
            .filter(player => !state.lineup.substitutions.available.includes(player.id));
    }

    const playersAllowedPlayedClosingRounds = (team) => {
        return filterByGamesPlayed(team)
            .filter(x => games.doubles1.includes(x.id)
                || games.doubles2.includes(x.id)
                || games.singles.includes(x.id));
    }

    const playersForD3D4 = (team) => {
        if ((games.singles.length === 2) && (team.length === 1)
            && (games.singles.includes(team[0]))) {
            const secondSinglesPlayer = games.singles.filter(x => !team.includes(x));
            return playersAllowedPlayedClosingRounds(team).filter(player => player.id != secondSinglesPlayer)
        }
        return playersAllowedPlayedClosingRounds(team);
    }

    const filterByGamesPlayed = (team) => {
        return activePlayers().filter(player => player.gamesPlayed < 3)
            .concat(activePlayers().filter(player => team.includes(player.id) && player.gamesPlayed === 3));
    }
    return {
        lineup: state.lineup,
        availablePlayers: activePlayers(),
        availableForD1: filterByGamesPlayed(games.doubles1).filter(x => !games.doubles2.includes(x.id)),
        availableForD2: filterByGamesPlayed(games.doubles2).filter(x => !games.doubles1.includes(x.id)),
        availableForD3: playersForD3D4(games.doubles3).filter(x => !games.doubles4.includes(x.id)),
        availableForD4: playersForD3D4(games.doubles4).filter(x => !games.doubles3.includes(x.id)),
        availableForD5: playersAllowedPlayedClosingRounds(games.doubles5),
        availableForSubstitutions: playersWithGamesPlayed(state).filter(player => player.isActive)
            .filter(player => state.lineup.substitutions.available.includes(player.id)
                || state.lineup.substitutions.broughtIn.includes(player.id)
                || player.gamesPlayed === 0)
    }
}
const LineupComponent = (props) => {
    return (
        <ScrollView>
            <Card>
                <TeamPicker
                    teamKey='doubles1'
                    players={props.availableForD1}
                    label='Doppel 1 (D1)'/>
                <TeamPicker
                    teamKey='doubles2'
                    players={props.availableForD2}
                    label='Doppel 2 (D2)'/>
            </Card>
            <Card>
                <TeamPicker
                    teamKey='singles'
                    players={props.availablePlayers}
                    label='Einzel 1 (E1), Einzel 2 (E2)'/>
            </Card>
            <Card>
                <TeamPicker
                    teamKey='doubles3'
                    players={props.availableForD3}
                    label='Doppel 3 (D3)'/>
                <TeamPicker
                    teamKey='doubles4'
                    players={props.availableForD4}
                    label='Doppel 4 (D4)'/>
            </Card>
            <Card>
                <TeamPicker
                    teamKey='doubles5'
                    players={props.availableForD5}
                    label='Doppel 5 (D5)'/>
            </Card>
            <Card>
                <TeamPicker
                    teamKey='substitutions'
                    players={props.availableForSubstitutions}
                    label='Ersatzspieler'/>
            </Card>
        </ScrollView>
    );
}

export default connect(mapStateToProps)(LineupComponent);
