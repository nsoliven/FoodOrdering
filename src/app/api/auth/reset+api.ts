import supabase from "@/lib/server/supabaseServer";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error: any) {
      return Response.json({
        error: "Invalid request format",
        details: error.message,
      }, { status: 400 });
    }

    const { email, newPassword, code } = body;

    if (!email || !newPassword || !code) {
      return Response.json({
        error: "Missing required fields",
        details: "Email, new password, and verification code are required",
      }, { status: 400 });
    }

    // Verify the code is valid
    const { data: resetCode, error: codeError } = await supabase
      .from('password_reset_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .single();

    if (codeError || !resetCode) {
      return Response.json({
        error: "Invalid verification code",
      }, { status: 400 });
    }

    // Check if code is expired
    if (new Date(resetCode.expires_at) < new Date()) {
      return Response.json({
        error: "Verification code has expired",
      }, { status: 400 });
    }

    // Find the user by email
    const { data, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      return Response.json({
        error: "Error retrieving user information",
        details: usersError.message
      }, { status: 500 });
    }
    
    // Find the user with the matching email
    const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return Response.json({
        error: "User not found",
      }, { status: 404 });
    }

    // Update the password for the user
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      return Response.json({
        error: "Failed to update password",
        details: updateError.message
      }, { status: 400 });
    }

    // Clean up the verification code
    await supabase
      .from('password_reset_codes')
      .delete()
      .eq('email', email.toLowerCase());

    return Response.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error: any) {
    console.error('Unexpected error in password reset:', error.message);
    return Response.json({
      error: "Server error during password reset",
      details: error.message,
    }, { status: 500 });
  }
}
