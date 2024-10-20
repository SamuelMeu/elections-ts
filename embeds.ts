import { Embed } from './deps.ts'

//permission missing
export const permissionmissing = new Embed()
.setTitle('Permission Missing')
.setDescription('You cannot use this command')
.setColor('RED')

//startelections
export const startelections = new Embed()
.setTitle('Start Elections')
.setDescription('Elections started')
.setColor('GREEN')

export const notinserver = new Embed()
.setTitle('Error')
.setDescription('This command is only available in servers')
.setColor('RED')

export const nochannel = new Embed()
.setTitle('Error')
.setDescription('Please set the channel first')
.setColor('RED')

export const norole = new Embed()
.setTitle('Error')
.setDescription("Please set president's role first")
.setColor('RED')

export const electionsstarted = new Embed()
.setTitle('Hey!')
.setDescription('Elections already started')
.setColor('chocolate')

export const elecmsg = new Embed()
.setTitle('Elections')
.setColor('ORANGE')

//here
export const channelset = new Embed()
.setTitle('Channel Set')
.setColor('GREEN')
.setDescription('This channel is now the election channel')

//messageset
export const messageset = new Embed()
.setTitle('Message Set')
.setColor('GREEN')
.setDescription('You have updated the message sent to the voters')

//role set 
export const roleset = new Embed()
.setTitle('Role Set')
.setColor('GREEN')

//end elections 
export const electionsend = new Embed()
.setTitle('End Elections')
.setColor('GREEN')
.setDescription('Elections ended')

export const tie = new Embed()
.setTitle('Tie')
.setDescription('There is a tie, please revote')
.setColor('YELLOW')

export const won = new Embed()
.setTitle('Winner')
.setColor('GREEN')

export const listresults = new Embed()
.setTitle('Results')
.setColor('ORANGE')

export const noelections = new Embed()
.setTitle('Hey!')
.setDescription('There are no elections running')
.setColor('chocolate')

//vote
export const voteregistered = new Embed()
.setTitle('Vote Registered')
.setDescription('Thank you for voting')
.setColor('lightgreen')

export const voteupdated = new Embed()
.setTitle('Vote Updated')
.setDescription('Your vote has been updated')
.setColor('yellow')


