let supportsColor = { stdout: true };
const fs = require('fs');

try {
    // eslint-disable-next-line global-require
    supportsColor = require('supports-color');
} catch (error) {
    // DO NOTHING
    // on MODULE_NOT_FOUND when installed by pnpm
}

const colorSupported = supportsColor.stdout;

const YELLOW = colorSupported ? '\x1b[1;33m' : '';
const GRAY = colorSupported ? '\x1b[0;37m' : '';
const RED = colorSupported ? '\x1b[0;31m' : '';
const GREEN = colorSupported ? '\x1b[0;32m' : '';
const BLUE = colorSupported ? '\x1b[1;34m' : '';

/** End Of Style, removes all attributes (formatting and colors) */
const EOS = colorSupported ? '\x1b[0m' : '';
const BOLD = colorSupported ? '\x1b[1m' : '';

const commitMsgContent = fs.readFileSync('.git/COMMIT_EDITMSG', 'utf-8');
const msg = getFirstLine(commitMsgContent).replace(/\s{2,}/g, ' ');
const branchName = require('child_process')
    .execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' })
    .split('\n')[0];
const correctCommitMsgFormat = [
    '[<Project Code>-<Ticket Number>] <Message>',
    '<Project Code>-<Ticket Number>: <Message>',
    '<Project Code>-<Ticket Number> <Message>',
    '[hotfix] <Message>',
];
const exampleMsg = [
    '[zbb-123] i hope this will fix it',
    'zbb-123: i dont know, i just code',
    'zbb-123 Dont Ask Me, I Have No Idea Why This Works Either',
    '[hotfix] see last commit',
];

const successMsgs = [
    `\n${GREEN}*********** Succesfully commit changes. Goodjob! ***********${EOS}`,
    `\n${GREEN}*********** All good! Powerrr! ***********${EOS}`,
    `\n${GREEN}*********** omg what have I done? jk, All good! ***********${EOS}`,
    `\n${GREEN}*********** May the Force be with you ***********${EOS}`,
    `\n${GREEN}*********** “It's alive! It's alive!” - Frankenstein, 1931 ***********${EOS}`,
    `\n${GREEN}*********** “I'll be back.” - The Terminator, 1984 ***********${EOS}`,
    `\n${GREEN}*********** Magic Mirror on the wall, who is the fairest one of all? ***********${EOS}`,
    `\n${GREEN}*********** "Bond. James Bond." ***********${EOS}`,
    `\n${GREEN}*********** "They may take our lives, but they'll never take our freedom!" ***********${EOS}`,
    `\n${GREEN}*********** To infinity and beyond! ***********${EOS}`,
    `\n${GREEN}*********** ( ͡• ͜ʖ ͡•) niceeeee ~ ***********${EOS}`,
    `\n${GREEN}*********** Another oneeeee! ***********${EOS}`,
    `\n${GREEN}*********** We Had To Use Dark Magic To Make This Work ***********${EOS}`,
    `\n${GREEN}*********** Never gonna give you up, Never gonna let you down ***********${EOS}`,
    `\n${GREEN}*********** Too lazy to write descriptive success message ***********${EOS}`,
    `\n${GREEN}*********** hehehehhe nice ***********${EOS}`,
    `\n${GREEN}*********** “You is kind. You is smart. You is important.” ***********${EOS}`,
    `\n${GREEN}*********** Lorem ipsum dolor sit amet, consectetur adipiscing... ***********${EOS}`,
    `\n${GREEN}*********** My mama always said life was like a box of chocolates. You never know what you're gonna get. ***********${EOS}`,
    `
█▄█ ▄▀█ █░█ █▀█ █▀█ █
░█░ █▀█ █▀█ █▄█ █▄█ ▄`,
    `
██████╗░░█████╗░░██╗░░░░░░░██╗███████╗██████╗░
██╔══██╗██╔══██╗░██║░░██╗░░██║██╔════╝██╔══██╗
██████╔╝██║░░██║░╚██╗████╗██╔╝█████╗░░██████╔╝
██╔═══╝░██║░░██║░░████╔═████║░██╔══╝░░██╔══██╗
██║░░░░░╚█████╔╝░░╚██╔╝░╚██╔╝░███████╗██║░░██║
╚═╝░░░░░░╚════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚═╝░░╚═╝`,
];

