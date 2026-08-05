import React, { useState, useEffect } from 'react';

export default function PlanningTogetherView({ currentUser }) {
  const userId = currentUser?.id || currentUser?.email || 'default_user';

  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem(`celebrateit_team_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`celebrateit_tasks_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  useEffect(() => {
    const savedTeam = localStorage.getItem(`celebrateit_team_${userId}`);
    const savedTasks = localStorage.getItem(`celebrateit_tasks_${userId}`);
    setTeamMembers(savedTeam ? JSON.parse(savedTeam) : []);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`celebrateit_team_${userId}`, JSON.stringify(teamMembers));
  }, [teamMembers, userId]);

  useEffect(() => {
    localStorage.setItem(`celebrateit_tasks_${userId}`, JSON.stringify(tasks));
  }, [tasks, userId]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setTeamMembers([...teamMembers, { 
      id: 'tm_' + Date.now(), 
      name: newMemberName.trim(), 
      role: newMemberRole.trim() || 'Helper' 
    }]);
    setNewMemberName('');
    setNewMemberRole('');
    setShowInviteForm(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, {
      id: 'tsk_' + Date.now(),
      title: newTaskTitle.trim(),
      assigneeId: newTaskAssignee,
      dueDate: newTaskDate,
      completed: false
    }]);
    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDate('');
    setShowTaskForm(false);
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F5F2] py-24 px-4 sm:px-6 lg:px-12 font-sans pt-32">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9E784B]">
            PLANNING TOGETHER
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1816] mt-2">
            The people helping you plan.
          </h1>
          <p className="text-[#1A1816]/80 mt-2 max-w-2xl text-sm md:text-base">
            You're not doing this alone. Bring in family and friends, share the load warmly, and keep every conversation in one calm place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Team Members */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                YOUR CIRCLE
              </span>
              <button 
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="text-xs font-semibold text-[#1A1816] hover:text-[#9E784B] transition-colors cursor-pointer bg-white border border-[#E6DED6] px-3 py-1.5 rounded-lg shadow-sm"
              >
                + Invite
              </button>
            </div>

            {showInviteForm && (
              <form onSubmit={handleInvite} className="bg-white p-4 border border-[#E6DED6] rounded-xl space-y-3 shadow-sm">
                <input
                  type="text"
                  placeholder="Name (e.g. Sarah)"
                  required
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9E784B]"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Maid of Honor)"
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value)}
                  className="w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9E784B]"
                />
                <button type="submit" className="w-full bg-[#1A1816] text-white py-2 rounded-lg text-xs font-semibold cursor-pointer">
                  Add to Circle
                </button>
              </form>
            )}

            <div className="space-y-3">
              {teamMembers.length === 0 ? (
                <div className="bg-white border border-[#E6DED6] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#1A1816]/60">Your circle is empty. Invite someone to start delegating.</p>
                </div>
              ) : (
                teamMembers.map(member => (
                  <div key={member.id} className="bg-white border border-[#E6DED6] rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#F9F5F2] border border-[#E6DED6] flex items-center justify-center text-xs font-bold text-[#9E784B]">
                      {member.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#1A1816]">{member.name}</div>
                      <div className="text-xs text-[#1A1816]/60">{member.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Tasks */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9E784B]">
                SHARED TASKS
              </span>
              <button 
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="text-xs font-semibold text-[#1A1816] hover:text-[#9E784B] transition-colors cursor-pointer bg-white border border-[#E6DED6] px-3 py-1.5 rounded-lg shadow-sm"
              >
                + Assign Task
              </button>
            </div>

            {showTaskForm && (
              <form onSubmit={handleAddTask} className="bg-white p-5 border border-[#E6DED6] rounded-xl space-y-4 shadow-sm">
                <div>
                  <label className="text-[10px] font-semibold text-[#1A1816]/70 uppercase">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finalise guest list"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="mt-1 w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9E784B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-[#1A1816]/70 uppercase">Assign to</label>
                    <select
                      value={newTaskAssignee}
                      onChange={e => setNewTaskAssignee(e.target.value)}
                      className="mt-1 w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9E784B]"
                    >
                      <option value="">(Unassigned)</option>
                      {teamMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#1A1816]/70 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDate}
                      onChange={e => setNewTaskDate(e.target.value)}
                      className="mt-1 w-full bg-[#F9F5F2] border border-[#E6DED6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9E784B]"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-[#1A1816] text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                    Save Task
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="bg-white border border-[#E6DED6] rounded-xl p-8 text-center flex flex-col items-center">
                  <svg className="w-10 h-10 text-[#9E784B]/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm text-[#1A1816]/60">No tasks assigned yet.</p>
                </div>
              ) : (
                tasks.map(task => {
                  const assignee = teamMembers.find(m => m.id === task.assigneeId);
                  return (
                    <div key={task.id} className="bg-white border border-[#E6DED6] rounded-xl p-4 flex items-start gap-4 shadow-sm hover:border-[#9E784B]/50 transition-colors">
                      <div className="mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 accent-[#9E784B] cursor-pointer"
                        />
                      </div>
                      <div className={`flex-1 ${task.completed ? 'opacity-50' : ''}`}>
                        <div className={`font-semibold text-sm text-[#1A1816] ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#1A1816]/60">
                          {assignee && (
                            <span className="flex items-center gap-1.5 bg-[#F9F5F2] px-2 py-0.5 rounded-md">
                              <span className="w-4 h-4 rounded-full bg-[#9E784B] text-white flex items-center justify-center text-[8px] font-bold">
                                {assignee.name.substring(0,1).toUpperCase()}
                              </span>
                              {assignee.name}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
