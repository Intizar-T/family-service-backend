"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.echo = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
exports.echo = express_1.default.Router();
exports.echo.get("/", (0, cors_1.default)(), async (req, res) => {
    res.status(200).send("echoed...");
});
//# sourceMappingURL=echo.router.js.map