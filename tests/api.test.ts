import {describe, it, expect} from 'vitest';
import {ApiError, api, get} from '../src/lib/api';

describe('get helper (msw)', () => {
    it('returns data when request is okay', async () => {
        const result = await get('/hello');

        expect(result).toEqual({data: 'hello motus'})
    });

    it('throws API error message', async () => {
        await expect(get('/error')).rejects.toThrow('Something went wrong');
    });

    it('throws default error if JSON parsing fails', async () => {
        await expect(get('/bad-request')).rejects.toThrow('Request failed');
    });

    it('maps profile payloads into the frontend shape', async () => {
        const result = await api.getProfile('user-123');

        expect(result).toEqual({
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
    });

    it('preserves HTTP status in ApiError for profile requests', async () => {
        await expect(api.getProfile('missing-user')).rejects.toMatchObject<ApiError>({
            name: 'ApiError',
            status: 404,
            message: 'Profile not found',
        });
    });

    it('maps plan history payloads into the frontend shape', async () => {
        const result = await api.getPlanHistory('user-123');

        expect(result).toEqual([
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
    });

    it('maps a historical training plan payload into the frontend shape', async () => {
        const result = await api.getTrainingPlan('user-123', 'plan-1');

        expect(result).toEqual({
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
        });
    });
    
})
