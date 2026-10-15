import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc, 
  setDoc,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';
import { Journey, Quiz, UserResult, UserProfile, Category, Matrix, MatrixResult, EnjoymentPlanResult, Protocol, ProtocolResult } from './types';
import { motion } from 'framer-motion';
import { Crown, Loader2, User as UserIcon, ShieldCheck, LayoutGrid, ShieldAlert, Compass, Mail, Lock } from 'lucide-react';
import { handleFirestoreError, OperationType } from './lib/firestore';
import { summarizeContext } from './services/geminiService';
import { updateDoc, addDoc } from 'firebase/firestore';
import { buildMabiAnswersFromPlan } from './lib/mabiEngine';

// Components
import { Button } from './components/ui/Button';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { LibraryView } from './components/quiz/LibraryView';
import { QuizPlayer } from './components/quiz/QuizPlayer';
import { MatrixLibraryView } from './components/quiz/MatrixLibraryView';
import { MatrixPlayer } from './components/quiz/MatrixPlayer';
import { HistoryView } from './components/quiz/HistoryView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EnjoymentPlanFlow } from './components/plan/EnjoymentPlanFlow';
import { ProtocolLibraryView } from './components/quiz/ProtocolLibraryView';
import { ProtocolPlayer } from './components/quiz/ProtocolPlayer';
import { MabiTherapeuticChronogram } from './components/journey/MabiTherapeuticChronogram';
import { MabiAtivacaoView } from './components/journey/MabiAtivacaoView';
import { MATRICES } from './data/matrices';
import { PROTOCOLS } from './data/protocols';

