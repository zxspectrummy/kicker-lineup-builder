class Player {
    constructor(name) {
        this.name = name;
        this.gamesPlayed = 0;
    }
}

class DoublesTeam {
    constructor(players) {
        this.players = new Set(players);
    }
}

const combinations = (a, min) => {
    const fn = function (n, src, got, all) {
        if (n === 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (let j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
    };
    const all = [];
    fn(min, a, [], all);
    all.push(a);
    return all;
};


class Lineup {
    constructor(players) {
        this.players = players;
        this.singles = [];
        this.firstDoubles = [];
        this.secondDroubles = [];
        this.lastDouble = {};
    }

    getAllPairs() {
        return combinations(this.players, 4);
    }
}

export default Lineup;
