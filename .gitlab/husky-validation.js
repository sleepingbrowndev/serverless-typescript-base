const { execSync, exec } = require("child_process");
let supportsColor = { stdout: true };

try {
  // eslint-disable-next-line global-require
  supportsColor = require("supports-color");
} catch (error) {
  // DO NOTHING
  // on MODULE_NOT_FOUND when installed by pnpm
}

const colorSupported = supportsColor.stdout;

const YELLOW = colorSupported ? "\x1b[1;33m" : "";
const GRAY = colorSupported ? "\x1b[0;37m" : "";
const RED = colorSupported ? "\x1b[0;31m" : "";
const GREEN = colorSupported ? "\x1b[0;32m" : "";
const BLUE = colorSupported ? "\x1b[1;34m" : "";
const BGBLUE = colorSupported ? "\x1b[1;34;44m" : "";
const BGYELLOW = colorSupported ? "\x1b[1;33;43m" : "";
const BGGREEN = colorSupported ? "\x1b[1;32;42m" : "";

/** End Of Style, removes all attributes (formatting and colors) */
const EOS = colorSupported ? "\x1b[0m" : "";
const BOLD = colorSupported ? "\x1b[1m" : "";

const pwd = execSync("pwd", { encoding: "utf-8" });

/* Checking if the script is running from CICD or not.
 * If it is running from CICD, then we skip husky installation
 */

if (
  process.env?.CI_JOB_STAGE ||
  pwd.includes("/builds/ecv-asean/cloud-native-development")
) {
  console.log("CICD detected, skipping husky installation...");
} else {
  console.log("");
  console.log(
    `${BGBLUE}INFO${EOS} This is not from CICD, checking for husky installation...`
  );
  try {
    const rootDirlist = execSync("cd ../user/ && ls", { encoding: "utf-8" });

    if (rootDirlist.includes("node_modules")) {
      const nodeModulesList = execSync("cd ../user/node_modules && ls", {
        encoding: "utf-8",
      });

      let isFinished = false;
      let isForwardSlashNext = true;
      let isDashNext = false;
      let isBackSlashNext = false;
      let isStraightLineNext = false;
      if (!nodeModulesList.includes("husky")) {
        console.log(
          `${BGBLUE}ENFORCING${EOS} Husky is not installed yet, installing it now to enfore commit message format...`
        );
        console.log(`${YELLOW}Please wait...${EOS}`);

        const result = exec("cd ../user/ && npm install husky --save-dev", {
          encoding: "utf-8",
          stdio: "pipe",
        });

        result.on("close", () => {
          isFinished = true;
        });

        const timer = setInterval(() => {
          if (isFinished) {
            console.log(
              `${BGGREEN}SUCCESS${EOS} Successfully installed husky!`
            );
            process.exit(0);
          } else {
            if (isForwardSlashNext) {
              process.stdout.write("\r\x1b[K");
              process.stdout.write(`/`);
              isForwardSlashNext = !isForwardSlashNext;
              isDashNext = !isDashNext;
            } else if (isDashNext) {
              process.stdout.write("\r\x1b[K");
              process.stdout.write(`-`);
              isDashNext = !isDashNext;
              isBackSlashNext = !isBackSlashNext;
            } else if (isBackSlashNext) {
              process.stdout.write("\r\x1b[K");
              process.stdout.write(`\\`);
              isBackSlashNext = !isBackSlashNext;
              isStraightLineNext = !isStraightLineNext;
            } else {
              process.stdout.write("\r\x1b[K");
              process.stdout.write(`|`);
              isForwardSlashNext = !isForwardSlashNext;
              isStraightLineNext = !isStraightLineNext;
            }
          }
        }, 100);
      } else {
        console.log(
          `${BGBLUE}INFO${EOS} Husky is already installed, skipping...`
        );
        console.log(`${BGBLUE}INFO${EOS} Continuing the deployment...`);
        process.exit(0);
      }
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.log(
      `${BGYELLOW}WARNING${EOS} Couldn't install husky, please run 'npm install' manually`
    );
    console.log(error);
    process.exit(0);
  }
}
