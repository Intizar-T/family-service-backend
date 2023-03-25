"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
exports.user = express_1.default.Router();
const dbClient = new client_1.PrismaClient({
    datasources: { db: { url: "file:./dev.db" } },
});
exports.user.post("/", async (req, res) => {
    try {
        const { device, name } = req.body;
        const newUser = await dbClient.user.create({
            data: {
                device: device,
                name: name,
            },
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.user.put("/:device_name", async (req, res) => {
    try {
        const { device, name } = req.body;
        const { device: oldDevice, name: oldName, } = JSON.parse(req.params.device_name);
        const newUser = await dbClient.user.update({
            where: {
                device_name: {
                    device: oldDevice,
                    name: oldName,
                },
            },
            data: {
                device: device,
                name: name,
            },
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.user.get("/", async (req, res) => {
    try {
        const users = await dbClient.user.findMany();
        return res.status(200).send(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.user.get("/:device_name", async (req, res) => {
    try {
        const { device, name } = JSON.parse(req.params.device_name);
        const user = await dbClient.user.findUnique({
            where: {
                device_name: {
                    device,
                    name,
                },
            },
        });
        console.log(user);
        return res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.user.delete("/:device_name", async (req, res) => {
    const { device, name } = JSON.parse(req.params.device_name);
    try {
        await dbClient.user.delete({
            where: {
                device_name: {
                    device,
                    name,
                },
            },
        });
        return res.status(200).send("success");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
//# sourceMappingURL=user.router.js.map