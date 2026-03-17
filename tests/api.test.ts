import {describe, it, expect} from 'vitest';
import {get} from '../src/lib/api';

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
    
})