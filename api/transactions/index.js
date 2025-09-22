import { connectDB } from '../../lib/mongodb';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      // Listar transações
      const transactions = await getTransactions(req.query.userId);
      res.status(200).json(transactions);
      break;
      
    case 'POST':
      // Criar transação
      const newTransaction = await createTransaction(req.body);
      res.status(201).json(newTransaction);
      break;
      
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}