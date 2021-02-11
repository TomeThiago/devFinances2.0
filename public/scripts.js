const uriServer = 'http://localhost:3333';

let transactions = [];

const StorageTransactions = {
  async get() {
    const response = await fetch(`${uriServer}/transactions`);

    const transations = await response.json();

    return transations || [];
  },
  async add(transaction) {
    await fetch(`${uriServer}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction)
    });

    App.reload();
  },
  async remove(idTransaction) {
    await fetch(`${uriServer}/transactions/${idTransaction}`, {
      method: 'DELETE',
    });

    App.reload();
  },
}

const Modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}

const Transaction = {
  incomes() {
    let income = 0;

    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },
  expenses() {
    let expense = 0;

    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },
  total() {
    return this.incomes() + this.expenses();
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = this.innerHTMLTransaction(transaction);
    this.transactionContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
    <tr>
      <td class="description">${transaction.description}</td>
      <td class=${transaction.amount < 0 ? "expense" : "income"}>${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img class="remove-transaction" src="./assets/minus.svg" alt="Remover Transação" onclick="StorageTransactions.remove(${transaction.id})">
      </td>
    </tr>
    `;

    return html;
  },
  updateBalance() {
    document.querySelector('#incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.querySelector('#expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.querySelector('#totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },
  clearTransactions() {
    this.transactionContainer.innerHTML = "";
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    return signal + value;
  },
  formatAmount(value) {
    return Number(value.replace(/\,\./g,'')) * 100;
  },
  formatDate(date) {
    const splittedDate = date.split('-');
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    }
  },
  validateFields() {
    const { description, amount, date } = this.getValues();

    if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos");
    }
  },
  formatValues() {
    let { description, amount, date } = this.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    }
  },
  submit(event) {
    event.preventDefault();

    try {
      this.validateFields();

      const transaction = this.formatValues();

      StorageTransactions.add(transaction);

      this.clearFields();
      Modal.close();
    } catch (err) {
      alert(err.message);
    }
  },
  clearFields() {
    this.description.value = "";
    this.amount.value = "";
    this.date.value = "";
  }
}

const App = {
  async init() {
    transactions = await StorageTransactions.get();
    transactions.forEach(transaction => DOM.addTransaction(transaction));
    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  }
}

App.init();
