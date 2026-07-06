import "dotenv/config";
import { Client } from "ssh2";

const ssh = new Client();

const action = process.argv[2] || "pull";

let command = `cd ${process.env.SSH_REPO_PATH} && git pull`;

if (action === "install") {
    command += " && npm install";
} else if (action === "restart") {
    command += " && npm install";
    const restartCmd = process.env.SSH_RESTART_COMMAND || "pm2 restart all";
    command += ` && ${restartCmd}`;
} else if (action === "pull-restart") {
    const restartCmd = process.env.SSH_RESTART_COMMAND || "pm2 restart all";
    command += ` && ${restartCmd}`;
}

console.log(`Executing command on remote: ${command}`);

ssh.on("ready", () => {
    console.log("Connected.");

    ssh.exec(command,
        (err, stream) => {
            if (err) throw err;

            stream.on("data", (data) => {
                console.log(data.toString());
            });

            stream.stderr.on("data", (data) => {
                console.error(data.toString());
            });

            stream.on("close", () => {
                ssh.end();
            });
        });
});

ssh.on("error", console.error);

ssh.connect({
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT),
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD
});