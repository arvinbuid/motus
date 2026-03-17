import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3001'

export const handlers = [
    // success case
    http.get(`${BASE_URL}/api/hello`, () => {
        return HttpResponse.json({ data: 'hello motus'})
    }),

    // error case with message
    http.get(`${BASE_URL}/api/error`, () => {
        return HttpResponse.json(
            { error: 'Something went wrong' },
            { status: 400 }
        );
    }),

    // ❌ error with invalid JSON
    http.get(`${BASE_URL}/api/bad-request`, () => {
        return new HttpResponse(null, { status: 500 });
    }),
]