import { test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

import { pool } from '../config/db.js';

before(() => {
    // Safety guard: never wipe a database that isn't a test one
    if(!process.env.DATABASE_URL?.includes('test')) {
        throw new Error('Refusing to run tests on a non-test database');
    }
});

beforeEach(async () => {
    await pool.query('TRUNCATE users RESTART IDENTITY');
});

after(async () => {
    await pool.end();
});

const validUser = {
    name: 'Test',
    email: 'test@example.com',
    password: '123456'
};

test('registers a new user', async () => {
    const res = await request(app).post('/api/register').send(validUser);

    assert.equal(res.status, 201);
    assert.equal(res.body.user.email, validUser.email);
    assert.equal(res.body.user.password, undefined); // never returned
});

test('rejects a duplicate email', async () => {
    await request(app).post('/api/register').send(validUser);

    const res = await request(app).post('/api/register').send(validUser);

    assert.equal(res.status, 409);
});

test('rejects a missing password', async() => {
    const res = await request(app)
        .post('/api/register')
        .send({
            name: 'Test',
            email: 'test@example.com'
        });
    
    assert.equal(res.status, 400);
});