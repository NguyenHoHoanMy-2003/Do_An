//routes/index.js
const authRouters = require('./auth');
// const insertRouter = require('./insert');
// const categoryRouter = require('./category');
const postRouter = require('./postRoutes'); // new
const buildingRouter = require('./buildingRoutes'); // new
const contractRoutes = require('./contractRoutes');
const userRoutes = require('./userRoutes'); // Thêm dòng này
const userPublicRoutes = require('../routes/userPublicRoutes');

const initRoutes = (app) => {
  //   app.use('/api/v1/auth', authRouter);
  //   app.use('/api/v1/insert', insertRouter);
  //   app.use('/api/v1/category', categoryRouter);
  //   app.use('/api/v1/posts', postRouter); //  API bài đăng
  // Định nghĩa route cho bài đăng (properties)
  app.use("/auth", authRouters);
  app.use('/properties', postRouter);

  // Định nghĩa route cho tòa nhà (buildings)
  app.use('/buildings', buildingRouter);  // new building routes

  // Định nghĩa route cho hợp đồng (contracts)
  app.use('/contracts', contractRoutes);

  // Định nghĩa route cho người dùng (users)
  app.use('/users', userRoutes); // Thêm dòng này
  app.use('/users', userPublicRoutes);

  return app.use('/', (req, res) => {
    res.send('server on ...');
  });
};

module.exports = initRoutes;
