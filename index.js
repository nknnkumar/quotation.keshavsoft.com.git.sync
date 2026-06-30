import "dotenv/config";
import { Client } from "ssh2";

const ssh = new Client();

ssh.on("ready", () => {
    console.log("Connected.");

    ssh.exec(`cd ${process.env.SSH_REPO_PATH} && git pull`,
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