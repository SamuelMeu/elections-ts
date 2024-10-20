type vote = {
    userid: string, 
    vote: string
}
type Ballot = {
    guild: string,
    votes: vote[]
}
const bal:Ballot = {guild: '123', votes: [{userid: '123', vote: '456'}, {userid: '456', vote: '123'}, {userid: '123', vote: '456'}, {userid: '456', vote: '123'}, {userid: '456', vote: '13'}]}
const map = bal.votes.reduce((acc, e) => acc.set(e.vote, (acc.get(e.vote) || 0) + 1), new Map());
const sorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
//check if there is a tie
if(sorted.values().toArray()[0] == sorted.values().toArray()[1]) console.log('There is a tie') 
//winner
const winner = sorted.keys().next().value