import React, { useState, useMemo, useEffect } from 'react';
import { Check, Flame, Trophy, Plus, Trash2, Edit, X, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Habit } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LocalDate, ZoneId, ChronoUnit } from '@js-joda/core';
import '@js-joda/timezone';

// --- UTILITY FUNCTIONS ---
const getISODate = (date: LocalDate = LocalDate.now(ZoneId.systemDefault())) => date.toString();

const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = completedDates
    .map(d => LocalDate.parse(d))
    .sort((a, b) => b.compareTo(a));

  const today = LocalDate.now(ZoneId.systemDefault());
  const mostRecentDate = sortedDates[0];

  const diffDays = mostRecentDate.until(today, ChronoUnit.DAYS);

  if (diffDays > 1) {
    return 0;
  }

  let streak = 0;
  let expectedDate = mostRecentDate;

  for (const date of sortedDates) {
    if (date.equals(expectedDate)) {
      streak++;
      expectedDate = expectedDate.minusDays(1);
    } else {
      break; 
    }
  }

  return streak;
};


// --- CONFETTI ENGINE ---
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

const ConfettiExplosion: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#84a98c', '#52796f', '#f5c518', '#f9d74a', '#e76f51'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 1) * 10 - 5, // Upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        life: 1.0,
      });
    }
    setParticles(newParticles);
  }, [x, y]);

  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.5, // Gravity
        life: p.life - 0.05
      })).filter(p => p.life > 0));
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            opacity: p.life,
            transform: `scale(${p.life})`,
          }}
        />
      ))}
    </div>
  );
};

// --- TYPES ---
interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

type FilterType = 'All' | Habit['category'];