const failMsgs = [
    `\n${RED}************* Invalid Git Commit Message *************${EOS}`,
    `\n${RED}************* omg what have I done? :( *************${EOS}`,
    `\n${RED}************* Houston, we have a problem. *************${EOS}`,
    `\n${RED}************* You can't handle the truth! *************${EOS}`,
    `\n${RED}************* “I am your father.” *************${EOS}`,
    `\n${RED}************* “Hasta la vista, baby.” *************${EOS}`,
    `\n${RED}************* Something bad happened *************${EOS}`,
    `\n${RED}************* Catastrophic failure *************${EOS}`,
    `\n${RED}************* Really????? ( ˘︹˘ ) *************${EOS}`,
    `\n${RED}************* Dont cry, you can commit again with the correct format *************${EOS}`,
    `\n${RED}************* The operation completed successfully, which in this case, fail :p *************${EOS}`,
    `\n${RED}************* Well, nobody's perfect. Please try again.” *************${EOS}`,
    `\n${RED}************* Bu yao zhi yang :( ” *************${EOS}`,
    `\n${RED}************* I'm sorry. I'm afraid I can't do that. *************${EOS}`,
    `\n${RED}************* We Had To Use Dark Magic To Make This Work, but we still fail :( *************${EOS}`,
    `\n${RED}************* (╯°□°）╯︵ ┻━┻ *************${EOS}`,
    `\n${RED}************* ┻━┻ ︵ヽ('Д')ﾉ︵ ┻━┻ *************${EOS}`,
    `\n${RED}************* (ﾉಥ益ಥ）ﾉ ┻━┻ *************${EOS}`,
    `
░██╗░░░░░░░██╗██╗░░██╗██╗░░░██╗██╗░░░██╗██╗░░░██╗██╗░░░██╗
░██║░░██╗░░██║██║░░██║╚██╗░██╔╝╚██╗░██╔╝╚██╗░██╔╝╚██╗░██╔╝
░╚██╗████╗██╔╝███████║░╚████╔╝░░╚████╔╝░░╚████╔╝░░╚████╔╝░
░░████╔═████║░██╔══██║░░╚██╔╝░░░░╚██╔╝░░░░╚██╔╝░░░░╚██╔╝░░
░░╚██╔╝░╚██╔╝░██║░░██║░░░██║░░░░░░██║░░░░░░██║░░░░░░██║░░░
░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝░░░╚═╝░░░░░░╚═╝░░░░░░╚═╝░░░░░░╚═╝░░░`,
    `
██████╗░██████╗░██╗░░░██╗██╗░░██╗██╗░░██╗
██╔══██╗██╔══██╗██║░░░██║██║░░██║██║░░██║
██████╦╝██████╔╝██║░░░██║███████║███████║
██╔══██╗██╔══██╗██║░░░██║██╔══██║██╔══██║
██████╦╝██║░░██║╚██████╔╝██║░░██║██║░░██║
╚═════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝`,
];

const pattern = new RegExp(
    '\\[?zbb-|ZBB-|Zbb-|hotfix|HOTFIX|Hotfix[0-9]+\\]? ?(-?|:?) .+'
);

const result = pattern.test(msg);
const commitResultMsg = result ? 'SUCCESS' : 'FAILED';

if (result) {
    console.log(successMsgs[Math.floor(Math.random() * successMsgs.length)]);
    console.log(`${BOLD}Commit result:${EOS} ${GREEN}${commitResultMsg}${EOS}`);
    console.log(`${BOLD}Current branch:${EOS} ${branchName}`);
    console.log(`${BOLD}Commit message:${EOS} ${BLUE}${msg}${EOS}\n`);

    process.exit(0);
} else {
    console.log(failMsgs[Math.floor(Math.random() * failMsgs.length)]);

    console.log(`${BOLD}Commit result:${EOS} ${RED}${commitResultMsg}${EOS}`);
    console.log(`${BOLD}Current branch:${EOS} ${branchName}`);
    console.log(`${BOLD}Commit message:${EOS} ${RED}${msg}${EOS}`);

    console.log(`${BOLD}Correct format:${EOS}`);
    correctCommitMsgFormat.forEach((format, i) => {
        console.log(`  ${i + 1}) ${GREEN}${format}${EOS}`);
    });

    console.log(`${BOLD}Example:${EOS}`);
    exampleMsg.forEach((example, i) => {
        console.log(`  ${i + 1}) ${BLUE}${example}${EOS}`);
    });
    console.log();
    process.exit(1);
}

/**
 * It takes a buffer and returns the first line of the buffer as a string
 * @param buffer - The buffer to read from.
 * @returns The first line of the buffer.
 */
function getFirstLine(buffer) {
    return buffer.toString().split('\n').shift();
}
