// Imports
import { Application } from "./deps.ts";
import api from "./router.ts";

// Create a new server application.
const app = new Application(Deno.args[0] ?? `0.0.0.0:${Deno.env.get("PORT") ?? 3000}`, { allowWebSocket: false });

// Use the application api router.
app.use(api);

// Show the server origin.
console.log(app.origin);

// Start listening for incoming requests.
await app.start();
