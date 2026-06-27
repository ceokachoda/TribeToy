import { createClient } from "@supabase/supabase-js";

async function fixConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing env");
  
  const client = createClient(url, key);
  const { data } = await client.from('site_settings').select('value').eq('key', 'homepage_cms_config').single();
  
  if (data && data.value) {
    let config = data.value;
    const heroIndex = config.sections.findIndex((s: any) => s.type === 'hero');
    if (heroIndex !== -1 && config.sections[heroIndex].data) {
      config.sections[heroIndex].data.video_url = '';
      config.sections[heroIndex].data.hero_image = '';
      await client.from('site_settings').update({ value: config }).eq('key', 'homepage_cms_config');
      console.log('Fixed DB config');
    }
  }
}

fixConfig();
