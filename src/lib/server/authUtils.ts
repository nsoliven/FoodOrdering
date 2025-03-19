import supabase from "@/lib/server/supabaseServer";

export async function getUserFromRequest(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Missing or invalid authorization header' };
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Auth error:', error.message);
      return { user: null, error: error.message };
    }
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Unexpected auth error:', error.message);
    return { user: null, error: 'Server error during authentication' };
  }
}

export async function isUserAdmin(userId: string | undefined) {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('group')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error checking admin status:', error?.message);
      return false;
    }
    
    return data.group === 'ADMIN';
  } catch (error: any) {
    console.error('Unexpected error checking admin status:', error.message);
    return false;
  }
}

export async function requireAuth(request: Request) {
  const { user, error } = await getUserFromRequest(request);
  
  if (error || !user) {
    return { 
      authenticated: false, 
      user: null, 
      error: error || 'Authentication required'
    };
  }
  
  return { authenticated: true, user, error: null };
}

export async function requireAdmin(request: Request) {
  const { authenticated, user, error } = await requireAuth(request);
  
  if (!authenticated || !user) {
    return { 
      authorized: false, 
      user: null, 
      error: error || 'Authentication required'
    };
  }

  const isAdmin = await isUserAdmin(user.id);
  
  if (!isAdmin) {
    return { 
      authorized: false, 
      user, 
      error: 'Admin privileges required'
    };
  }
  
  return { authorized: true, user, error: null };
}
