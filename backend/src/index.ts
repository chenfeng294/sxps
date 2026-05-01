import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler, notFound } from './common/middleware/errorHandler';
import { tenantMiddleware } from './common/middleware/tenant';
import { router as authRouter } from './modules/auth';
import productRouter from './modules/product/routes';
import orderRouter from './modules/order/routes';
import purchaseRouter from './modules/purchase/routes';
import warehouseRouter from './modules/warehouse/routes';
import sortingRouter from './modules/sorting/routes';
import deliveryRouter from './modules/delivery/routes';
import financeRouter from './modules/finance/routes';
import reportRouter from './modules/report/routes';
import customerRouter from './modules/customer/routes';
import marketingRouter from './modules/marketing/routes';
import systemRouter from './modules/system/routes';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(tenantMiddleware);

app.use('/api/v1/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Fresh Delivery API is running!',
    data: {
      timestamp: new Date().toISOString(),
      tenantId: req.tenantId,
    },
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/purchases', purchaseRouter);
app.use('/api/v1/warehouse', warehouseRouter);
app.use('/api/v1/sorting', sortingRouter);
app.use('/api/v1/delivery', deliveryRouter);
app.use('/api/v1/finance', financeRouter);
app.use('/api/v1/report', reportRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/marketing', marketingRouter);
app.use('/api/v1/system', systemRouter);

app.use(notFound);
app.use(errorHandler);

const startServer = () => {
  try {
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📚 API Docs: http://localhost:${config.port}/api/v1/health`);
      console.log(`🔗 Server listening on all network interfaces (0.0.0.0)`);
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;
