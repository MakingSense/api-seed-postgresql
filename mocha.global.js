import app from './app';

after(function(done) {
  app.apiInstance.on('close', () => done());
  app.apiInstance.close();
});
