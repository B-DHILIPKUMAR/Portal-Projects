// const express = require('express');
// const cors = require('cors');

// const app = express();

// const loginRoutes = require('./routes/login');
// const profileRoutes = require('./routes/profile');
// const creditDebitRoutes = require('./routes/creditdebit');
// const rfqRoutes = require('./routes/rfq');
// const grRoutes = require('./routes/gr');
// const paymentRoutes = require('./routes/payment');
// const poRoutes = require('./routes/po');
// const invoiceRoutes = require('./routes/invoice');
// const formtableRoutes = require('./routes/formtable');
// const formodataRoutes = require('./routes/formodata');

// // ✅ ✅ ✅ THIS IS THE MOST IMPORTANT LINE
// app.use(cors());

// // ✅ Allow JSON
// app.use(express.json());

// // ✅ Routes
// app.use('/login', loginRoutes);
// app.use('/profile', profileRoutes);
// app.use('/credit-debit', creditDebitRoutes);
// app.use('/rfq', rfqRoutes);
// app.use('/gr', grRoutes);
// app.use('/payment', paymentRoutes);
// app.use('/po', poRoutes);
// app.use('/invoice', invoiceRoutes);
// app.use('/formtable', formtableRoutes);
// app.use('/formodata', formodataRoutes);

// // ✅ Start Server
// const PORT = 8001;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
const express = require('express');
const cors = require('cors');

const app = express();

// Routes
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const creditDebitRoutes = require('./routes/creditdebit');
const rfqRoutes = require('./routes/rfq');
const grRoutes = require('./routes/gr');
const paymentRoutes = require('./routes/payment');
const poRoutes = require('./routes/po');
const invoiceRoutes = require('./routes/invoice');
const formtableRoutes = require('./routes/formtable');
const formodataRoutes = require('./routes/formodata');

app.use(cors());
app.use(express.json());

// API Routes
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/credit-debit', creditDebitRoutes);
app.use('/rfq', rfqRoutes);
app.use('/gr', grRoutes);
app.use('/payment', paymentRoutes);
app.use('/po', poRoutes);
app.use('/api', invoiceRoutes);
app.use('/formtable', formtableRoutes);
app.use('/formodata', formodataRoutes);

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
