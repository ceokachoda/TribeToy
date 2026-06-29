import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhcfonlvmcxbirfbvprq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoY2Zvbmx2bWN4YmlyZmJ2cHJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQwODg5MCwiZXhwIjoyMDk3OTg0ODkwfQ.pX6BHOhJVlzcLvWp7cfqWNfY7gOyFnYxW2s9N94WSxQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSave() {
  const globalSettings = {
    store_email: "support@tribetoy.in",
    store_phone: "+91 99999 99999",
    gst_percentage: 18,
    razorpay_key_id: "",
    shipping_flat_rate: 100,
    razorpay_key_secret: "",
    free_shipping_threshold: 1000
  };

  const senderInfo = {
    sender_name: "TribeToy",
    sender_address: "123 Toy Street",
    sender_city: "Mumbai",
    sender_state: "Maharashtra",
    sender_pincode: "400001",
    sender_phone: "+91 99999 99999"
  };

  console.log("Saving site_settings...");
  const { error: err1 } = await supabase
    .from("site_settings")
    .upsert({ 
      key: "global_settings", 
      value: globalSettings,
      updated_at: new Date().toISOString()
    }, { onConflict: "key" });
  console.log("site_settings error:", err1?.message);

  console.log("Saving settings...");
  const { error: err2 } = await supabase
    .from("settings")
    .upsert({ id: 1, ...senderInfo });
  console.log("settings error:", err2?.message);
}

testSave();
