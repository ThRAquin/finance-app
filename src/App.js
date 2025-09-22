import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Target, PieChart, BarChart3, Wallet, CreditCard, Home, Car, ShoppingBag, Utensils, Gamepad2, Heart, GraduationCap, Plane, User, Users, LogOut, Menu, X, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

const FinancialApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Estados específicos para família
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'member'
  });

  // Estados para formulários
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'individual'
  });

  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'alimentacao',
    date: new Date().toISOString().split('T')[0],
    memberId: ''
  });
  
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'media'
  });
  
  const [budgetForm, setBudgetForm] = useState({
    category: 'alimentacao',
    limit: '',
    period: 'mensal'
  });

  // Categorias
  const categories = {
    alimentacao: { name: 'Alimentação', icon: Utensils, color: 'bg-orange-500' },
    transporte: { name: 'Transporte', icon: Car, color: 'bg-blue-500' },
    moradia: { name: 'Moradia', icon: Home, color: 'bg-green-500' },
    saude: { name: 'Saúde', icon: Heart, color: 'bg-red-500' },
    educacao: { name: 'Educação', icon: GraduationCap, color: 'bg-purple-500' },
    lazer: { name: 'Lazer', icon: Gamepad2, color: 'bg-pink-500' },
    compras: { name: 'Compras', icon: ShoppingBag, color: 'bg-yellow-500' },
    viagem: { name: 'Viagem', icon: Plane, color: 'bg-indigo-500' },
    outros: { name: 'Outros', icon: Wallet, color: 'bg-gray-500' }
  };

  // Carregar dados do localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('financialApp_users');
    const savedCurrentUser = localStorage.getItem('financialApp_currentUser');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      loadUserData(user.id);
      setCurrentPage('app');
    }
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('financialApp_users', JSON.stringify(updatedUsers));
  };

  const saveCurrentUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('financialApp_currentUser', JSON.stringify(user));
  };

  const loadUserData = (userId) => {
    try {
      const userTransactions = localStorage.getItem('transactions_' + userId) || '[]';
      const userGoals = localStorage.getItem('goals_' + userId) || '[]';
      const userBudgets = localStorage.getItem('budgets_' + userId) || '[]';
      const userFamilyMembers = localStorage.getItem('familyMembers_' + userId) || '[]';
      
      // Parse e converter datas
      const parsedTransactions = JSON.parse(userTransactions).map(t => ({
        ...t,
        date: new Date(t.date)
      }));
      
      const parsedGoals = JSON.parse(userGoals).map(g => ({
        ...g,
        deadline: g.deadline ? new Date(g.deadline) : null
      }));
      
      setTransactions(parsedTransactions);
      setGoals(parsedGoals);
      setBudgets(JSON.parse(userBudgets));
      setFamilyMembers(JSON.parse(userFamilyMembers));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const saveUserData = (userId) => {
    try {
      localStorage.setItem('transactions_' + userId, JSON.stringify(transactions));
      localStorage.setItem('goals_' + userId, JSON.stringify(goals));
      localStorage.setItem('budgets_' + userId, JSON.stringify(budgets));
      localStorage.setItem('familyMembers_' + userId, JSON.stringify(familyMembers));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Função para adicionar membro da família
  const addFamilyMember = (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.email) return;
    
    if (familyMembers.find(m => m.email === memberForm.email)) {
      alert('Este email já está cadastrado na família!');
      return;
    }
    
    const newMember = {
      id: Date.now(),
      name: memberForm.name,
      email: memberForm.email,
      role: memberForm.role,
      createdAt: new Date()
    };
    
    const updatedMembers = [...familyMembers, newMember];
    setFamilyMembers(updatedMembers);
    setMemberForm({ name: '', email: '', role: 'member' });
    setShowAddMemberForm(false);
  };

  const removeFamilyMember = (memberId) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (member && member.role === 'admin' && member.id === currentUser.id) {
      alert('Não é possível remover o administrador principal!');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja remover este membro?')) {
      setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
      setTransactions(transactions.filter(t => t.memberId !== memberId));
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    
    if (authMode === 'register') {
      if (authForm.password !== authForm.confirmPassword) {
        alert('Senhas não coincidem!');
        return;
      }
      
      if (users.find(u => u.email === authForm.email)) {
        alert('Email já cadastrado!');
        return;
      }
      
      const newUser = {
        id: Date.now(),
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
        accountType: authForm.accountType,
        createdAt: new Date()
      };
      
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      saveCurrentUser(newUser);
      
      if (newUser.accountType === 'family') {
        const initialMember = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: 'admin',
          createdAt: new Date()
        };
        setFamilyMembers([initialMember]);
      }
      
      setCurrentPage('app');
      setAuthForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'individual'
      });
    } else {
      const user = users.find(u => u.email === authForm.email && u.password === authForm.password);
      if (user) {
        saveCurrentUser(user);
        loadUserData(user.id);
        setCurrentPage('app');
      } else {
        alert('Email ou senha incorretos!');
      }
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      saveUserData(currentUser.id);
    }
    setCurrentUser(null);
    localStorage.removeItem('financialApp_currentUser');
    setCurrentPage('landing');
    setMobileMenuOpen(false);
  };

  // Salvar dados automaticamente
  useEffect(() => {
    if (currentUser) {
      saveUserData(currentUser.id);
    }
  }, [transactions, goals, budgets, familyMembers, currentUser]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.description) return;
    
    const newTransaction = {
      id: Date.now(),
      type: transactionForm.type,
      amount: parseFloat(transactionForm.amount),
      description: transactionForm.description,
      category: transactionForm.category,
      date: new Date(transactionForm.date),
      userId: currentUser.id,
      memberId: transactionForm.memberId || currentUser.id
    };
    
    setTransactions([...transactions, newTransaction]);
    setTransactionForm({
      type: 'expense',
      amount: '',
      description: '',
      category: 'alimentacao',
      date: new Date().toISOString().split('T')[0],
      memberId: ''
    });
  };

  const addGoal = (e) => {
    e.preventDefault();
    if (!goalForm.name || !goalForm.targetAmount) return;
    
    const newGoal = {
      id: Date.now(),
      name: goalForm.name,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: parseFloat(goalForm.currentAmount) || 0,
      deadline: goalForm.deadline ? new Date(goalForm.deadline) : null,
      priority: goalForm.priority,
      userId: currentUser.id
    };
    
    setGoals([...goals, newGoal]);
    setGoalForm({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: 'media'
    });
  };

  const addBudget = (e) => {
    e.preventDefault();
    if (!budgetForm.limit) return;
    
    const newBudget = {
      id: Date.now(),
      category: budgetForm.category,
      limit: parseFloat(budgetForm.limit),
      period: budgetForm.period,
      userId: currentUser.id
    };
    
    setBudgets([...budgets, newBudget]);
    setBudgetForm({
      category: 'alimentacao',
      limit: '',
      period: 'mensal'
    });
  };

  // Filtrar transações por membro selecionado
  const getFilteredTransactions = () => {
    if (currentUser && currentUser.accountType !== 'family' || !selectedMember) {
      return transactions;
    }
    return transactions.filter(t => t.memberId === selectedMember);
  };

  const filteredTransactions = getFilteredTransactions();

  // Cálculos financeiros
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Função para obter nome do membro por ID
  const getMemberName = (memberId) => {
    const member = familyMembers.find(m => m.id === memberId);
    return member ? member.name : 'Usuário';
  };

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Wallet className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">FinanceApp</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Começar Agora
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => { setCurrentPage('auth'); setMobileMenuOpen(false); }}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Começar Agora
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Controle suas
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> finanças</span>
              <br />de forma inteligente
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              O app definitivo para organizar suas receitas, despesas, metas e orçamentos. 
              Perfeito para uso individual ou familiar, com interface moderna e intuitiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setCurrentPage('auth')}
                className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Começar Grátis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Auth Page
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FinanceApp</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {authMode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
            </h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Seu nome completo"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  required
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    placeholder="Confirme sua senha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthForm({...authForm, accountType: 'individual'})}
                      className={'p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-2 ' + 
                        (authForm.accountType === 'individual'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400')}
                    >
                      <User className="w-6 h-6" />
                      <span className="font-medium">Individual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthForm({...authForm, accountType: 'family'})}
                      className={'p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-2 ' + 
                        (authForm.accountType === 'family'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400')}
                    >
                      <Users className="w-6 h-6" />
                      <span className="font-medium">Familiar</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {authMode === 'login' 
                ? 'Não tem uma conta? Cadastre-se' 
                : 'Já tem uma conta? Entre'}
            </button>
          </div>

          <button
            onClick={() => setCurrentPage('landing')}
            className="mt-4 text-center w-full text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Main App
  if (currentPage === 'app' && currentUser) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FinanceApp</h1>
                  <p className="text-xs text-gray-500">
                    {currentUser && currentUser.accountType === 'family' ? 'Conta Familiar' : 'Conta Individual'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  {currentUser && currentUser.accountType === 'family' ? <Users className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm font-medium text-blue-700">
                    Olá, {currentUser && currentUser.name ? currentUser.name.split(' ')[0] : 'Usuário'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">Sair</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 bg-white overflow-x-auto">
            <div className="flex space-x-1 px-4 py-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ' + 
                  (activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ' + 
                  (activeTab === 'transactions' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Transações</span>
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ' + 
                  (activeTab === 'goals' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Metas</span>
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ' + 
                  (activeTab === 'budget' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Orçamento</span>
              </button>
              {currentUser && currentUser.accountType === 'family' && (
                <button
                  onClick={() => setActiveTab('family')}
                  className={'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ' + 
                    (activeTab === 'family' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100')}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Família</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Cards de resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Receitas</p>
                      <p className="text-xl lg:text-2xl font-bold text-green-700">R$ {totalIncome.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Despesas</p>
                      <p className="text-xl lg:text-2xl font-bold text-red-700">R$ {totalExpenses.toFixed(2)}</p>
                    </div>
                    <TrendingDown className="w-6 h-6 lg:w-8 lg:h-8 text-red-500" />
                  </div>
                </div>
                
                <div className={'border rounded-xl p-4 lg:p-6 sm:col-span-2 lg:col-span-1 ' + 
                  (balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={'text-sm font-medium ' + (balance >= 0 ? 'text-blue-600' : 'text-red-600')}>Saldo</p>
                      <p className={'text-xl lg:text-2xl font-bold ' + (balance >= 0 ? 'text-blue-700' : 'text-red-700')}>R$ {balance.toFixed(2)}</p>
                    </div>
                    <DollarSign className={'w-6 h-6 lg:w-8 lg:h-8 ' + (balance >= 0 ? 'text-blue-500' : 'text-red-500')} />
                  </div>
                </div>
              </div>

              {/* Transações recentes */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Transações Recentes
                </h3>
                <div className="space-y-2">
                  {filteredTransactions.slice(-5).reverse().map((transaction) => {
                    const category = categories[transaction.category];
                    const IconComponent = category ? category.icon : Wallet;
                    const transactionDate = new Date(transaction.date);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={'p-2 rounded-lg flex-shrink-0 ' + (category ? category.color : 'bg-gray-500')}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span>{transactionDate.toLocaleDateString('pt-BR')}</span>
                              {currentUser && currentUser.accountType === 'family' && transaction.memberId && !selectedMember && (
                                <span>• {getMemberName(transaction.memberId)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={'font-semibold text-sm flex-shrink-0 ml-2 ' + 
                          (transaction.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                          {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Nenhuma transação ainda. Adicione a primeira!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Formulário para adicionar transação */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Adicionar Transação
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo</label>
                      <select
                        value={transactionForm.type}
                        onChange={(e) => setTransactionForm({...transactionForm, type: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={transactionForm.amount}
                        onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <input
                      type="text"
                      value={transactionForm.description}
                      onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Ex: Almoço no restaurante"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <select
                        value={transactionForm.category}
                        onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Object.entries(categories).map(([key, category]) => (
                          <option key={key} value={key}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Data</label>
                      <input
                        type="date"
                        value={transactionForm.date}
                        onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Campo de membro (só para contas família) */}
                    {currentUser && currentUser.accountType === 'family' && familyMembers.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Membro da Família</label>
                        <select
                          value={transactionForm.memberId}
                          onChange={(e) => setTransactionForm({...transactionForm, memberId: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um membro</option>
                          {familyMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name} {member.role === 'admin' ? '(Admin)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={addTransaction}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Adicionar Transação
                  </button>
                </div>
              </div>

              {/* Lista de transações */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Todas as Transações
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma transação adicionada ainda</p>
                  ) : (
                    transactions.slice().reverse().map((transaction) => {
                      const category = categories[transaction.category];
                      const IconComponent = category ? category.icon : Wallet;
                      const transactionDate = new Date(transaction.date);
                      
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={'p-2 rounded-lg flex-shrink-0 ' + (category ? category.color : 'bg-gray-500')}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate">{transaction.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>{category ? category.name : 'Outros'}</span>
                                <span>•</span>
                                <span>{transactionDate.toLocaleDateString('pt-BR')}</span>
                                {currentUser && currentUser.accountType === 'family' && transaction.memberId && (
                                  <>
                                    <span>•</span>
                                    <span>{getMemberName(transaction.memberId)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={'font-semibold text-sm ' + 
                              (transaction.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                              {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                            </span>
                            <button
                              onClick={() => setTransactions(transactions.filter(t => t.id !== transaction.id))}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && currentUser && currentUser.accountType === 'family' && (
            <div className="space-y-6">
              {/* Header da seção família */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Gerenciar Família
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Adicione membros da família para controlar as finanças em conjunto
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Adicionar Membro
                  </button>
                </div>
              </div>

              {/* Formulário para adicionar membro */}
              {showAddMemberForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                  <h4 className="text-md font-semibold mb-4">Novo Membro da Família</h4>
                  <form onSubmit={addFamilyMember} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome Completo</label>
                        <input
                          type="text"
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={memberForm.email}
                          onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          placeholder="joao@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Função na Família</label>
                      <select
                        value={memberForm.role}
                        onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="member">Membro</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Adicionar Membro
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMemberForm(false);
                          setMemberForm({ name: '', email: '', role: 'member' });
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de membros */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h4 className="text-md font-semibold mb-4">Membros da Família ({familyMembers.length})</h4>
                <div className="space-y-3">
                  {familyMembers.map((member) => {
                    const memberTransactions = transactions.filter(t => t.memberId === member.id);
                    const memberIncome = memberTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                    const memberExpenses = memberTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                    const memberBalance = memberIncome - memberExpenses;

                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold">{member.name}</h5>
                              {member.role === 'admin' && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Admin
                                </span>
                              )}
                              {member.id === currentUser.id && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Você
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Receitas: R$ {memberIncome.toFixed(2)}</span>
                              <span>Despesas: R$ {memberExpenses.toFixed(2)}</span>
                              <span className={memberBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                Saldo: R$ {memberBalance.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.id !== currentUser.id && member.role !== 'admin' && (
                            <button
                              onClick={() => removeFamilyMember(member.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Remover membro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Adicionar Meta Financeira
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Meta</label>
                    <input
                      type="text"
                      value={goalForm.name}
                      onChange={(e) => setGoalForm({...goalForm, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Reserva de emergência"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor Objetivo (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={goalForm.targetAmount}
                        onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor Atual (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={goalForm.currentAmount}
                        onChange={(e) => setGoalForm({...goalForm, currentAmount: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={addGoal}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Adicionar Meta
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {goals.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma meta financeira definida ainda</p>
                  </div>
                ) : (
                  goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    
                    return (
                      <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{goal.name}</h4>
                          </div>
                          <button
                            onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>R$ {goal.currentAmount.toFixed(2)}</span>
                            <span>R$ {goal.targetAmount.toFixed(2)}</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: Math.min(progress, 100) + '%' }}
                            ></div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <span>{progress.toFixed(1)}% concluído</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Definir Orçamento
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <select
                        value={budgetForm.category}
                        onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Object.entries(categories).map(([key, category]) => (
                          <option key={key} value={key}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Limite (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={budgetForm.limit}
                        onChange={(e) => setBudgetForm({...budgetForm, limit: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={addBudget}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Definir Orçamento
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {budgets.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum orçamento definido ainda</p>
                  </div>
                ) : (
                  budgets.map((budget) => {
                    const spent = expensesByCategory[budget.category] || 0;
                    const percentage = (spent / budget.limit) * 100;
                    const category = categories[budget.category];
                    const IconComponent = category.icon;
                    
                    return (
                      <div key={budget.id} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={'p-2 rounded-lg ' + category.color}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{category.name}</h4>
                            </div>
                          </div>
                          <button
                            onClick={() => setBudgets(budgets.filter(b => b.id !== budget.id))}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Gasto: R$ {spent.toFixed(2)}</span>
                            <span>Limite: R$ {budget.limit.toFixed(2)}</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={'h-3 rounded-full transition-all duration-300 ' + 
                                (percentage > 100 ? 'bg-red-500' : 
                                percentage > 80 ? 'bg-yellow-500' : 'bg-green-500')}
                              style={{ width: Math.min(percentage, 100) + '%' }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className={percentage > 100 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                              {percentage.toFixed(1)}% usado
                            </span>
                            <span className={percentage > 100 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                              Restante: R$ {Math.max(budget.limit - spent, 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Dica: {currentUser && currentUser.accountType === 'family' 
              ? 'Em contas familiares, cada membro pode adicionar suas próprias transações!' 
              : 'Seus dados ficam salvos automaticamente no seu navegador'}
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FinanceApp</h1>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default FinancialApp;