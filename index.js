import "dotenv/config";
import { Client } from "ssh2";

const ssh = new Client();

ssh.on("ready", () => {
    console.log("Connected to server.");
    ssh.end();
});

ssh.on("error", (err) => {
    console.error(err);
});

ssh.connect({
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT),
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD
});