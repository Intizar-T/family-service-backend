"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
exports.store = express_1.default.Router();
const dbClient = new client_1.PrismaClient({
    datasources: { db: { url: "file:./dev.db" } },
});
exports.store.get("/", (0, cors_1.default)(), async (req, res) => {
    try {
        const products = await dbClient.product.findMany();
        res.status(200).send(products);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.store.get("/:id", async (req, res) => {
    try {
        const product = await dbClient.product.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include: {
                boughtUser: true,
                createdUser: true,
            },
        });
        res.status(200).send(product);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.store.post("/", async (req, res) => {
    try {
        const { createdUserName, name, amount } = req.body;
        const product = await dbClient.product.create({
            data: {
                name,
                createdUserName,
                amount,
            },
        });
        res.status(200).send(product);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.store.put("/:id", async (req, res) => {
    try {
        const { boughtUserName, isBought, name, amount } = req.body;
        const product = await dbClient.product.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name,
                boughtUserName,
                isBought,
                amount,
            },
        });
        res.status(200).send(product);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.store.delete("/:id", async (req, res) => {
    try {
        await dbClient.product.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.status(200).send("success");
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
//# sourceMappingURL=store.router.js.map