import {View} from 'react-native';
import {connect} from 'react-redux';
import {Card} from '@ui-kitten/components';
import {createSelector} from "reselect";
import TeamPicker from "./teampicker.component";


const addGamesPlayed = (players, lineup) => {
    const allGames = Object.keys(lineup).map((key) => lineup[key]).flat(1)
    return players.map(player => ({
        ...player,
        gamesPlayed: allGames.reduce((a, v) => (v === player.id ? a + 1 : a), 0)
    }));
}

const resultSelector = createSelector(
    [state => state.players, state => state.lineup],
    addGamesPlayed
);
const mapStateToProps = (state) => {
    const activePlayers = () => {
        return resultSelector(state).filter(player => player.isActive);
    }

    const playersAllowedPlayedClosingRounds = (team) => {
        return filterByGamesPlayed(team)
            .filter(x => state.lineup.doubles1.includes(x.id)
                || state.lineup.doubles2.includes(x.id)
                || state.lineup.singles.includes(x.id));
    }

    const playersForD3D4 = (team) => {
        if ((state.lineup.singles.length === 2) && (team.length === 1)
            && (state.lineup.singles.includes(team[0]))) {
            const secondSinglesPlayer = state.lineup.singles.filter(x => !team.includes(x));
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
        players: activePlayers(),
        doubles1: filterByGamesPlayed(state.lineup.doubles1).filter(x => !state.lineup.doubles2.includes(x.id)),
        doubles2: filterByGamesPlayed(state.lineup.doubles2).filter(x => !state.lineup.doubles1.includes(x.id)),
        doubles3: playersForD3D4(state.lineup.doubles3).filter(x => !state.lineup.doubles4.includes(x.id)),
        doubles4: playersForD3D4(state.lineup.doubles4).filter(x => !state.lineup.doubles3.includes(x.id)),
        doubles5: playersAllowedPlayedClosingRounds(state.lineup.doubles5)
    }
}
const LineupComponent = (props) => {
    return (
        <View>
            <Card>
                <TeamPicker team={props.lineup.doubles1}
                            teamKey='doubles1'
                            players={props.doubles1}
                            label='Doppel 1 (D1)'/>
                <TeamPicker team={props.lineup.doubles2}
                            teamKey='doubles2'
                            players={props.doubles2}
                            label='Doppel 2 (D2)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.singles}
                            teamKey='singles'
                            players={props.players}
                            label='Einzel 1 (E1), Einzel 2 (E2)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles3}
                            teamKey='doubles3'
                            players={props.doubles3}
                            label='Doppel 3 (D3)'/>
                <TeamPicker team={props.lineup.doubles4}
                            teamKey='doubles4'
                            players={props.doubles4}
                            label='Doppel 4 (D4)'/>
            </Card>
            <Card>
                <TeamPicker team={props.lineup.doubles5}
                            teamKey='doubles5'
                            players={props.doubles5}
                            label='Doppel 5 (D5)'/>
            </Card>
        </View>
    );
}

export default connect(mapStateToProps)(LineupComponent);
