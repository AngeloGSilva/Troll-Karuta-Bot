// Require the necessary discord.js classes
const { SelectMenuOption } = require('@discordjs/builders');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { IdChannel } = require('./config.json');
const { clientId } = require('./config.json');

//Teste.. para ler nomes dos drops
async function getName(){
    const { createWorker } = require('tesseract.js');
    const worker = createWorker();
    const rectangles = [
        {
            left: 54,
            top: 60,
            width: 178,
            height: 42,
        },
        {
            left: 327,
            top: 60,
            width: 178,
            height: 42,
        },
        {
            left: 603,
            top: 61,
            width: 178,
            height: 42,
        },
    ];

    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const values = [];
        for (let i = 0; i < rectangles.length; i++) {
            const { data: { text } } = await worker.recognize('unknown.png', { rectangle: rectangles[i] });
            values.push(text);
        }
        console.log(values);
        await worker.terminate();
    })();
    return true;
}

//normal sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a new client instance
const client = new Discord.Client({ 
    intents:[
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_MESSAGE_REACTIONS"
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.login(token);

client.once('ready', () => {
    getName();//ignore
	console.log('Pronto');
});

const filter = (reaction, user) => {
	return ['1️⃣', '2️⃣','3️⃣'].includes(reaction.emoji.name) && user.id === interaction.user.id;
};

//generate a random 6 digite code for the card
function generateP() {
    var pass = '';
    var str = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (i = 1; i <= 6; i++) {
        var char = Math.floor(Math.random()
                    * str.length + 1);
        pass += str.charAt(char)
    }
    return pass;
}


client.on('messageCreate', async(message) =>{
    var x = 0
    await sleep(5);
    console.log(message.content);
    if(message.channel.id === IdChannel && message.author.id === clientId && message.content === 'kd'){
        console.log("Entrou");
        //await sleep(20000);
        let m = await client.channels.cache.get(IdChannel).send({ content: "I'm dropping 3 cards since this server is currently active!", files: [{ attachment: 'beidou.png'}]});//img drop file... or URL
        await m.react('1️⃣');
        await m.react('2️⃣');
        await m.react('3️⃣');
    
        await sleep(5);
        const filter = (reaction, user) => {
            return reaction.emoji.name === '2️⃣' && user.id === interaction.user.id;
        };
      
        await sleep(8);
        client.on('messageReactionAdd', (reaction,user)=> {
            if(x === 0){
                const {message} = reaction
                const {guild} = message
                const member = guild.members.cache.get(user.id);
                //console.log("${member.user.username}");
                x = 1;
                console.log(x);
                client.channels.cache.get(IdChannel).send("<@" + member.user.id + "> took the Beidou card `" + generateP() + "`! Wow, it appears to be in mint condition!"); //Name the card **BEIDOU**
            } 
        })
    }
})
