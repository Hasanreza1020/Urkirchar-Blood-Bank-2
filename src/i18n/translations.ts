export type Lang = 'bn' | 'en';

/**
 * Look up a translation key.
 * Falls back to Bengali, then English if a key is missing.
 */
export const t = (lang: Lang, key: keyof typeof translations): string => {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry['bn'] ?? entry['en'] ?? key;
};

export const translations = {
  // ── Navbar ──────────────────────────────────────────────────────────────
  nav_home:       { bn: 'হোম',             en: 'Home' },
  nav_find_donor: { bn: 'রক্তদাতা খুঁজুন', en: 'Find Donor' },
  nav_need_blood: { bn: 'রক্ত চাই',         en: 'Need Blood' },
  nav_admin:      { bn: 'অ্যাডমিন',         en: 'Admin' },
  nav_profile:    { bn: 'প্রোফাইল',          en: 'Profile' },
  nav_login:      { bn: 'লগইন',             en: 'Login' },
  nav_register:   { bn: 'নিবন্ধন',           en: 'Register' },
  nav_logout:     { bn: 'লগআউট',            en: 'Logout' },
  nav_powered_by: { bn: 'পরিচালিত: উরকিরচর শান্তি সংঘ', en: 'Powered by Urkirchar Shanti Shanga' },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero_badge:        { bn: 'উরকিরচর সমাজের সেবায়', en: 'Serving Urkirchar Community' },
  hero_title1:       { bn: 'রক্তদাতা খুঁজুন',       en: 'Find Blood Donors' },
  hero_title2:       { bn: 'জীবন বাঁচান',             en: 'Save Lives' },
  hero_subtitle:     { bn: 'উরকিরচরে যাচাইকৃত রক্তদাতাদের সাথে সংযুক্ত হন। প্রতিটি ফোঁটা রক্ত একটি জীবন বাঁচাতে পারে।', en: 'Connect with verified blood donors in Urkirchar. Every drop of blood can save a life.' },
  hero_find_donor:   { bn: 'রক্তদাতা খুঁজুন',         en: 'Find Donor' },
  hero_become_donor: { bn: 'দাতা হিসেবে নিবন্ধন',      en: 'Become a Donor' },

  // ── Stats ────────────────────────────────────────────────────────────────
  stat_total:     { bn: 'মোট দাতা',       en: 'Total Donors' },
  stat_verified:  { bn: 'যাচাইকৃত',        en: 'Verified' },
  stat_available: { bn: 'এখন উপলব্ধ',     en: 'Available Now' },

  // ── Blood group section ──────────────────────────────────────────────────
  search_by_group:     { bn: 'রক্তের গ্রুপ অনুযায়ী খুঁজুন',           en: 'Search by Blood Group' },
  search_by_group_sub: { bn: 'আপনার প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করুন', en: 'Select the blood group you need' },

  // ── Recent donors ────────────────────────────────────────────────────────
  recent_title: { bn: 'সাম্প্রতিক রক্তযোদ্ধারা',         en: 'Recent Blood Warriors' },
  recent_sub:   { bn: 'সম্প্রতি যোগ দেওয়া যাচাইকৃত রক্তদাতারা', en: 'Recently joined verified blood donors' },
  view_all:     { bn: 'সকল দাতা দেখুন',                   en: 'View All Donors' },

  // ── How it works ─────────────────────────────────────────────────────────
  how_title:   { bn: 'কীভাবে কাজ করে', en: 'How It Works' },
  step1_title: { bn: 'নিবন্ধন করুন',   en: 'Register' },
  step1_desc:  { bn: 'দাতা হিসেবে নিবন্ধন করুন এবং আপনার তথ্য দিন', en: 'Register as a donor and provide your details' },
  step2_title: { bn: 'যাচাইকরণ',       en: 'Verification' },
  step2_desc:  { bn: 'প্রশাসক আপনার প্রোফাইল যাচাই করবেন', en: 'Admin verifies your profile for authenticity' },
  step3_title: { bn: 'জীবন বাঁচান',    en: 'Save Lives' },
  step3_desc:  { bn: 'যারা রক্ত খুঁজছেন তারা আপনাকে খুঁজে পাবেন', en: 'People in need can find and contact you' },
  step_label:  { bn: 'ধাপ',             en: 'Step' },

  // ── CTA ──────────────────────────────────────────────────────────────────
  cta_title: { bn: 'আজই রক্তদাতা হন',                      en: 'Become a Donor Today' },
  cta_sub:   { bn: 'আপনার একটি সিদ্ধান্ত একটি জীবন বাঁচাতে পারে', en: 'Your one decision can save a life' },
  cta_btn:   { bn: 'এখনই নিবন্ধন করুন',                     en: 'Register Now' },

  // ── Emergency ────────────────────────────────────────────────────────────
  emergency: { bn: 'জরুরি অবস্থায় যোগাযোগ করুন', en: 'Emergency contact' },

  // ── Donor card ───────────────────────────────────────────────────────────
  card_verified:      { bn: 'যাচাইকৃত',          en: 'Verified' },
  card_available:     { bn: 'এখন পাওয়া যাচ্ছে', en: 'Available Now' },
  card_unavailable:   { bn: 'বর্তমানে অনুপলব্ধ', en: 'Unavailable' },
  card_last_donation: { bn: 'সর্বশেষ দান',        en: 'Last Donation' },
  card_call:          { bn: 'কল করুন',             en: 'Call' },
  card_whatsapp:      { bn: 'WhatsApp',            en: 'WhatsApp' },
  card_copy:          { bn: 'কপি',                 en: 'Copy' },
  card_copied:        { bn: 'কপি!',                en: 'Copied!' },
  card_location:      { bn: 'এলাকা',               en: 'Location' },
  card_blood_group:   { bn: 'রক্তের গ্রুপ',         en: 'Blood Group' },

  // ── Search page ──────────────────────────────────────────────────────────
  search_title:          { bn: 'রক্তদাতা খুঁজুন',                     en: 'Find Blood Donor' },
  search_sub:            { bn: 'উরকিরচরে যাচাইকৃত রক্তদাতা খুঁজুন',   en: 'Find verified blood donors in Urkirchar' },
  search_all_groups:     { bn: 'সব গ্রুপ',                              en: 'All Groups' },
  search_all_locations:  { bn: 'সব এলাকা',                              en: 'All Areas' },
  search_available_only: { bn: 'শুধু উপলব্ধ দাতা',                      en: 'Available only' },
  search_results:        { bn: 'ফলাফল পাওয়া গেছে',                     en: 'donors found' },
  search_no_results:     { bn: 'কোনো দাতা পাওয়া যায়নি',               en: 'No donors found' },
  search_no_results_sub: { bn: 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন', en: 'Try changing the filters' },
  search_loading:        { bn: 'লোড হচ্ছে...',                           en: 'Loading...' },
  search_btn:            { bn: 'খুঁজুন',                                 en: 'Search' },

  // ── Request page ─────────────────────────────────────────────────────────
  request_title:      { bn: 'রক্তের অনুরোধ করুন',         en: 'Request Blood' },
  request_sub:        { bn: 'জরুরি রক্তের প্রয়োজনে অনুরোধ করুন', en: 'Submit an urgent blood request' },
  request_name:       { bn: 'আবেদনকারীর নাম',              en: 'Requester Name' },
  request_phone:      { bn: 'ফোন নম্বর',                   en: 'Phone Number' },
  request_units:      { bn: 'কত ব্যাগ লাগবে',               en: 'Units Needed' },
  request_notes:      { bn: 'অতিরিক্ত তথ্য',               en: 'Additional Notes' },
  request_urgency:    { bn: 'জরুরি মাত্রা',                 en: 'Urgency' },
  request_submit:     { bn: 'অনুরোধ পাঠান',                 en: 'Submit Request' },
  request_submitting: { bn: 'পাঠানো হচ্ছে...',              en: 'Submitting...' },
  request_success:    { bn: 'অনুরোধ সফলভাবে পাঠানো হয়েছে!', en: 'Request submitted successfully!' },

  // ── Profile page ─────────────────────────────────────────────────────────
  profile_title:              { bn: 'আমার প্রোফাইল',                    en: 'My Profile' },
  profile_donor_info:         { bn: 'দাতার তথ্য',                       en: 'Donor Information' },
  profile_not_registered:     { bn: 'আপনি এখনো দাতা হিসেবে নিবন্ধিত নন', en: 'You are not registered as a donor yet' },
  profile_edit:               { bn: 'সম্পাদনা করুন',                    en: 'Edit' },
  profile_save:               { bn: 'সংরক্ষণ করুন',                     en: 'Save' },
  profile_cancel:             { bn: 'বাতিল',                             en: 'Cancel' },
  profile_availability:       { bn: 'উপলব্ধতা',                         en: 'Availability' },
  profile_toggle_available:   { bn: 'উপলব্ধ হিসেবে চিহ্নিত করুন',       en: 'Mark as Available' },
  profile_toggle_unavailable: { bn: 'অনুপলব্ধ হিসেবে চিহ্নিত করুন',     en: 'Mark as Unavailable' },
  profile_pending_verification: { bn: 'যাচাইয়ের অপেক্ষায়',             en: 'Pending Verification' },
  profile_verified_donor:     { bn: 'যাচাইকৃত দাতা',                    en: 'Verified Donor' },

  // ── Admin ────────────────────────────────────────────────────────────────
  admin_title:          { bn: 'অ্যাডমিন প্যানেল', en: 'Admin Panel' },
  admin_total_donors:   { bn: 'মোট দাতা',           en: 'Total Donors' },
  admin_verified:       { bn: 'যাচাইকৃত',            en: 'Verified' },
  admin_pending:        { bn: 'অপেক্ষমান',           en: 'Pending' },
  admin_available:      { bn: 'উপলব্ধ',              en: 'Available' },
  admin_all:            { bn: 'সকল',                  en: 'All' },
  admin_unverified:     { bn: 'অযাচাইকৃত',            en: 'Unverified' },
  admin_verify:         { bn: 'যাচাই করুন',           en: 'Verify' },
  admin_unverify:       { bn: 'যাচাই বাতিল',          en: 'Unverify' },
  admin_delete:         { bn: 'মুছুন',                en: 'Delete' },
  admin_delete_confirm: { bn: 'আপনি কি নিশ্চিত?',    en: 'Are you sure?' },

  // ── Forms ────────────────────────────────────────────────────────────────
  form_required:          { bn: 'প্রয়োজন',                               en: 'Required' },
  form_invalid_email:     { bn: 'সঠিক ইমেইল দিন',                        en: 'Enter a valid email' },
  form_min_password:      { bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', en: 'Password must be at least 6 characters' },
  form_select:            { bn: 'নির্বাচন করুন',                          en: 'Select' },
  form_name:              { bn: 'পুরো নাম',                               en: 'Full Name' },
  form_email:             { bn: 'ইমেইল',                                  en: 'Email' },
  form_phone:             { bn: 'ফোন নম্বর',                             en: 'Phone Number' },
  form_blood_group:       { bn: 'রক্তের গ্রুপ',                           en: 'Blood Group' },
  form_location:          { bn: 'এলাকা',                                  en: 'Location' },
  form_password:          { bn: 'পাসওয়ার্ড',                             en: 'Password' },
  form_last_donation:     { bn: 'সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)',       en: 'Last Donation Date (optional)' },
  form_name_placeholder:  { bn: 'আপনার পূর্ণ নাম',                        en: 'Your full name' },
  form_phone_placeholder: { bn: '০১৭০০-০০০০০০',                          en: '01700-000000' },

  // ── Register page ────────────────────────────────────────────────────────
  reg_title:        { bn: 'রক্তদাতা হিসেবে নিবন্ধন',         en: 'Register as Blood Donor' },
  reg_sub:          { bn: 'আপনার তথ্য দিয়ে একটি জীবন বাঁচান', en: 'Fill your details and save a life' },
  reg_submit:       { bn: 'নিবন্ধন করুন',                      en: 'Register' },
  reg_submitting:   { bn: 'নিবন্ধন হচ্ছে...',                   en: 'Registering...' },
  reg_have_account: { bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',          en: 'Already have an account?' },
  reg_login_link:   { bn: 'লগইন করুন',                          en: 'Login' },

  // ── Login page ───────────────────────────────────────────────────────────
  login_title:         { bn: 'লগইন করুন',                      en: 'Login' },
  login_sub:           { bn: 'আপনার অ্যাকাউন্টে প্রবেশ করুন', en: 'Access your account' },
  login_submit:        { bn: 'লগইন করুন',                      en: 'Login' },
  login_submitting:    { bn: 'লগইন হচ্ছে...',                   en: 'Logging in...' },
  login_no_account:    { bn: 'অ্যাকাউন্ট নেই?',                en: "Don't have an account?" },
  login_register_link: { bn: 'নিবন্ধন করুন',                   en: 'Register' },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer_tagline: { bn: 'প্রতিটি ফোঁটা রক্ত একটি জীবন বাঁচাতে পারে', en: 'Every drop of blood can save a life' },
  footer_powered: { bn: 'পরিচালিত: উরকিরচর শান্তি সংঘ',               en: 'Powered by Urkirchar Shanti Shanga' },
};
