export async function resetPassword(email: string, newPassword: string, code: string) {
  try {
    const response = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to reset password' };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error in resetPassword:', error);
    return { success: false, error: 'Network error while resetting password' };
  }
}