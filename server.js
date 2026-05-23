import { createServer } from './dist/server/index.js';

const port = process.env.PORT || 3000;

createServer().then((server) => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});