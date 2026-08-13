import { supabase } from '../supabaseClient';

// Helper: Map vendor profile from DB (snake_case) to UI (camelCase)
export function mapVendorFromDb(v) {
  if (!v) return null;
  return {
    id: v.id,
    businessName: v.business_name,
    category: v.category,
    areasServed: v.areas_served || [],
    celebrationsServed: v.celebrations_served,
    priceFrom: Number(v.price_from),
    rating: Number(v.rating || 5.0),
    reviewsCount: Number(v.reviews_count || 0),
    description: v.description || '',
    completenessScore: Number(v.completeness_score || 0),
    isLive: v.is_live,
    coverPhoto: v.cover_photo || '',
    photos: v.photos || []
  };
}

// Helper: Map vendor profile from UI (camelCase) to DB (snake_case)
export function mapVendorToDb(v) {
  if (!v) return null;
  return {
    id: v.id,
    business_name: v.businessName,
    category: v.category,
    areas_served: v.areasServed,
    celebrations_served: v.celebrationsServed,
    price_from: v.priceFrom,
    rating: v.rating,
    reviews_count: v.reviewsCount,
    description: v.description,
    completeness_score: v.completenessScore,
    is_live: v.isLive,
    cover_photo: v.coverPhoto,
    photos: v.photos
  };
}

// Helper: Map enquiry from DB to UI
export function mapEnquiryFromDb(e) {
  if (!e) return null;
  const vName = e.vendor?.vendor_profile?.[0]?.business_name || 
                e.vendor?.vendor_profile?.business_name || 
                e.vendor?.name || 
                'Vendor';
  return {
    id: e.id,
    brideId: e.bride_id,
    brideName: e.bride?.name || 'Bride',
    vendorId: e.vendor_id,
    vendorName: vName,
    celebrationId: e.celebration_id,
    celebrationType: e.celebration?.title || 'Wedding',
    date: e.celebration?.date || '',
    area: e.celebration?.area || '',
    guestCount: e.celebration?.guest_count || 0,
    budgetBand: e.celebration ? `R ${Number(e.celebration.budget).toLocaleString('en-ZA')}` : '',
    status: e.status,
    messages: e.messages || [],
    createdAt: e.created_at
  };
}

// Helper: Enforce that the authenticated user is either the owner or an admin
async function assertUserAccess(targetUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Access Denied: Unauthenticated');
  }
  if (user.id === targetUserId) {
    return true;
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role === 'ADMIN') {
    return true;
  }
  throw new Error('Access Denied: Unauthorized access to user data');
}

// === PROFILES ===
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Notice fetching profile from DB:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Notice fetching profile:', err);
    return null;
  }
}

// === VENDORS ===
export async function getVendors() {
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .order('business_name', { ascending: true });

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
  return data.map(mapVendorFromDb);
}

export async function saveVendorProfile(vendor) {
  await assertUserAccess(vendor.id);
  const dbData = mapVendorToDb(vendor);
  const { data, error } = await supabase
    .from('vendor_profiles')
    .upsert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error saving vendor profile:', error);
    throw error;
  }
  return mapVendorFromDb(data);
}

export async function deleteVendorProfile(vendorId) {
  // Only admins can delete vendor profiles
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Access Denied: Unauthenticated');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role !== 'ADMIN') {
    throw new Error('Access Denied: Only admins can delete vendor profiles');
  }

  const { error } = await supabase
    .from('vendor_profiles')
    .delete()
    .eq('id', vendorId);

  if (error) {
    console.error('Error deleting vendor profile:', error);
    throw error;
  }
}

