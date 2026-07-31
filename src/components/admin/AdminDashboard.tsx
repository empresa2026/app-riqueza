import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FolderPlus, 
  Plus, 
  Loader2, 
  Crown, 
  Wand2, 
  Users, 
  FileText, 
  Settings, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Search,
  LayoutGrid,
  CornerDownRight,
  Webhook
} from 'lucide-react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy, onSnapshot, where, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Category, Quiz, UserProfile, EnjoymentPlanResult, UserResult, MatrixResult, ProtocolResult } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore';
import { generateQuizFromPrompt } from '../../services/geminiService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { MATRICES } from '../../data/matrices';
import { PROTOCOLS } from '../../data/protocols';
import { PlanDetailsModal } from './PlanDetailsModal';
import { WebhookManagerView } from './WebhookManagerView';
import { SUBLEIS_SACRIFICIO, SUBLEIS_INJUSTICA, SUBLEIS_DOR, SUBLEIS_RENUNCIA, resolveSubLawTexts } from '../../data/planConstants';
import { X, Trophy, Eye, Calendar, BookOpen, Heart, ShieldAlert, History, Play } from 'lucide-react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

interface AdminDashboardProps {
  categories: Category[];
  userId: string;
  onBack: () => void;
}

type AdminTab = 'create' | 'protocols' | 'users' | 'webhooks' | 'settings';

