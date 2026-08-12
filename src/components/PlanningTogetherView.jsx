import React, { useState, useEffect } from 'react';

export default function PlanningTogetherView({ currentUser, bride }) {
  const userId = currentUser?.id || currentUser?.email || 'default_user';
  const brideName = currentUser?.name || bride?.name || 'Bride';

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
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  // Email Notification preview simulator state
  const [emailModal, setEmailModal] = useState({
    isOpen: false,
    memberName: '',
    memberRole: '',
    memberEmail: '',
    taskName: '',
    dueDate: ''
  });

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
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const newMember = { 
      id: 'tm_' + Date.now(), 
      name: newMemberName.trim(), 
      role: newMemberRole.trim() || 'Planning Committee Helper',
      email: newMemberEmail.trim()
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberEmail('');
    setShowInviteForm(false);

    // Trigger celebratory email mock dispatch modal
    setEmailModal({
      isOpen: true,
      memberName: newMember.name,
      memberRole: newMember.role,
      memberEmail: newMember.email,
      taskName: 'Review traditional/white wedding budget split guidelines',
      dueDate: 'Within 7 days'
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: 'tsk_' + Date.now(),
      title: newTaskTitle.trim(),
      assigneeId: newTaskAssignee,
      dueDate: newTaskDate,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDate('');
    setShowTaskForm(false);

    // If task is assigned to a member, show the celebratory task email preview
    if (newTask.assigneeId) {
      const assignee = teamMembers.find(m => m.id === newTask.assigneeId);
      if (assignee) {
        setEmailModal({
          isOpen: true,
          memberName: assignee.name,
          memberRole: assignee.role,
          memberEmail: assignee.email || 'partner@celebrateit.co.za',
          taskName: newTask.title,
          dueDate: newTask.dueDate || 'flexible date'
        });
      }
    }
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
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
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
                      <div className="text-xs text-[#1A1816]/60">{member.role} • {member.email || 'No email saved'}</div>
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

      {/* Email Invitation Sent Notification Simulator Modal */}
      {emailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E6DED6] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E6DED6] bg-[#F9F5F2] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#1A1816] flex items-center gap-2">
                  <span className="inline-block animate-pulse w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  CelebrateIT Email Notification Simulator
                </h3>
                <p className="text-xs text-[#1A1816]/70 mt-0.5">
                  Email invitation dispatched successfully to <span className="font-semibold text-[#9E784B]">{emailModal.memberEmail}</span>
                </p>
              </div>
              <button 
                onClick={() => setEmailModal({ ...emailModal, isOpen: false })}
                className="text-[#1A1816]/60 hover:text-[#1A1816] transition-colors p-2 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Email Container (simulating an email client interface) */}
            <div className="flex-1 p-6 overflow-y-auto bg-stone-100/50 space-y-4">
              
              {/* Email Envelope Details */}
              <div className="bg-white border border-[#E6DED6] rounded-xl p-4 shadow-sm text-xs space-y-2 text-stone-700">
                <div>
                  <span className="font-semibold">From:</span> CelebrateIT team &lt;notifications@celebrateit.co.za&gt;
                </div>
                <div>
                  <span className="font-semibold">To:</span> {emailModal.memberName} &lt;{emailModal.memberEmail}&gt;
                </div>
                <div className="border-t border-stone-100 pt-2 font-semibold text-[#1A1816] text-sm">
                  Subject: You’ve Been Chosen to Help Make {brideName}’s Big Day Special
                </div>
              </div>

              {/* Email Content Frame */}
              <div className="bg-white border border-[#E6DED6] rounded-xl p-8 sm:p-12 shadow-sm text-[#1A1816] font-serif leading-relaxed max-w-xl mx-auto space-y-6">
                
                {/* Brand Header */}
                <div className="text-center pb-6 border-b border-[#E6DED6]">
                  <div className="font-serif text-2xl font-bold tracking-wider text-[#1A1816]">CELEBRATE IT</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#9E784B] mt-1">Wedding Coordination Portal</div>
                </div>

                <p className="text-base">Hi {emailModal.memberName},</p>

                <p>
                  There’s something very special about being asked to stand beside someone you love as they prepare for one of the biggest days of their life.
                </p>

                <p>
                  We’re excited to let you know that <strong>{brideName} has chosen you as her {emailModal.memberRole}</strong> as she plans her wedding to her partner.
                </p>

                <p>
                  This means you have the wonderful opportunity to be part of her journey — helping her stay organised, making important decisions, and most importantly, being there for her along the way.
                </p>

                <div className="bg-[#F9F5F2] border-l-4 border-[#9E784B] p-4 font-sans text-sm rounded-r-lg space-y-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-[#9E784B]">Your Role: {emailModal.memberRole}</h4>
                  <p className="text-xs text-[#1A1816]/80 leading-relaxed">
                    As {emailModal.memberRole}, you’ll be helping {brideName} with:
                  </p>
                  <ul className="list-disc pl-4 text-xs text-[#1A1816]/80 space-y-1 mt-1">
                    <li>Coordinating ceremony and reception timelines</li>
                    <li>Managing task deliverables and vendor checklist options</li>
                    <li>Supporting wedding logistics and planning tasks</li>
                  </ul>
                </div>

                <div className="border-t border-[#E6DED6] pt-6 space-y-4">
                  <h4 className="font-serif text-lg font-semibold text-[#1A1816]">Your First Task</h4>
                  <div className="bg-white border border-[#E6DED6] p-4 rounded-xl font-sans text-sm flex justify-between items-center shadow-xs">
                    <div>
                      <div className="font-semibold text-[#1a1816]">{emailModal.taskName}</div>
                      <div className="text-xs text-stone-500 mt-1">Due Date: {emailModal.dueDate}</div>
                    </div>
                  </div>
                </div>

                <div className="text-center py-2 font-sans">
                  <button 
                    type="button"
                    onClick={() => setEmailModal({ ...emailModal, isOpen: false })}
                    className="inline-block bg-[#1A1816] text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-stone-800 transition-colors shadow-md cursor-pointer"
                  >
                    View Your Wedding Tasks
                  </button>
                </div>

                <p className="text-sm italic text-stone-600">
                  Please remember, this isn't about doing everything perfectly. It's about being there, lending a hand, and helping {brideName} enjoy the journey as much as possible.
                </p>

                <p className="text-sm font-sans text-stone-500">
                  Thank you for being someone {brideName} can count on. We’re so happy to have you as part of her wedding journey, and we can’t wait to see the beautiful memories you’ll help create together.
                </p>

                <div className="pt-6 border-t border-[#E6DED6] font-sans text-xs text-stone-500 space-y-1">
                  <div>With love,</div>
                  <div className="font-bold text-[#1A1816]">The CelebrateIT Team</div>
                  <div className="text-[10px] text-[#9E784B] font-semibold mt-1">Celebrating love. Planning together. Making the journey unforgettable.</div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
