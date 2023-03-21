"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
exports.user = express_1.default.Router();
const dbClient = new client_1.PrismaClient();
exports.user.post("/", async (req, res) => {
    try {
        const user = req.body;
        const newUser = await dbClient.user.create({
            data: {
                name: user.name,
                nickName: user.nickName,
            },
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.user.put("/:name", async (req, res) => {
    try {
        const user = req.body;
        const newUser = await dbClient.user.update({
            where: {
                name: req.params.name,
            },
            data: {
                nickName: user.nickName,
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
exports.user.get("/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const user = await dbClient.user.findUnique({
            where: {
                name: name,
            },
        });
        console.log(user);
        return res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.user.delete("/:id", async (req, res) => {
    try {
        await dbClient.user.delete({
            where: {
                name: req.params.name,
            },
        });
        return res.status(200).send("success");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
//# sourceMappingURL=user.router.js.map