export default function App() {
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'library' | 'admin' | 'quiz' | 'history' | 'matrices' | 'plan' | 'protocols' | 'journeys' | 'padroes' | 'ativacao' | 'estacoes'>(() => {
    return (localStorage.getItem('mabi_current_view') as any) || 'plan';
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(localStorage.getItem('active_journey_id'));
  const [history, setHistory] = useState<UserResult[]>([]);
  const [matrixHistory, setMatrixHistory] = useState<MatrixResult[]>([]);
  const [protocolHistory, setProtocolHistory] = useState<ProtocolResult[]>([]);
  const [planHistory, setPlanHistory] = useState<EnjoymentPlanResult[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeQuizResult, setActiveQuizResult] = useState<UserResult | null>(null);
  const [activeMatrix, setActiveMatrix] = useState<Matrix | null>(null);
  const [activeMatrixResult, setActiveMatrixResult] = useState<MatrixResult | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null);
  const [activeProtocolResult, setActiveProtocolResult] = useState<ProtocolResult | null>(null);
  const [activeTargetPerson, setActiveTargetPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Email/Password Authentication States
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const nameRef = React.useRef('');
  React.useEffect(() => {
    nameRef.current = name;
  }, [name]);

  // Update localStorage when activeJourneyId changes
  useEffect(() => {
    if (activeJourneyId) {
      localStorage.setItem('active_journey_id', activeJourneyId);
    } else {
      localStorage.removeItem('active_journey_id');
    }
  }, [activeJourneyId]);

  // Update localStorage when view changes
  useEffect(() => {
    localStorage.setItem('mabi_current_view', view);
  }, [view]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    // Sync with real Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        setUser({ uid });
        
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            setProfile({ uid, ...userDoc.data() } as UserProfile);
          } else {
            // Create profile for new authenticated user
            const savedRole = localStorage.getItem('mock_user_role') || 'user';
            const newProfile: UserProfile = {
              uid,
              email: firebaseUser.email || '',
              role: savedRole as 'admin' | 'user',
              displayName: firebaseUser.displayName || nameRef.current || 'Explorador da Unidade'
            };
            await setDoc(doc(db, 'users', uid), {
              email: newProfile.email,
              role: newProfile.role,
              displayName: newProfile.displayName
            });
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error syncing user profile:", error);
        }
      } else {
        // Fallback to mock session if not real auth and has saved role
        const savedRole = localStorage.getItem('mock_user_role');
        if (savedRole) {
          handleMockLogin(savedRole as 'admin' | 'user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setAuthError('Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      try {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      } catch (profileErr) {
        console.error("Error updating auth profile displayName:", profileErr);
      }
      
      const newProfile: UserProfile = {
        uid,
        email,
        role: 'user',
        displayName: name
      };
      
      await setDoc(doc(db, 'users', uid), {
        email: newProfile.email,
        role: newProfile.role,
        displayName: newProfile.displayName
      });
      
      setProfile(newProfile);
      setUser({ uid });
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('A senha deve ter pelo menos 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('E-mail inválido.');
      } else {
        setAuthError(error.message || 'Erro ao realizar cadastro.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Por favor, preencha todos os campos.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      setUser({ uid });
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setProfile({ uid, ...userDoc.data() } as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid,
          email: userCredential.user.email || '',
          role: 'user',
          displayName: userCredential.user.displayName || 'Explorador da Unidade'
        };
        await setDoc(doc(db, 'users', uid), {
          email: newProfile.email,
          role: newProfile.role,
          displayName: newProfile.displayName
        });
        setProfile(newProfile);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setAuthError('E-mail ou senha incorretos.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('E-mail inválido.');
      } else {
        setAuthError(error.message || 'Erro ao realizar login.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMockLogin = async (role: 'admin' | 'user') => {
    // If we have a real user, just update their role
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      localStorage.setItem('mock_user_role', role);
      try {
        await setDoc(doc(db, 'users', uid), { role }, { merge: true });
        setProfile(prev => prev ? { ...prev, role } : null);
      } catch (error) {
        console.error("Error updating role:", error);
      }
      return;
    }

    setLoading(true);
    const uid = role === 'admin' ? 'mock-admin-id' : 'mock-user-id';
    const mockUser = { uid };
    
    setUser(mockUser);
    localStorage.setItem('mock_user_role', role);

    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setProfile({ uid, ...userDoc.data() } as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid,
          email: role === 'admin' ? 'admin@escoladaunidade.com' : 'user@escoladaunidade.com',
          role,
          displayName: role === 'admin' ? 'Mestre da Unidade' : 'Explorador da Unidade'
        };
        await setDoc(doc(db, 'users', uid), {
          email: newProfile.email,
          role: newProfile.role,
          displayName: newProfile.displayName
        });
        setProfile(newProfile);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('mock_user_role');
  };

  const deleteResult = async (collectionName: string, id: string) => {
    console.log(`Attempting to delete ${id} from ${collectionName}`);
    try {
      await deleteDoc(doc(db, collectionName, id));
      console.log(`Successfully deleted ${id}`);
    } catch (error) {
      console.error(`Failed to delete ${id}:`, error);
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuizzes(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Quiz)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'quizzes');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'user_results'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserResult));
      results.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
      setHistory(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'user_results');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'matrix_results'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MatrixResult));
      results.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
      setMatrixHistory(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'matrix_results');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'enjoymentPlans'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EnjoymentPlanResult));
      results.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setPlanHistory(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'enjoymentPlans');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'journeys'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Journey));
      results.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setJourneys(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'journeys');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'protocolResults'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProtocolResult));
      results.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
      setProtocolHistory(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'protocolResults');
    });
    return unsubscribe;
  }, [user]);

  // Auto-create or update a journey based on the latest enjoyment plan
  useEffect(() => {
    if (!user || planHistory.length === 0) return;
    
    const syncJourney = async () => {
      const latestPlan = planHistory[0];
      if (!latestPlan || !latestPlan.fase1) return;

      const goalMapping: Record<string, 'dinheiro' | 'relacionamento' | 'carreira' | 'saude'> = {
        'DINHEIRO': 'dinheiro',
        'AMOR': 'relacionamento',
        'CARREIRA': 'carreira',
        'SAÚDE': 'saude'
      };
      
      const primaryArea = latestPlan.fase1.sacrificio?.areas?.[0] || latestPlan.fase1.injustica?.areas?.[0] || 'DINHEIRO';
      const mabiGoal = goalMapping[primaryArea] || 'dinheiro';
      const mabiAnswers = buildMabiAnswersFromPlan(latestPlan);

      if (journeys.length === 0) {
        try {
          await addDoc(collection(db, 'journeys'), {
            userId: user.uid,
            name: `Aliança Familiar`,
            mabiGoal,
            mabiAnswers,
            status: 'active',
            createdAt: new Date().toISOString()
          });
        } catch (e) {
          console.error("Error creating default journey:", e);
        }
      } else {
        const activeJ = journeys[0];
        const hasAnswers = activeJ.mabiAnswers && Object.keys(activeJ.mabiAnswers).length > 0;
        if (!hasAnswers && activeJ.id) {
          try {
            await updateDoc(doc(db, 'journeys', activeJ.id), {
              mabiGoal,
              mabiAnswers
            });
          } catch (e) {
            console.error("Error updating journey mabiAnswers:", e);
          }
        }
      }
    };
    
    syncJourney();
  }, [user, journeys, planHistory]);

  // Set up global navigation helper for components
  useEffect(() => {
    (window as any).navigationView = setView;
    return () => { delete (window as any).navigationView; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <Crown className="w-16 h-16 text-gold mx-auto mb-6" />
            <h1 className="text-5xl font-serif mb-2 gold-text">Escola da Unidade</h1>
            <p className="text-white/60 mb-8 text-sm max-w-sm mx-auto">
              intervenções transformadoras focadas na reprogramação da mentalidade humana para superar traumas, medos e limitações
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl text-left shadow-2xl">
              <h2 className="text-2xl font-serif mb-6 text-white text-center gold-text font-bold">Entrar na Plataforma</h2>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl p-4 mb-6">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-bold">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 text-base font-bold bg-gold text-black hover:bg-gold/90 transition-all shadow-lg shadow-gold/10 mt-6"
                >
                  {authLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    'Entrar na Escola'
                  )}
                </Button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Modo Desenvolvimento</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleMockLogin('admin')}
                  className="text-xs py-3 flex items-center justify-center gap-2 border-white/10 hover:bg-white/5 hover:text-white"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Mestre (Admin)
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleMockLogin('user')}
                  className="text-xs py-3 flex items-center justify-center gap-2 border-white/10 hover:bg-white/5 hover:text-white"
                >
                  <UserIcon className="w-4 h-4" />
                  Explorador (User)
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </ErrorBoundary>
    );
  }

  const mabiJourney = journeys?.find(j => j.id === activeJourneyId) || journeys?.find(j => !!j.mabiGoal);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-luxury-black text-white pb-20">
        <Header 
          profile={profile} 
          onLogout={handleLogout} 
          onHome={() => {
            setView('plan');
            setActiveQuiz(null);
            setActiveQuizResult(null);
            setActiveMatrix(null);
            setActiveMatrixResult(null);
            setActiveProtocol(null);
          }} 
        />

        <main className="max-w-7xl mx-auto px-6">
          {activeQuiz ? (
            <QuizPlayer 
              quiz={activeQuiz} 
              userId={user.uid}
              journeyId={activeJourneyId || undefined}
              viewResult={activeQuizResult || undefined}
              onComplete={() => {
                setActiveQuiz(null);
                setActiveQuizResult(null);
                if (activeJourneyId) {
                  setView('matrices');
                } else {
                  setView('estacoes');
                }
              }}
              onBack={() => {
                setActiveQuiz(null);
                setActiveQuizResult(null);
              }}
            />
          ) : activeMatrix ? (
            <MatrixPlayer 
              matrix={activeMatrix}
              userId={user.uid}
              journeyId={activeJourneyId || undefined}
              viewResult={activeMatrixResult || undefined}
              inheritedContext={journeys.find(j => j.id === activeJourneyId)?.context}
              contextPrompt={(() => {
                const journey = journeys.find(j => j.id === activeJourneyId);
                return journey?.steps?.find(s => s.id === activeMatrix.id)?.contextPrompt;
              })()}
              onComplete={async (resultText) => {
                const journeyId = activeJourneyId;
                const matrixId = activeMatrix.id;

                if (journeyId && resultText) {
                  const journey = journeys.find(j => j.id === journeyId);
                  if (journey) {
                    try {
                      const newSummary = await summarizeContext(journey.context || '', resultText);
                      await updateDoc(doc(db, 'journeys', journeyId), {
                        context: newSummary
                      });
                    } catch (err) {
                      console.error("Error updating journey context:", err);
                    }
                  }
                }

                setActiveMatrix(null);
                setActiveMatrixResult(null);
                if (activeJourneyId) {
                  setView('matrices');
                } else {
                  setView('estacoes');
                }
              }}
              onBack={() => {
                setActiveMatrix(null);
                setActiveMatrixResult(null);
              }}
            />
          ) : (
            <>
              {view === 'library' && (
                <LibraryView 
                  quizzes={quizzes} 
                  categories={categories}
                  onSelect={(q) => setActiveQuiz(q)}
                  history={history}
                  isAdmin={profile?.role === 'admin'}
                  activeJourneyId={activeJourneyId}
                  journeys={journeys}
                />
              )}
              {view === 'matrices' && (
                <MatrixLibraryView 
                  onSelect={(m) => setActiveMatrix(m)} 
                  journeys={journeys}
                  activeJourneyId={activeJourneyId}
                  planHistory={planHistory}
                  protocolHistory={protocolHistory}
                  onSelectStaticProtocol={(protocolId, targetPerson) => {
                    const protocol = PROTOCOLS.find(p => p.id === protocolId);
                    if (protocol) {
                      setActiveProtocol(protocol);
                      setActiveTargetPerson(targetPerson || null);
                      setView('protocols');
                    } else {
                      console.log(`Processo ${protocolId} não encontrado.`);
                    }
                  }}
                  onGoToChronogram={() => setView('ativacao')}
                />
              )}
              {view === 'ativacao' && (
                <div className="py-8 px-4 max-w-6xl mx-auto space-y-10">
                  {mabiJourney ? (
                    <MabiAtivacaoView 
                      journey={mabiJourney} 
                      protocolHistory={protocolHistory}
                      onSelectStaticProtocol={(protocolId) => {
                        const protocol = PROTOCOLS.find(p => p.id === protocolId);
                        if (protocol) {
                          setActiveProtocol(protocol);
                          setView('protocols');
                        } else {
                          console.log(`Processo ${protocolId} não encontrado.`);
                        }
                      }}
                    />
                  ) : (
                    <div className="p-8 text-center bg-white/[0.01] border-white/5 rounded-xl">
                      <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
                        Nenhum diagnóstico ou jornada ativa encontrada. Preencha o mapeamento em <b>Alianças</b> e <b>Padrões</b> primeiro para ver o cronograma clínico de ações.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {view === 'admin' && profile?.role === 'admin' && (
                <AdminDashboard 
                  categories={categories}
                  userId={user.uid}
                  onBack={() => setView('library')}
                />
              )}
              {view === 'estacoes' && (
                <HistoryView 
                  history={history}
                  matrixHistory={matrixHistory}
                  protocolHistory={protocolHistory}
                  planHistory={planHistory}
                  quizzes={quizzes}
                  activeJourneyId={activeJourneyId}
                  journeys={journeys}
                  onBack={() => setView('plan')}
                  onSelectQuiz={(q, result) => {
                    setActiveQuiz(q);
                    if (result) setActiveQuizResult(result);
                  }}
                  onViewMatrixResult={(m, result) => {
                    setActiveMatrix(m);
                    setActiveMatrixResult(result);
                  }}
                  onSelectProtocol={(p, result) => {
                    setActiveProtocol(p);
                    if (result) setActiveProtocolResult(result);
                    setView('protocols');
                  }}
                  onDeleteUserResult={(id) => deleteResult('user_results', id)}
                  onDeleteMatrixResult={(id) => deleteResult('matrix_results', id)}
                  onDeleteProtocolResult={(id) => deleteResult('protocolResults', id)}
                  onDeletePlanResult={(id) => deleteResult('enjoymentPlans', id)}
                />
              )}
              {view === 'plan' && user && (
                <EnjoymentPlanFlow 
                  userId={user.uid}
                  journeyId={activeJourneyId || undefined}
                  onBack={() => setView('protocols')}
                  onComplete={() => setView('padroes')}
                  mode="aliancas"
                />
              )}
              {view === 'padroes' && user && (
                <EnjoymentPlanFlow 
                  userId={user.uid}
                  journeyId={activeJourneyId || undefined}
                  onBack={() => setView('plan')}
                  onComplete={() => setView('matrices')}
                  mode="padroes"
                />
              )}
              {view === 'protocols' && !activeProtocol && (
                <ProtocolLibraryView 
                  onSelect={(p) => setActiveProtocol(p)}
                  journeys={journeys}
                  activeJourneyId={activeJourneyId}
                />
              )}
              {view === 'protocols' && activeProtocol && user && (
                <ProtocolPlayer 
                  userId={user.uid}
                  journeyId={activeJourneyId || undefined}
                  protocol={activeProtocol}
                  targetPerson={activeTargetPerson}
                  viewResult={activeProtocolResult || undefined}
                  journeys={journeys}
                  profile={profile}
                  onBack={() => {
                    const wasViewing = !!activeProtocolResult;
                    setActiveProtocol(null);
                    setActiveProtocolResult(null);
                    setActiveTargetPerson(null);
                    if (wasViewing) {
                      setView('estacoes');
                    }
                  }}
                  onComplete={() => {
                    const wasViewing = !!activeProtocolResult;
                    setActiveProtocol(null);
                    setActiveProtocolResult(null);
                    setActiveTargetPerson(null);
                    if (wasViewing) {
                      setView('estacoes');
                    } else {
                      setView('ativacao');
                    }
                  }}
                />
              )}
            </>
          )}
        </main>

        {!activeQuiz && !activeMatrix && (
          <Navbar 
            view={view} 
            setView={setView} 
            isAdmin={profile?.role === 'admin'} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