// === BRIDES / WEDDINGS ===
export async function getBrideData(brideId) {
  await assertUserAccess(brideId);
  // 1. Fetch Profile
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', brideId)
    .single();

  if (profileErr || !profile) {
    console.error('Error fetching bride profile:', profileErr);
    return null;
  }

  // 2. Fetch Wedding
  const { data: wedding, error: weddingErr } = await supabase
    .from('weddings')
    .select('*')
    .eq('bride_id', brideId)
    .maybeSingle();

  if (weddingErr) {
    console.error('Error fetching wedding:', weddingErr);
    return null;
  }

  if (!wedding) {
    // Return partial bride to trigger onboarding
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: 'BRIDE',
      celebrations: []
    };
  }

  // 3. Fetch Celebrations
  const { data: celebrations, error: celebErr } = await supabase
    .from('celebrations')
    .select('*')
    .eq('wedding_id', wedding.id);

  if (celebErr) {
    console.error('Error fetching celebrations:', celebErr);
    return null;
  }

  const resultCelebrations = [];

  for (const c of (celebrations || [])) {
    // 4. Fetch checklist items
    const { data: checklist } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('celebration_id', c.id)
      .order('due_date', { ascending: true });

    // 5. Fetch budget lines
    const { data: budgetLines } = await supabase
      .from('budget_lines')
      .select('*')
      .eq('celebration_id', c.id);

    resultCelebrations.push({
      id: c.id,
      type: c.type,
      title: c.title,
      date: c.date,
      area: c.area,
      guestCount: Number(c.guest_count),
      budget: Number(c.budget),
      checklist: (checklist || []).map(item => ({
        id: item.id,
        title: item.title,
        dueDate: item.due_date,
        done: item.done
      })),
      budgetLines: (budgetLines || []).map(line => ({
        id: line.id,
        category: line.category,
        planned: Number(line.planned),
        actuallySpent: Number(line.actually_spent),
        linkedVendor: line.linked_vendor || ''
      }))
    });
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: 'BRIDE',
    weddingId: wedding.id,
    overallBudget: Number(wedding.overall_budget),
    style: wedding.style || '',
    colours: wedding.colours || [],
    celebrations: resultCelebrations
  };
}

export async function saveBrideOnboarding(brideId, overallBudget, celebrations) {
  await assertUserAccess(brideId);
  // 1. Create wedding
  const { data: wedding, error: weddingErr } = await supabase
    .from('weddings')
    .insert({
      bride_id: brideId,
      overall_budget: overallBudget
    })
    .select()
    .single();

  if (weddingErr) {
    console.error('Error creating wedding:', weddingErr);
    throw weddingErr;
  }

  const savedCelebrations = [];

  for (const c of celebrations) {
    // 2. Create celebration
    const { data: celebration, error: celebErr } = await supabase
      .from('celebrations')
      .insert({
        wedding_id: wedding.id,
        type: c.type,
        title: c.title,
        date: c.date,
        area: c.area,
        budget: c.budget,
        guest_count: c.guestCount
      })
      .select()
      .single();

    if (celebErr) {
      console.error('Error creating celebration:', celebErr);
      throw celebErr;
    }

    // 3. Create checklist items
    const checklistToInsert = c.checklist.map(item => ({
      celebration_id: celebration.id,
      title: item.title,
      due_date: item.dueDate,
      done: item.done
    }));

    const { data: checklistData, error: checkErr } = await supabase
      .from('checklist_items')
      .insert(checklistToInsert)
      .select();

    if (checkErr) {
      console.error('Error creating checklist:', checkErr);
      throw checkErr;
    }

    // 4. Create budget lines
    const budgetLinesToInsert = c.budgetLines.map(line => ({
      celebration_id: celebration.id,
      category: line.category,
      planned: line.planned,
      actually_spent: line.actuallySpent,
      linked_vendor: line.linkedVendor
    }));

    const { data: budgetData, error: budgetErr } = await supabase
      .from('budget_lines')
      .insert(budgetLinesToInsert)
      .select();

    if (budgetErr) {
      console.error('Error creating budget lines:', budgetErr);
      throw budgetErr;
    }

    savedCelebrations.push({
      id: celebration.id,
      type: celebration.type,
      title: celebration.title,
      date: celebration.date,
      area: celebration.area,
      guestCount: Number(celebration.guest_count),
      budget: Number(celebration.budget),
      checklist: checklistData.map(item => ({
        id: item.id,
        title: item.title,
        dueDate: item.due_date,
        done: item.done
      })),
      budgetLines: budgetData.map(line => ({
        id: line.id,
        category: line.category,
        planned: Number(line.planned),
        actuallySpent: Number(line.actually_spent),
        linkedVendor: line.linked_vendor || ''
      }))
    });
  }

  return {
    id: brideId,
    weddingId: wedding.id,
    overallBudget: overallBudget,
    celebrations: savedCelebrations
  };
}

