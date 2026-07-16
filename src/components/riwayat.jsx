import { supabase } from '../supabaseClient';

export async function ambilRiwayatUntukGrafik() {
  const { data, error } = await supabase
    .from('daily_food_totals')
    .select('*')
    .order('rec_date', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
