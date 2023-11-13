import { rest } from 'msw';
export const data = {
    "access_token": "dummy_token",
    "token_type": "string"
};

export const oAuth = () => {
    return rest.post(`${process.env.REACT_APP_API_URL}/oauth/token`, (req: any, res: any, ctx: any) => {
        return res(ctx.json(data));
    })
}