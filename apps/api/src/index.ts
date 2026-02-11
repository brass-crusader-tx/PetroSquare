import app from './app';
import { env } from './config/env';

const port = env.PORT;

app.listen(port, () => {
  console.log(`API Server running on port ${port} in ${env.NODE_ENV} mode`);
});