// --- MAIN COMPONENT ---
const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [confettiLoc, setConfettiLoc] = useState<{x: number, y: number} | null>(null);

  // Auto-clear confetti after animation
  useEffect(() => {
    if (confettiLoc) {
      const timer = setTimeout(() => setConfettiLoc(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [confettiLoc]);

  const handleToggleDate = (habitId: string, dateStr: string, e?: React.MouseEvent) => {
    const isToday = dateStr === getISODate();
    
    // Trigger confetti if completing today
    if (isToday && e) {
      const habit = habits.find(h => h.id === habitId);
      if (habit && !habit.completedDates.includes(dateStr)) {
         const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
         setConfettiLoc({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    }

    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const completed = h.completedDates.includes(dateStr);
        const newCompletedDates = completed
          ? h.completedDates.filter(d => d !== dateStr)
          : [...h.completedDates, dateStr];
        return { ...h, completedDates: newCompletedDates };
      }
      return h;
    }));
  };

  const handleSaveHabit = (habit: Habit) => {
    if (editingHabit) {
      setHabits(habits.map(h => h.id === habit.id ? habit : h));
    } else {
      setHabits([...habits, { ...habit, id: `habit-${Date.now()}` }]);
    }
    closeModal();
  };
  
  const handleDeleteHabit = (habitId: string) => {
      if (window.confirm("Are you sure you want to delete this habit?")) {
        setHabits(habits.filter(h => h.id !== habitId));
      }
  };

  const openModal = (habit: Habit | null = null) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
      setEditingHabit(null);
      setIsModalOpen(false);
  }

  const filteredHabits = useMemo(() => {
    if (activeFilter === 'All') return habits;
    return habits.filter(h => h.category === activeFilter);
  }, [habits, activeFilter]);

  return (
    <div className="h-full space-y-8 animate-fade-in pb-8 relative">
      {confettiLoc && <ConfettiExplosion x={confettiLoc.x} y={confettiLoc.y} />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-text">Habit Tracker</h2>
          <p className="text-brand-text/80 mt-1">Consistency is the key to transformation.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-white/40 p-1 rounded-lg border border-brand-text/10">
                {(['All', 'Health', 'Productivity', 'Mindfulness'] as FilterType[]).map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            activeFilter === filter 
                            ? 'bg-white shadow-sm text-brand-primary' 
                            : 'text-brand-text/60 hover:text-brand-text hover:bg-white/50'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
             </div>
            <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transform hover:-translate-y-0.5"
            >
            <Plus size={20} />
            <span>New Habit</span>
            </button>
        </div>
      </div>
      
      {/* Mobile Filter */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-2 px-2 flex space-x-2 hide-scrollbar">
         {(['All', 'Health', 'Productivity', 'Mindfulness'] as FilterType[]).map((filter) => (
            <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeFilter === filter 
                    ? 'bg-brand-primary text-white border-brand-primary' 
                    : 'bg-white/40 border-brand-text/10 text-brand-text/70'
                }`}
            >
                {filter}
            </button>
        ))}
      </div>

      <HabitStatsDashboard habits={habits} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
            <HabitCard 
                key={habit.id} 
                habit={habit}
                onToggleDate={handleToggleDate}
                onEdit={() => openModal(habit)}
                onDelete={handleDeleteHabit}
            />
            ))
        ) : (
            <div className="col-span-full py-16 text-center text-brand-text/50 border-2 border-dashed border-brand-text/10 rounded-2xl flex flex-col items-center justify-center">
                <p className="text-lg">No habits found for this category.</p>
                <button onClick={() => setActiveFilter('All')} className="text-brand-primary font-medium mt-2 hover:underline">Clear filters</button>
            </div>
        )}
      </div>
      
      {isModalOpen && (
          <AddEditHabitModal 
            habit={editingHabit}
            onSave={handleSaveHabit}
            onClose={closeModal}
          />
      )}
    </div>
  );
};


// --- SUB-COMPONENTS ---

const HabitStatsDashboard: React.FC<{ habits: Habit[] }> = ({ habits }) => {
    const todayStr = getISODate();
    const stats = useMemo(() => {
        const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
        const totalHabits = habits.length;
        const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
        const longestStreak = Math.max(0, ...habits.map(h => calculateStreak(h.completedDates)));
        
        // Calculate "Perfect Days" (last 30 days)
        let perfectDays = 0;
        if (totalHabits > 0) {
            for (let i = 0; i < 30; i++) {
                const d = LocalDate.now(ZoneId.systemDefault()).minusDays(i);
                const iso = getISODate(d);
                const allDone = habits.every(h => h.completedDates.includes(iso));
                if (allDone) perfectDays++;
            }
        }

        return { completedToday, totalHabits, progress, longestStreak, perfectDays };
    }, [habits, todayStr]);

    const pieData = [{ value: stats.progress }, { value: Math.max(0.1, 100 - stats.progress) }];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Progress Circle */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-text/10 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-brand-primary/20"></div>
                
                <div className="flex items-center space-x-8 z-10 w-full">
                    <div className="w-28 h-28 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    dataKey="value" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={40} 
                                    outerRadius={50} 
                                    startAngle={90} 
                                    endAngle={-270} 
                                    cornerRadius={10} 
                                    paddingAngle={stats.progress > 0 && stats.progress < 100 ? 5 : 0}
                                >
                                    <Cell fill="#84a98c" stroke="none" />
                                    <Cell fill="#e0e0e0" stroke="none" opacity={0.3} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-brand-text">{Math.round(stats.progress)}%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-brand-text">Today's Focus</h3>
                        <p className="text-brand-text/60 text-sm mt-1 mb-3">
                            {stats.completedToday} of {stats.totalHabits} habits completed
                        </p>
                        <div className="h-2 w-full bg-brand-text/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary transition-all duration-1000 ease-out" style={{ width: `${stats.progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <StatCard 
                icon={TrendingUp} 
                title="Current Best Streak" 
                value={`${stats.longestStreak} Days`} 
                color="orange"
                trend="Keep it burning!"
            />
             <StatCard 
                icon={Trophy} 
                title="Perfect Days (30d)" 
                value={`${stats.perfectDays} Days`} 
                color="indigo"
                trend={stats.totalHabits > 0 ? "100% Consistency" : "Start tracking!"}
            />
        </div>
    );
};

const StatCard: React.FC<{icon: React.ElementType, title: string, value: string, color: string, trend: string}> = ({icon: Icon, title, value, color, trend}) => (
    <div className={`bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-text/10 flex flex-col justify-between group hover:border-${color}-500/30 transition-all hover:-translate-y-1`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/10 text-${color}-600 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
        </div>
        <div>
            <p className="text-3xl font-bold text-brand-text mb-1">{value}</p>
            <p className="text-brand-text/70 text-sm font-medium">{title}</p>
            <p className={`text-xs text-${color}-600 mt-2 font-medium bg-${color}-50 inline-block px-2 py-0.5 rounded-full`}>{trend}</p>
        </div>
    </div>
);


const HabitCard: React.FC<{ 
    habit: Habit, 
    onToggleDate: (id: string, date: string, e?: React.MouseEvent) => void, 
    onEdit: () => void, 
    onDelete: (id: string) => void 
}> = ({ habit, onToggleDate, onEdit, onDelete }) => {
    const [showHistory, setShowHistory] = useState(false);
    const isCompletedToday = habit.completedDates.includes(getISODate());
    const streak = useMemo(() => calculateStreak(habit.completedDates), [habit.completedDates]);

    // Determine fire color based on streak
    const getFireColor = () => {
        if (streak >= 21) return 'text-purple-600 drop-shadow-[0_0_8px_rgba(147,51,234,0.5)]';
        if (streak >= 7) return 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]';
        if (streak >= 3) return 'text-orange-500';
        return 'text-slate-400/50';
    };

    return (
        <div className={`bg-white/70 backdrop-blur-md border border-brand-text/10 rounded-2xl p-5 flex flex-col transition-all duration-300 ${isCompletedToday ? 'shadow-md shadow-brand-primary/5 border-brand-primary/30' : 'hover:border-brand-text/20 hover:shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${habit.category === 'Health' ? 'bg-emerald-100 text-emerald-800' : 
                          habit.category === 'Mindfulness' ? 'bg-indigo-100 text-indigo-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {habit.category}
                    </span>
                    <h4 className="text-xl font-bold text-brand-text mt-2 leading-tight">{habit.title}</h4>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className={`flex items-center space-x-1 ${getFireColor()} transition-all duration-500`}>
                        <Flame size={20} className={streak > 0 ? "fill-current animate-pulse-slow" : ""} />
                        <span className="text-xl font-black">{streak}</span>
                    </div>
                    <span className="text-[10px] text-brand-text/40 font-medium uppercase tracking-wide mt-0.5">Day Streak</span>
                </div>
            </div>
            
            {/* Quick Week View - Interactive */}
            {!showHistory && (
                <WeeklyProgress 
                    completedDates={habit.completedDates} 
                    onToggle={(date) => onToggleDate(habit.id, date)}
                />
            )}
            
            {/* Extended History View */}
            {showHistory && <MonthlyHeatmap completedDates={habit.completedDates} />}

            <div className="mt-5 pt-4 border-t border-brand-text/5 flex items-center justify-between">
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${showHistory ? 'bg-brand-text/5 text-brand-text' : 'text-brand-text/50 hover:bg-brand-text/5 hover:text-brand-text'}`}
                >
                    <Calendar size={14} />
                    <span>{showHistory ? 'Hide History' : 'History'}</span>
                    {showHistory ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center pr-2 border-r border-brand-text/10">
                        <button onClick={onEdit} className="p-2 text-brand-text/40 hover:text-brand-primary transition-colors hover:bg-brand-primary/5 rounded-full"><Edit size={16} /></button>
                        <button onClick={() => onDelete(habit.id)} className="p-2 text-brand-text/40 hover:text-red-500 transition-colors hover:bg-red-500/5 rounded-full"><Trash2 size={16} /></button>
                    </div>

                    <button 
                        onClick={(e) => onToggleDate(habit.id, getISODate(), e)}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                            isCompletedToday 
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105' 
                            : 'bg-brand-bg border-2 border-brand-text/10 text-brand-text/20 hover:border-brand-primary/50 hover:text-brand-primary'
                        }`}
                        title={isCompletedToday ? 'Mark Incomplete' : 'Mark Complete'}
                    >
                        <Check size={24} className={`transition-transform duration-300 ${isCompletedToday ? 'scale-110' : 'scale-100 group-hover:scale-110'}`} />
                        {isCompletedToday && (
                            <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-brand-primary"></span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const WeeklyProgress: React.FC<{ completedDates: string[], onToggle: (date: string) => void }> = ({ completedDates, onToggle }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = LocalDate.now(ZoneId.systemDefault());
    
    // Generate last 7 days including today
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        return today.minusDays(6 - i);
    });
    
    return (
        <div className="flex justify-between items-center bg-brand-bg/30 p-3 rounded-xl">
            {last7Days.map((date, i) => {
                const dateString = date.toString();
                const isCompleted = completedDates.includes(dateString);
                const isToday = today.equals(date);
                const dayName = weekDays[date.dayOfWeek().value() % 7];

                return (
                    <button 
                        key={i} 
                        onClick={() => onToggle(dateString)}
                        className="flex flex-col items-center gap-1.5 relative group focus:outline-none"
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 
                            ${isCompleted 
                                ? 'bg-brand-primary text-white shadow-sm scale-100' 
                                : isToday 
                                    ? 'bg-white border-2 border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10' 
                                    : 'bg-white/50 text-brand-text/30 hover:bg-brand-text/5 hover:text-brand-text/60'
                            }`}
                        >
                            {isCompleted ? <Check size={14} strokeWidth={3} /> : date.dayOfMonth()}
                        </div>
                        <span className={`text-[10px] font-semibold tracking-wide uppercase ${isToday ? 'text-brand-primary' : 'text-brand-text/40'}`}>
                            {dayName.charAt(0)}
                        </span>
                        
                        {/* Tooltip for date */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {isToday ? "Today" : date.toString()}
                        </div>
                    </button>
                )
            })}
        </div>
    );
};

const MonthlyHeatmap: React.FC<{ completedDates: string[] }> = ({ completedDates }) => {
    const today = LocalDate.now(ZoneId.systemDefault());
    // Generate last 28 days for a perfect 4x7 grid
    const days = Array.from({ length: 28 }).map((_, i) => {
        return today.minusDays(27 - i);
    });

    return (
        <div className="animate-fade-in-fast bg-brand-bg/30 p-4 rounded-xl">
            <h5 className="text-xs font-bold text-brand-text/60 mb-3 uppercase tracking-wider">Last 4 Weeks</h5>
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, i) => {
                    const isCompleted = completedDates.includes(date.toString());
                    const isToday = date.equals(today);
                    return (
                        <div 
                            key={i} 
                            className={`aspect-square rounded-md transition-all duration-300 relative group
                                ${isCompleted 
                                    ? 'bg-brand-primary shadow-sm' 
                                    : 'bg-white/40'
                                } 
                                ${isToday ? 'ring-2 ring-brand-accent ring-offset-1 ring-offset-brand-bg/30' : ''}
                            `}
                        >
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded z-10">
                                {date.toString()}
                            </div>
                        </div>
                    )
                })}
            </div>
             <div className="flex justify-between items-center mt-3 text-[10px] text-brand-text/40 font-medium">
                <span>4 Weeks Ago</span>
                <span>Today</span>
            </div>
        </div>
    )
}

