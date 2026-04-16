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

    http.get(`${BASE_URL}/api/profile`, () => {
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
    }),

    http.get(`${BASE_URL}/api/plan/history`, () => {
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
    }),

    http.get(`${BASE_URL}/api/plan/:planId`, ({ params }) => {
        const { planId } = params;

        if (planId === 'plan-1') {
            return HttpResponse.json({
                id: 'plan-1',
                userId: 'user-123',
                version: 1,
                createdAt: '2026-03-10T09:30:00.000Z',
                planJson: {
                    overview: {
                        goal: 'Build Muscle',
                        frequency: '4 days per week',
                        split: 'full_body',
                        notes: 'Start with fundamentals.',
                    },
                    weeklySchedule: [
                        {
                            day: 'Monday',
                            focus: 'Full Body A',
                            exercises: [
                                { name: 'Goblet Squat', sets: 3, reps: '8-10', rest: '90 sec', rpe: 7 },
                                { name: 'Dumbbell Bench Press', sets: 3, reps: '8-12', rest: '90 sec', rpe: 7 },
                            ],
                        },
                    ],
                    progression: 'Add reps before adding load, then increase weight gradually.',
                },
            });
        }

        return HttpResponse.json(
            { error: 'Plan not found' },
            { status: 404 }
        );
    }),
]
