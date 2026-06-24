import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const email = process.argv[2] || 'umutkaraytu20@gmail.com';
  const password = process.argv[3] || 'Karaytumut.1';
  
  console.log(`Creating user: ${email}...`);

  // 1. Create or get user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  let userId;

  if (authError) {
    if (authError.message.includes('already been registered')) {
        console.log('User already exists, fetching user ID...');
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) {
            console.error('Error fetching users:', usersError);
            process.exit(1);
        }
        const existingUser = usersData.users.find(u => u.email === email);
        if (existingUser) {
            userId = existingUser.id;
        } else {
            console.error('Could not find existing user');
            process.exit(1);
        }
    } else {
        console.error('Error creating user:', authError);
        process.exit(1);
    }
  } else {
      userId = authData.user.id;
  }

  console.log(`User ID: ${userId}`);

  // 2. Add to admin_profiles
  const { error: profileError } = await supabase
    .from('admin_profiles')
    .upsert({
      user_id: userId,
      email: email,
      display_name: 'Admin',
      role: 'admin',
      is_active: true
    });

  if (profileError) {
    console.error('Error adding admin profile:', profileError);
    process.exit(1);
  }

  console.log('Admin user created and added to admin_profiles successfully!');
}

main().catch(console.error);
