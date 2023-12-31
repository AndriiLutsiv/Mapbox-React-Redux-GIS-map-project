import { server } from 'mock/server';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// Mock the createObjectURL function before running tests
window.URL.createObjectURL = jest.fn();
// Establish API mocking before all tests.
beforeAll(() => {
    server.listen();
    // Mock the createObjectURL function before running tests
    window.URL.createObjectURL = jest.fn();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
    server.resetHandlers();
    // This is the solution to clear RTK Query cache after each test
    // store.dispatch(apiSlice.util.resetApiState());
});

// Clean up after the tests are finished.
afterAll(() => server.close());
