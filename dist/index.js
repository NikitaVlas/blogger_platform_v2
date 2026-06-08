"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("./setup-app");
// создание приложения
const app = (0, express_1.default)();
(0, setup_app_1.setupApp)(app);
// порт приложения
const PORT = process.env.PORT || 5001;
// запуск приложения
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
