const request = require('supertest');
const app = require('../server.js');

describe('Auth API Tests', () => {
  it('should login a user successfully', async () => {
    const user = {
      username: "MenteeA",
      email: "mentee1@gmail.com",
      password: "123456"
    };

    const response = await request(app)
      .post('/auth/login')
      .send(user);

    expect(response.statusCode).toBe(200);
  });
});
