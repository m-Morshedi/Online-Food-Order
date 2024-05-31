import ExpressApp from './services/ExpressApp';
import express from 'express';

const startServer = async () => {
  const app = express();

  await ExpressApp(app);
  app.listen(process.env.PORT, () => {
    console.clear();
    console.log(`server is up and running`);
  });
};

startServer();
