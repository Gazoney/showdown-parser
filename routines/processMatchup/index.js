/**
 *
 * processMatchup
 *
 * Iterate over provided team from a log file. This
 * function is called from a MatchupProcessor worker,
 * and is expected to write its data to the worker's
 * master data object
 *
 * This is where teams will be broken up for matchup
 * data to plug into a ML classifier
 *
 */

let calculateWeight   = require('../processTeam/calculateWeight')

module.exports = function(logData, workerData, cutoff, outcome) {
  // Calculate the pokemon's weighting based on player rating
  let p1wl = 'tie'
  let p2wl = 'tie'
  if(outcome == 'p1') {
    p1wl = 'win'
    p2wl = 'loss'
  } else if(outcome == 'p2') {
    p1wl = 'loss'
    p2wl = 'win'
  }
  let weightp1 = calculateWeight(logData['p1rating'], cutoff, p1wl)
  let weightp2 = calculateWeight(logData['p2rating'], cutoff, p2wl)

  // If either player is below our cutoff, ignore match
  if(weightp1 < 0.5 || weightp2 < 0.5)
    return

  // Grab players' teams
  let teamp1 = logData['p1team']
  let teamp2 = logData['p2team']

  let team1Arr = []
  for(let i = 0;i<teamp1.length;i++) {
    // Lower case the species name, because there are multiple
    // versions of capitalization in the logs
    if(Pokedex.BattlePokedex[teamp1[i]['species'].toLowerCase().replace(/\-|\s/g,'')] == undefined)
      continue
    team1Arr.push(Pokedex.BattlePokedex[teamp1[i]['species'].toLowerCase().replace(/\-|\s/g,'')].num)
  }
  let team2Arr = []
  for(let i = 0;i<teamp2.length;i++) {
    // Lower case the species name, because there are multiple
    // versions of capitalization in the logs
    if(Pokedex.BattlePokedex[teamp2[i]['species'].toLowerCase().replace(/\-|\s/g,'')] == undefined)
      continue
    team2Arr.push(Pokedex.BattlePokedex[teamp2[i]['species'].toLowerCase().replace(/\-|\s/g,'')].num)
  }

  let team1Comb = getCombinations(team1Arr,3)
  let team2Comb = getCombinations(team2Arr,3)

  let p1outcome = (outcome == 'p1')?1:(outcome == 'p2')?0:-1
  let p2outcome = (outcome == 'p2')?1:(outcome == 'p1')?0:-1

  for(let key in team1Comb) {
    team1Comb[key].sort()
    for(let key2 in team2Comb) {
      team2Comb[key2].sort()
      workerData.push({
        a1:team1Comb[key][0],
        a2:team1Comb[key][1],
        a3:team1Comb[key][2],
        d1:team2Comb[key2][0],
        d2:team2Comb[key2][1],
        d3:team2Comb[key2][2],
        o: p1outcome
      })
      workerData.push({
        a1:team2Comb[key2][0],
        a2:team2Comb[key2][1],
        a3:team2Comb[key2][2],
        d1:team1Comb[key][0],
        d2:team1Comb[key][1],
        d3:team1Comb[key][2],
        o: p2outcome
      })
    }
  }
}

function getCombinations(chars, outputLength) {
  var result = []
  var f = function(prefix, chars) {
    for (var i = 0; i < chars.length; i++) {
      if((prefix.concat(chars[i])).length == outputLength)
        result.push(prefix.concat(chars[i]))
      f(prefix.concat(chars[i]), chars.slice(i + 1))
    }
  }
  f([], chars)
  return result
}
