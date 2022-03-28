export class Litera5ApiError extends Error {
	constructor(message: string, error?: Error) {
		super(message);
		this.name = 'Litera5ApiError';
		this.message = message || '';
		this.stack = error?.stack;
	}
}
