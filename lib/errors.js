"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litera5ApiError = void 0;
class Litera5ApiError extends Error {
    constructor(message, error) {
        super(message);
        this.name = 'Litera5ApiError';
        this.message = message || '';
        this.stack = error === null || error === void 0 ? void 0 : error.stack;
    }
}
exports.Litera5ApiError = Litera5ApiError;
