const transactions = require('../database/finances.json');

const fs = require('fs');

require('dotenv').config();

const file_path = process.env.PATH_DATABASE;

module.exports = {
  async index(req, res) {
    return res.json(transactions);
  },

  async store(req, res) {
    const { description, amount, date } = req.body;

    transactions.push({
      id: transactions.length + 1,
      description,
      amount,
      date
    });

    fs.writeFile(`${file_path}/finances.json`, JSON.stringify(transactions), function (err) {
      if (err) throw err;
    });

    return res.status(200).json({ message: 'transaction successfully registered!' });
  },

  async delete(req, res) {
    const { id } = req.params;

    const index = transactions.findIndex(transaction => transaction.id == id);

    transactions.splice(index, 1);

    fs.writeFile(`${file_path}/finances.json`, JSON.stringify(transactions), function (err) {
      if (err) throw err;
    });

    return res.status(200).json({ message: 'transaction deleted successfully!' });
  }
}
