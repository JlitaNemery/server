"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
const bearer = process.env.BEARER;
const serverAddress = process.env.SERVER_ADDRESS;
const clientAddress = process.env.CLIENT_ADDRESS;
app.use((0, cors_1.default)({ origin: clientAddress }));
app.get('/:query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.params;
        if (query) {
            const movieRes = yield axios_1.default.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, {
                headers: {
                    Authorization: 'Bearer ' + bearer
                }
            });
            const titles = movieRes.data['results'].map((item) => {
                const titleItem = {
                    title: item.title,
                    imgUrl: item.poster_path,
                    voteAverage: item.vote_average,
                    voteCount: item.vote_count
                };
                return titleItem;
            });
            res.send(titles);
        }
        else {
            res.status(400);
        }
    }
    catch (e) {
        res.status(500);
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at ${serverAddress}:${port}`);
});