export async function updateWeddingBudget(weddingId, overallBudget) {
  const { error } = await supabase
    .from('weddings')
    .update({ overall_budget: overallBudget })
    .eq('id', weddingId);

  if (error) {
    console.error('Error updating wedding budget:', error);
    throw error;
  }
}

export async function updateCelebrationDetails(celebrationId, budget, guestCount, date, area) {
  const { error } = await supabase
    .from('celebrations')
    .update({
      budget: budget,
      guest_count: guestCount,
      date: date,
      area: area
    })
    .eq('id', celebrationId);

  if (error) {
    console.error('Error updating celebration details:', error);
    throw error;
  }
}

// === CHECKLIST ===
export async function addChecklistItem(celebrationId, title, dueDate) {
  const { data, error } = await supabase
    .from('checklist_items')
    .insert({
      celebration_id: celebrationId,
      title,
      due_date: dueDate,
      done: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding checklist item:', error);
    throw error;
  }
  return {
    id: data.id,
    title: data.title,
    dueDate: data.due_date,
    done: data.done
  };
}

export async function toggleChecklistItem(itemId, done) {
  const { error } = await supabase
    .from('checklist_items')
    .update({ done })
    .eq('id', itemId);

  if (error) {
    console.error('Error toggling checklist item:', error);
    throw error;
  }
}

export async function deleteChecklistItem(itemId) {
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting checklist item:', error);
    throw error;
  }
}

// === BUDGET LINES ===
export async function addBudgetLine(celebrationId, category, planned, actuallySpent, linkedVendor) {
  const { data, error } = await supabase
    .from('budget_lines')
    .insert({
      celebration_id: celebrationId,
      category,
      planned,
      actually_spent: actuallySpent,
      linked_vendor: linkedVendor
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding budget line:', error);
    throw error;
  }
  return {
    id: data.id,
    category: data.category,
    planned: Number(data.planned),
    actuallySpent: Number(data.actually_spent),
    linkedVendor: data.linked_vendor || ''
  };
}

export async function updateBudgetLine(lineId, planned, actuallySpent, linkedVendor) {
  const { error } = await supabase
    .from('budget_lines')
    .update({
      planned,
      actually_spent: actuallySpent,
      linked_vendor: linkedVendor
    })
    .eq('id', lineId);

  if (error) {
    console.error('Error updating budget line:', error);
    throw error;
  }
}

export async function deleteBudgetLine(lineId) {
  const { error } = await supabase
    .from('budget_lines')
    .delete()
    .eq('id', lineId);

  if (error) {
    console.error('Error deleting budget line:', error);
    throw error;
  }
}

// === ENQUIRIES ===
export async function getEnquiries(userId, role) {
  if (role !== 'ADMIN') {
    await assertUserAccess(userId);
  }
  const column = role === 'BRIDE' ? 'bride_id' : 'vendor_id';
  const { data, error } = await supabase
    .from('enquiries')
    .select(`
      *,
      bride:profiles!bride_id(name),
      vendor:profiles!vendor_id(name, vendor_profile:vendor_profiles(business_name)),
      celebration:celebrations(*)
    `)
    .eq(column, userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }
  return data.map(mapEnquiryFromDb);
}

export async function createEnquiry(enquiry) {
  const { data, error } = await supabase
    .from('enquiries')
    .insert({
      bride_id: enquiry.brideId,
      vendor_id: enquiry.vendorId,
      celebration_id: enquiry.celebrationId,
      status: enquiry.status || 'SENT',
      messages: enquiry.messages
    })
    .select(`
      *,
      bride:profiles!bride_id(name),
      vendor:profiles!vendor_id(name, vendor_profile:vendor_profiles(business_name)),
      celebration:celebrations(*)
    `)
    .single();

  if (error) {
    console.error('Error sending enquiry:', error);
    throw error;
  }
  return mapEnquiryFromDb(data);
}

export async function updateEnquiryStatus(enquiryId, status) {
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', enquiryId);

  if (error) {
    console.error('Error updating enquiry status:', error);
    throw error;
  }
}

export async function updateEnquiryMessages(enquiryId, messages) {
  const { error } = await supabase
    .from('enquiries')
    .update({ messages })
    .eq('id', enquiryId);

  if (error) {
    console.error('Error updating enquiry messages:', error);
    throw error;
  }
}

// === SEARCH MISSES ===
export async function getSearchMisses() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') {
    console.error('Access Denied: Admin role context violation');
    return [];
  }
  const { data, error } = await supabase
    .from('search_misses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching search misses:', error);
    return [];
  }
  return data.map(sm => ({
    id: sm.id,
    category: sm.category,
    area: sm.area,
    createdAt: sm.created_at
  }));
}

