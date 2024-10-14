import {DB} from './deps.ts'
const db = new DB('votes.sqlite')
db.query(`CREATE TABLE IF NOT EXISTS guilds(id INTEGER PRIMARY KEY AUTOINCREMENT, guildID TEXT, channelID TEXT, message TEXT, elections BOOLEAN, role TEXT)`)

export function setGuild(id: string) {
    db.query(`INSERT INTO guilds (guildID, channelID, message, elections, role) VALUES (?, ?, ?, ?, ?)`, [id, 'none', 'as a member of the guild, it is your duty to vote. Please do so using the command /vote', false, 'none'])
}
export function getGuild(id: string) {
    return db.query(`SELECT * FROM guilds WHERE guildID = ?`, [id]).map(row => ({
        id: row[0],
        guildID: row[1],
        channelID: row[2],
        message: row[3],
        elections: row[4],
        role: row[5]
    }))
}
function check(id:string) {
    if(db.query(`SELECT * FROM guilds WHERE guildID = ?`, [id]).length == 0) {
        setGuild(id)
        return false
    } return true 
}
export function setChannel(guildId: string, channelId: string) {
    check(guildId)
    db.query(`UPDATE guilds SET channelID = ? WHERE guildID = ?`, [channelId, guildId])
}
//NOTE: IL Y A UNE POSSIBILITE DE SQL INJECTION ICI MAIS C PAS TROP GRAVE
export function setMessage(guildId: string, message: string) {
    check(guildId)
    db.query(`UPDATE guilds SET message = ? WHERE guildID = ?`, [message, guildId])
}
export function switchElections(guildId: string) {
    db.query(`UPDATE guilds SET elections = NOT elections WHERE guildID = ?`, [guildId])
}
export function setRole(guildId: string, role: string) {
    check(guildId)
    db.query(`UPDATE guilds SET role = ? WHERE guildID = ?`, [role, guildId])
}