const AddEditHabitModal: React.FC<{habit: Habit | null, onSave: (habit: Habit) => void, onClose: () => void}> = ({ habit, onSave, onClose }) => {
    const [title, setTitle] = useState(habit?.title || '');
    const [category, setCategory] = useState<Habit['category']>(habit?.category || 'Health');
    const categories: Habit['category'][] = ['Health', 'Productivity', 'Mindfulness'];
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({
            id: habit?.id || '',
            title: title.trim(),
            category,
            streak: habit?.streak || 0, // Streak is recalculated
            completedDates: habit?.completedDates || []
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in-fast px-4">
            <div className="bg-white border border-brand-text/10 rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-brand-text">{habit ? 'Edit Habit' : 'Create New Habit'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-bg text-brand-text/60 hover:text-brand-text transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-brand-text/80 mb-2">What do you want to achieve?</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g., Read for 30 minutes" 
                            className="w-full bg-brand-bg/30 border border-brand-text/20 rounded-xl px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-lg placeholder:text-brand-text/30" 
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-text/80 mb-2">Category</label>
                        <div className="grid grid-cols-3 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`py-3 rounded-xl text-sm font-semibold transition-all border ${
                                        category === cat 
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-md transform scale-105' 
                                        : 'bg-white border-brand-text/10 text-brand-text/60 hover:border-brand-text/30'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-semibold text-brand-text/60 hover:bg-brand-bg transition-colors">Cancel</button>
                        <button type="submit" className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all hover:-translate-y-0.5">
                            {habit ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HabitTracker;