export async function logSearchMiss(category, area) {
  const { error } = await supabase
    .from('search_misses')
    .insert({ category, area });

  if (error) {
    console.error('Error logging search miss:', error);
  }
}

// === PLANNING TOGETHER (TEAMS & TASKS) ===
export async function getPlanningTeam(userId) {
  const { data, error } = await supabase
    .from('planning_teams')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching planning team:', error);
    return [];
  }
  return data.map(m => ({
    id: m.id,
    name: m.name,
    role: m.role,
    email: m.email
  }));
}

export async function addPlanningTeamMember(userId, name, role, email) {
  await assertUserAccess(userId);
  const { data, error } = await supabase
    .from('planning_teams')
    .insert({
      user_id: userId,
      name,
      role,
      email
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding planning team member:', error);
    throw error;
  }
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    email: data.email
  };
}

export async function getPlanningTasks(userId) {
  const { data, error } = await supabase
    .from('planning_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching planning tasks:', error);
    return [];
  }
  return data.map(t => ({
    id: t.id,
    title: t.title,
    assigneeId: t.assignee_id,
    dueDate: t.due_date,
    completed: Boolean(t.completed)
  }));
}

export async function addPlanningTask(userId, title, assigneeId, dueDate) {
  await assertUserAccess(userId);
  const { data, error } = await supabase
    .from('planning_tasks')
    .insert({
      user_id: userId,
      title,
      assignee_id: assigneeId || null,
      due_date: dueDate || null,
      completed: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding planning task:', error);
    throw error;
  }
  return {
    id: data.id,
    title: data.title,
    assigneeId: data.assignee_id,
    dueDate: data.due_date,
    completed: Boolean(data.completed)
  };
}

export async function updatePlanningTaskStatus(taskId, completed) {
  const { error } = await supabase
    .from('planning_tasks')
    .update({ completed })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating planning task status:', error);
    throw error;
  }
}

// === DATABASE CLEANUP (ADMIN ONLY) ===
export async function deleteAllDatabaseData() {
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Access Denied: Unauthenticated');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role !== 'ADMIN') {
    throw new Error('Access Denied: Only admins can clear the database');
  }

  try {
    // Delete in order of foreign key dependencies (child tables first)
    const tables = [
      'budget_lines',
      'checklist_items',
      'planning_tasks',
      'planning_teams',
      'enquiries',
      'search_misses',
      'celebrations',
      'weddings',
      'vendor_profiles',
      'profiles'
    ];

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', ''); // Delete all rows (neq ensures it doesn't error on empty table)

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }
    }

    return { success: true, message: 'Database cleared successfully' };
  } catch (err) {
    console.error('Error clearing database:', err);
    throw err;
  }
}

