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

    http.get(`${BASE_URL}/api/plan/history`, ({ request }) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (userId === 'user-123') {
            return HttpResponse.json([
                {
                    id: 'plan-2',
                    userId: 'user-123',
                    version: 2,
                    createdAt: '2026-03-12T09:30:00.000Z',
                    overview: {
                        goal: 'Build Muscle',
                        frequency: '4 days per week',
                        split: 'upper_lower',
                        notes: 'Focus on progressive overload.',
                    },
                    workoutDays: 4,
                    totalExercises: 20,
                },
                {
                    id: 'plan-1',
                    userId: 'user-123',
                    version: 1,
                    createdAt: '2026-03-10T09:30:00.000Z',
                    overview: {
                        goal: 'Build Muscle',
                        frequency: '4 days per week',
                        split: 'full_body',
                        notes: 'Start with fundamentals.',
                    },
                    workoutDays: 4,
                    totalExercises: 18,
                },
            ]);
        }

        return HttpResponse.json([]);
    }),
]
