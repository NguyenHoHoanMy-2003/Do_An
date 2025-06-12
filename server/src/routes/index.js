//routes/index.js
const authRouters = require('./auth');
// const insertRouter = require('./insert');
// const categoryRouter = require('./category');
const postRouter = require('./postRoutes'); // new
const buildingRouter = require('./buildingRoutes'); // new
const contractRoutes = require('./contractRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');

const initRoutes = (app) => {
  app.use("/auth", authRouters);
  app.use('/properties', postRouter);

  // Định nghĩa route cho tòa nhà (buildings)
  app.use('/buildings', buildingRouter);  

  // Định nghĩa route cho hợp đồng (contracts)
  app.use('/contracts', contractRoutes);
  app.use('/admin', adminRoutes);
  app.use('/users', userRoutes);

  app.use('/', (req, res) => {
    res.send('server on ...');
  });
};

module.exports = initRoutes;
