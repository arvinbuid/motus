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

    http.get(`${BASE_URL}/api/profile`, ({ request }) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (userId === 'user-123') {
            return HttpResponse.json({
                userId: 'user-123',
                goal: 'bulk',
                experience: 'intermediate',
                daysPerWeek: 4,
                sessionLength: 60,
                equipment: 'full_gym',
                injuries: 'None',
                preferredSplit: 'upper_lower',
                updatedAt: '2026-03-10T10:00:00.000Z',
            });
        }

        return HttpResponse.json(
            { error: 'Profile not found' },
            { status: 404 }
        );
    }),
]
