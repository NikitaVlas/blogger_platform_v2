export class SimpleContainer {
    private readonly factories = new Map<symbol, () => unknown>();
    private readonly instances = new Map<symbol, unknown>();
    registerSingleton<T>(token: symbol, factory: () => T): void { this.factories.set(token, factory); }
    resolve<T>(token: symbol): T {
        if (!this.instances.has(token)) {
            const factory = this.factories.get(token);
            if (!factory) throw new Error(`No dependency registered for ${String(token)}`);
            this.instances.set(token, factory());
        }
        return this.instances.get(token) as T;
    }
}
