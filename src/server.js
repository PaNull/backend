import App from './index';
const PORT = process.env.PORT || 3333;

App.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

App.use(cors());

App.listen(PORT, () => {
  console.log(`Executando na porta ${PORT}`)
})