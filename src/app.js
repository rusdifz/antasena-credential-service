"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const credential_1 = __importDefault(require("./credential"));
const app = (0, express_1.default)();
const port = process.env.PORT_APP;
console.log('port', port);
// const consulIndex = {
//     id: 'Credential Service', 
//     name: 'credential-service', 
//     port: port
// }
// consulService.setConsul(consulIndex)
app.use('/credential', credential_1.default);
app.listen(port, () => console.log(`Server is listening on port ${port}`));
//jangan lupa build rm -rf src/ && tsc -p .
