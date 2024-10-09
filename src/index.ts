import express, { Request, Response } from "express";
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

type EnvVal = string | undefined;

type Title = {
    title: string
    imgUrl: string
    voteAverage: number
    voteCount: number
}

const app = express();

dotenv.config();
const port: EnvVal = process.env.PORT;
const bearer: EnvVal = process.env.BEARER;
const serverAddress: EnvVal = process.env.SERVER_ADDRESS;
const clientAddress: EnvVal = process.env.CLIENT_ADDRESS;

app.use(cors({origin: clientAddress}))

app.get('/:query', async (req: Request, res: Response) => {
    try {
        const { query } = req.params;
        if (query) {
            const movieRes = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, {
                headers: {
                    Authorization: 'Bearer ' + bearer
                }
            });
            const titles: Title[] = movieRes.data['results'].map((item: any) => {
                const titleItem: Title = {
                    title: item.title,
                    imgUrl: item.poster_path,
                    voteAverage: item.vote_average,
                    voteCount: item.vote_count
                };
                return titleItem;
            })
            res.send(titles);
        } else {
            res.status(400);
        }
    } catch (e) {
        res.status(500);
    }

});

app.listen(port, () => {
    console.log(`[server]: Server is running at ${serverAddress}:${port}`);
});