export function AdminDashboard({ categories, userId, onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('create');
  
  // Creation State
  const [generatorPrompt, setGeneratorPrompt] = useState(() => 
    localStorage.getItem('unidade_generator_prompt') || 
    'Crie um protocolo de auto-investigação profundo que explore as camadas do ego e a ferida primária.'
  );
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  // Protocols State
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [searchQuiz, setSearchQuiz] = useState('');
  
  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  
  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');
  
  // Settings State
  const [cleaning, setCleaning] = useState(false);

  // User History Detail State
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<UserProfile | null>(null);
  const [userPlans, setUserPlans] = useState<EnjoymentPlanResult[]>([]);
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [userMatrices, setUserMatrices] = useState<MatrixResult[]>([]);
  const [userProtocols, setUserProtocols] = useState<ProtocolResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewingPlanDetail, setViewingPlanDetail] = useState<EnjoymentPlanResult | null>(null);

  // Fetch selected user history
  useEffect(() => {
    if (!selectedUserForHistory) {
      setUserPlans([]);
      setUserResults([]);
      setUserMatrices([]);
      setUserProtocols([]);
      return;
    }

    setLoadingHistory(true);
    const targetUserId = selectedUserForHistory.uid;

    const loadAllHistory = async () => {
      try {
        // Fetch Enjoyment Plans
        const planSnap = await getDocs(query(
          collection(db, 'enjoymentPlans'),
          where('userId', '==', targetUserId)
        ));
        const plans = planSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnjoymentPlanResult));
        plans.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setUserPlans(plans);

        // Fetch Quizzes Checkpoints
        const resultSnap = await getDocs(query(
          collection(db, 'user_results'),
          where('userId', '==', targetUserId)
        ));
        const results = resultSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserResult));
        results.sort((a, b) => {
          const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return dateB - dateA;
        });
        setUserResults(results);

        // Fetch Matrix Results
        const matrixSnap = await getDocs(query(
          collection(db, 'matrix_results'),
          where('userId', '==', targetUserId)
        ));
        const matrices = matrixSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MatrixResult));
        matrices.sort((a, b) => {
          const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return dateB - dateA;
        });
        setUserMatrices(matrices);

        // Fetch Protocol Results
        const protocolSnap = await getDocs(query(
          collection(db, 'protocolResults'),
          where('userId', '==', targetUserId)
        ));
        const protocols = protocolSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProtocolResult));
        protocols.sort((a, b) => {
          const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return dateB - dateA;
        });
        setUserProtocols(protocols);

      } catch (err) {
        console.error("Error fetching user history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadAllHistory();
  }, [selectedUserForHistory]);

  useEffect(() => {
    localStorage.setItem('unidade_generator_prompt', generatorPrompt);
  }, [generatorPrompt]);

  // Fetch Quizzes for Management
  useEffect(() => {
    if (activeTab === 'protocols') {
      setLoadingQuizzes(true);
      const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setQuizzes(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Quiz)));
        setLoadingQuizzes(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'quizzes');
        setLoadingQuizzes(false);
      });
      return unsubscribe;
    }
  }, [activeTab]);

  // Fetch Users for Management
  useEffect(() => {
    if (activeTab === 'users') {
      setLoadingUsers(true);
      const q = query(collection(db, 'users'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));
        setLoadingUsers(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'users');
        setLoadingUsers(false);
      });
      return unsubscribe;
    }
  }, [activeTab]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName,
        createdAt: new Date().toISOString()
      });
      setNewCategoryName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'categories');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const quizData = await generateQuizFromPrompt(generatorPrompt, topic);
      await addDoc(collection(db, 'quizzes'), {
        ...quizData,
        categoryId: selectedCategoryId || null,
        createdAt: new Date().toISOString(),
        createdBy: userId
      });
      setActiveTab('protocols');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'quizzes');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    // Basic confirmation state for simplicity, or just use the same pattern if needed.
    // Given the complexity of AdminDashboard, I will keep it simple but functional.
    if (!window.confirm('Tem certeza que deseja excluir este protocolo?')) return;
    try {
      await deleteDoc(doc(db, 'quizzes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `quizzes/${id}`);
    }
  };

  const handleUpdateUserRole = async (uid: string, newRole: 'admin' | 'user') => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleCreateUserManually = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setAddUserError('Por favor, preencha todos os campos.');
      return;
    }
    if (newUserPassword.length < 6) {
      setAddUserError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setAddingUser(true);
    setAddUserError('');
    setAddUserSuccess('');

    let tempApp;
    try {
      const tempAppName = `AddUserApp-${Date.now()}`;
      tempApp = initializeApp(firebaseConfig, tempAppName);
      const tempAuth = getAuth(tempApp);

      const userCred = await createUserWithEmailAndPassword(tempAuth, newUserEmail, newUserPassword);
      const uid = userCred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        displayName: newUserName,
        email: newUserEmail,
        role: newUserRole,
        createdAt: new Date().toISOString()
      });

      await signOut(tempAuth);

      setAddUserSuccess('Usuário adicionado com sucesso!');
      
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
      
      setTimeout(() => {
        setShowAddUserModal(false);
        setAddUserSuccess('');
      }, 1500);

    } catch (err: any) {
      console.error("Error manually adding user:", err);
      let errorMsg = 'Erro ao criar usuário.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'E-mail inválido.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAddUserError(errorMsg);
    } finally {
      if (tempApp) {
        try {
          await deleteApp(tempApp);
        } catch (e) {
          console.error("Error deleting temp app:", e);
        }
      }
      setAddingUser(false);
    }
  };

  const handleCleanup = async () => {
    setCleaning(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const updates = querySnapshot.docs.map(async (quizDoc) => {
        const data = quizDoc.data() as Quiz;
        let needsUpdate = false;
        const newData: any = {};

        if (data.title && /lux/i.test(data.title)) {
          newData.title = data.title.replace(/lux/gi, '').replace(/\s+/g, ' ').trim();
          needsUpdate = true;
        }

        if (data.sections) {
          const newSections = data.sections.map(section => {
            if (section.title && /bloco/i.test(section.title)) {
              needsUpdate = true;
              return {
                ...section,
                title: section.title.replace(/bloco\s*/gi, '').trim()
              };
            }
            return section;
          });
          if (needsUpdate) newData.sections = newSections;
        }

        if (needsUpdate) {
          await updateDoc(doc(db, 'quizzes', quizDoc.id), newData);
        }
      });

      await Promise.all(updates);
      alert('Limpeza concluída com sucesso!');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'quizzes');
    } finally {
      setCleaning(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Deseja importar os protocolos e categorias base da Escola da Unidade?')) return;
    setCleaning(true);
    try {
      // 1. Create Categories
      const catResults = await Promise.all([
        addDoc(collection(db, 'categories'), { name: 'Feridas Primárias', createdAt: new Date().toISOString() }),
        addDoc(collection(db, 'categories'), { name: 'Prosperidade', createdAt: new Date().toISOString() }),
        addDoc(collection(db, 'categories'), { name: 'Relacionamentos', createdAt: new Date().toISOString() })
      ]);
      const [feridaId, prosperidadeId, relacionalId] = catResults.map(r => r.id);

      // 2. Create Sample Quizzes
      const samples = [
        {
          title: "O Medo da Rejeição",
          categoryId: feridaId,
          identifiedStructure: {
            ferida: "Injustiça/Rejeição",
            dominio: "Social e Íntimo",
            mascara: "Rígido/Esquizoide",
            modo: "Auto-exclusão preventiva"
          },
          axisEstablishment: {
            text: "Onde você se retira antes de ser expulso?",
            instruction: "Sinta o frio na base da coluna ao ler esta pergunta."
          },
          sections: [
            {
              title: "1. O ACORDO SILENCIOSO",
              intro: "Todo medo da rejeição nasce de um contrato que você assinou consigo mesmo para não incomodar.",
              questions: [
                {
                  question: "Qual sua primeira reação ao entrar em um ambiente novo?",
                  options: ["Observar as saídas", "Tentar agradar alguém rápido", "Ficar invisível", "Analisar quem pode me julgar"]
                }
              ]
            }
          ],
          finalPrayer: "Eu renuncio ao papel de intruso na minha própria vida.",
          createdAt: new Date().toISOString(),
          createdBy: userId
        },
        {
          title: "A Frequência da Escassez",
          categoryId: prosperidadeId,
          identifiedStructure: {
            ferida: "Oralidade/Privação",
            dominio: "Recursos e Valor",
            mascara: "O Vazio",
            modo: "Acúmulo por medo ou Gasto por ansiedade"
          },
          axisEstablishment: {
            text: "O dinheiro é apenas a sombra da sua permissão de existir.",
            instruction: "Respire e sinta onde no corpo você aperta quando pensa em boletos."
          },
          sections: [
            {
              title: "1. A RAIZ DO VAZIO",
              intro: "Você não tem medo de faltar dinheiro. Você tem medo de que, se faltar, você não será cuidado.",
              questions: [
                {
                  question: "Como você se sente ao receber um valor inesperado?",
                  options: ["Culpa por ter", "Medo de perder rápido", "Vontade de gastar tudo", "Alívio momentâneo mas alerta"]
                }
              ]
            }
          ],
          finalPrayer: "Eu me abro para a abundância que já sou.",
          createdAt: new Date().toISOString(),
          createdBy: userId
        }
      ];

      for (const sample of samples) {
        await addDoc(collection(db, 'quizzes'), sample);
      }
      alert('Modelos importados com sucesso!');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'quizzes');
    } finally {
      setCleaning(false);
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchQuiz.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="py-8 max-w-4xl mx-auto pb-32"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-4xl font-serif">Painel Master</h2>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <TabButton 
            active={activeTab === 'create'} 
            onClick={() => setActiveTab('create')} 
            icon={<Plus className="w-4 h-4" />}
            label="Criar"
          />
          <TabButton 
            active={activeTab === 'protocols'} 
            onClick={() => setActiveTab('protocols')} 
            icon={<FileText className="w-4 h-4" />}
            label="Protocolos"
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
            icon={<Users className="w-4 h-4" />}
            label="Usuários"
          />
          <TabButton 
            active={activeTab === 'webhooks'} 
            onClick={() => setActiveTab('webhooks')} 
            icon={<Webhook className="w-4 h-4" />}
            label="Webhooks"
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Settings className="w-4 h-4" />}
            label="Config"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'create' && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="space-y-6 border-gold/10">
                <div className="flex items-center gap-3 mb-2">
                  <FolderPlus className="w-5 h-5 text-gold" />
                  <h3 className="text-xl font-serif">Categorias</h3>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text"
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-all"
                    placeholder="Nova categoria..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <Button onClick={handleCreateCategory} disabled={creatingCategory || !newCategoryName.trim()}>
                    {creatingCategory ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <span key={cat.id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/60">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="border-gold/20 bg-gold/5">
                <div className="flex items-center gap-3 mb-4">
                  <Wand2 className="w-5 h-5 text-gold" />
                  <h3 className="text-xl font-serif">Limpeza Rápida</h3>
                </div>
                <p className="text-sm text-white/40 mb-6">Padronize os títulos e seções de todos os protocolos existentes com um clique.</p>
                <Button 
                  variant="outline" 
                  onClick={handleCleanup} 
                  disabled={cleaning}
                  className="w-full border-gold/20 text-gold hover:bg-gold hover:text-black"
                >
                  {cleaning ? <Loader2 className="w-4 h-4 animate-spin" /> : "Executar Limpeza"}
                </Button>
              </Card>
            </div>

            <Card className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-gold" />
                <h3 className="text-xl font-serif">Gerador de Protocolos IA</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Categoria Alvo</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold/50 transition-all appearance-none"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                      <option value="" className="bg-luxury-black text-white">Nenhuma Categoria</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-luxury-black text-white">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Tema de Investigação</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-all"
                      placeholder="Ex: Medo da Rejeição, Escassez..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Prompt Mestre (Instruções IA)</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 min-h-[160px] transition-all text-sm leading-relaxed"
                    placeholder="Defina como a IA deve se comportar..."
                    value={generatorPrompt}
                    onChange={(e) => setGeneratorPrompt(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button 
                className="w-full py-6 text-lg" 
                onClick={handleGenerate} 
                disabled={generating || !topic.trim()}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Canalizando Conhecimento...
                  </>
                ) : (
                  <>
                    <Crown className="w-6 h-6" />
                    Gerar Protocolo Exclusivo
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        )}

        {activeTab === 'protocols' && (
          <motion.div 
            key="protocols"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text"
                placeholder="Pesquisar protocolos..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-gold/50 transition-all"
                value={searchQuiz}
                onChange={(e) => setSearchQuiz(e.target.value)}
              />
            </div>

            {loadingQuizzes ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredQuizzes.map(quiz => (
                  <Card key={quiz.id} className="p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif">{quiz.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] uppercase tracking-widest text-white/40">
                            {categories.find(c => c.id === quiz.categoryId)?.name || 'Sem Categoria'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[10px] uppercase tracking-widest text-white/40">
                            {quiz.sections?.length || 0} Seções
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-3 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Card>
                ))}
                {filteredQuizzes.length === 0 && (
                  <div className="text-center py-20 text-white/20">Nenhum protocolo encontrado.</div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div 
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text"
                  placeholder="Pesquisar por nome ou email..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-gold/50 transition-all"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => setShowAddUserModal(true)}
                className="bg-gold hover:bg-gold/90 text-black font-bold uppercase tracking-wider text-xs px-6 py-4 rounded-2xl border-none flex items-center justify-center gap-2 font-mono shrink-0"
              >
                <Plus className="w-4 h-4" />
                Adicionar Usuário
              </Button>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map(user => (
                  <Card key={user.uid} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <UserIcon className="w-6 h-6 text-white/40" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">{user.displayName || 'Usuário sem nome'}</h4>
                        <p className="text-sm text-white/40">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={() => setSelectedUserForHistory(user)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/30 text-gold bg-gold/5 hover:bg-gold hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        <Crown className="w-4 h-4" />
                        Ver Alianças
                      </button>

                      <button 
                        onClick={() => handleUpdateUserRole(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest",
                          user.role === 'admin' 
                            ? "bg-gold/10 border-gold text-gold" 
                            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
                        )}
                      >
                        <Shield className="w-4 h-4" />
                        {user.role === 'admin' ? 'Master' : 'Membro'}
                      </button>
                    </div>
                  </Card>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-20 text-white/20">Nenhum usuário encontrado.</div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'webhooks' && (
          <motion.div
            key="webhooks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <WebhookManagerView />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Protocolos" value={quizzes.length} icon={<FileText />} />
              <StatCard label="Total Usuários" value={users.length} icon={<Users />} />
              <StatCard label="Categorias" value={categories.length} icon={<LayoutGrid />} />
            </div>

            <Card className="space-y-6">
              <h3 className="text-xl font-serif">Ações de Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleSeed} 
                  disabled={cleaning}
                  className="border-gold/20 text-gold hover:bg-gold hover:text-black"
                >
                  <Crown className="w-4 h-4" />
                  Restaurar Protocolos de Elite
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCleanup} 
                  disabled={cleaning}
                  className="border-gold/20 text-gold hover:bg-gold hover:text-black"
                >
                  <Wand2 className="w-4 h-4" />
                  Limpeza de Títulos
                </Button>
              </div>
            </Card>

            <Card className="space-y-6">
              <h3 className="text-xl font-serif">Preferências da Plataforma</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-medium">Modo de Manutenção</div>
                    <div className="text-xs text-white/40">Impede o acesso de usuários comuns.</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-white/10 relative cursor-not-allowed opacity-50">
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white/20" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-medium">Geração Automática</div>
                    <div className="text-xs text-white/40">Permite que a IA gere conteúdos sem aprovação.</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-gold/20 relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-gold" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected User History Overlay Modal */}
      <AnimatePresence>
        {selectedUserForHistory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-start">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-luxury-black border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative mt-4 md:mt-10"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif text-white">
                      Diagnósticos de {selectedUserForHistory.displayName || 'Membro'}
                    </h3>
                    <p className="text-xs text-white/40">{selectedUserForHistory.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUserForHistory(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {loadingHistory ? (
                  <div className="flex flex-col justify-center items-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Acessando Arquivos...</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    
                    {/* 1. Alianças Familiares (Enjoyment Plans) */}
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Alianças Familiares (Plano)</h4>
                      {userPlans.map((plan) => (
                        <Card key={plan.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gold/[0.03] border-gold/10">
                          <div className="flex-1">
                            <h5 className="text-lg font-serif mb-1">Mapa das Alianças Familiares</h5>
                            <p className="text-white/40 text-xs uppercase tracking-widest">
                              {new Date(plan.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setViewingPlanDetail(plan)}
                              className="flex items-center gap-2 border-white/5 hover:bg-white/5 text-xs py-2"
                            >
                              <Play className="w-4 h-4 text-gold" />
                              Visualizar Plano
                            </Button>
                          </div>
                        </Card>
                      ))}
                      {userPlans.length === 0 && (
                        <div className="text-center py-8 glass rounded-2xl border border-dashed border-white/5 text-white/20 text-sm">
                          Nenhum plano de alianças diagnosticado para este usuário.
                        </div>
                      )}
                    </section>

                    {/* 2. Raio-X (Matrix Results) */}
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Raio-X da Vida (Matrizes)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {userMatrices.map((matrixRes) => {
                          const matrixDef = MATRICES.find(m => m.id === matrixRes.matrixId);
                          return (
                            <Card key={matrixRes.id} className="p-5 border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <h5 className="font-serif text-base text-white">
                                  Matriz {matrixDef?.number || ''}: {matrixDef?.title || 'Matriz Diagnóstica'}
                                </h5>
                                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                                  {new Date(matrixRes.completedAt).toLocaleString('pt-BR')}
                                </p>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] uppercase font-mono tracking-widest text-gold bg-gold/10 px-2 py-1 rounded">
                                  {matrixDef?.acronym || 'MTR'}
                                </span>
                              </div>
                            </Card>
                          );
                        })}
                        {userMatrices.length === 0 && (
                          <div className="text-center py-8 glass rounded-2xl border border-dashed border-white/5 text-white/20 text-sm">
                            Nenhuma matriz preenchida por este usuário.
                          </div>
                        )}
                      </div>
                    </section>

                    {/* 3. Checkpoints (Quiz Results) */}
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Checkpoints de Auto-Investigação (Quizzes)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {userResults.map((result) => {
                          const quiz = quizzes.find(q => q.id === result.quizId);
                          return (
                            <Card key={result.id} className="p-5 border-white/5 bg-white/[0.01]">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h5 className="font-serif text-base text-white">{quiz?.title || 'Protocolo'}</h5>
                                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                                    {new Date(result.completedAt).toLocaleString('pt-BR')}
                                  </p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-1 font-sans">
                                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60">
                                    Mascara: {quiz?.identifiedStructure?.mascara || 'Esquizoide'}
                                  </span>
                                  <span className="text-[9px] text-white/30 mt-1 block">
                                    Ferida: {quiz?.identifiedStructure?.ferida || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                        {userResults.length === 0 && (
                          <div className="text-center py-8 glass rounded-2xl border border-dashed border-white/5 text-white/20 text-sm">
                            Nenhum checkpoint realizado por este usuário.
                          </div>
                        )}
                      </div>
                    </section>

                    {/* 4. Processos (Protocol Results) */}
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Processos Ativos (Protocolos)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {userProtocols.map((pRes) => {
                          const pDef = PROTOCOLS.find(p => p.id === pRes.protocolId);
                          return (
                            <Card key={pRes.id} className="p-5 border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <h5 className="font-serif text-base text-white">{pDef?.title || 'Protocolo Prático'}</h5>
                                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                                  {new Date(pRes.completedAt).toLocaleString('pt-BR')}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-gold bg-gold/10 px-2 py-1 rounded">
                                  {pDef?.code || 'PRT'}
                                </span>
                              </div>
                            </Card>
                          );
                        })}
                        {userProtocols.length === 0 && (
                          <div className="text-center py-8 glass rounded-2xl border border-dashed border-white/5 text-white/20 text-sm">
                            Nenhum processo realizado por este usuário.
                          </div>
                        )}
                      </div>
                    </section>

                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Viewing Plan Detail Modal */}
      <AnimatePresence>
        {viewingPlanDetail && (
          <PlanDetailsModal 
            viewingPlanDetail={viewingPlanDetail} 
            selectedUserDisplayName={selectedUserForHistory?.displayName} 
            onClose={() => setViewingPlanDetail(null)} 
          />
        )}
      </AnimatePresence>

      {/* Manually Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-luxury-black border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">Cadastrar Novo Usuário</h3>
                    <p className="text-xs text-white/40 font-mono">Adicionar credenciais manualmente</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateUserManually} className="p-6 space-y-6">
                {addUserError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono">
                    {addUserError}
                  </div>
                )}
                {addUserSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-mono">
                    {addUserSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-mono">Nome Completo</label>
                    <input 
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-all text-sm"
                      placeholder="Ex: João Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-mono">E-mail</label>
                    <input 
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-all text-sm"
                      placeholder="Ex: joao@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-mono">Senha de Acesso</label>
                    <input 
                      type="password"
                      required
                      minLength={6}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-all text-sm font-mono"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-mono">Função na Plataforma</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'user')}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold/50 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="user" className="bg-luxury-black text-white">Membro comum (User)</option>
                      <option value="admin" className="bg-luxury-black text-white">Administrador Master (Admin)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 py-4 border-white/10 hover:bg-white/5 text-white/60 font-mono text-xs uppercase font-bold tracking-widest"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={addingUser}
                    className="flex-1 py-4 bg-gold hover:bg-gold/90 text-black font-mono text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2"
                  >
                    {addingUser ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-black" />
                        Cadastrar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-widest",
        active ? "bg-gold text-black shadow-lg" : "text-white/40 hover:text-white"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="p-6 border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/5 text-gold">
          {icon}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</div>
          <div className="text-3xl font-serif mt-1">{value}</div>
        </div>
      </div>
    </Card>
  );
}
