import { supabase } from '../supabaseClient';

export async function prosesAsesmen(formData) {
  const { data: hasilRule, error: errorRule } = await supabase.functions.invoke('rule-engine', {
    body: {
      gender: formData.gender,
      weight_kg: formData.weight_kg,
      height_cm: formData.height_cm,
      age: formData.age,
      goal: formData.goal,
    },
  });

  if (errorRule || hasilRule?.error) {
    console.error('Error rule engine:', errorRule || hasilRule?.error);
    return;
  }

  const { data: hasilGemini, error: errorGemini } = await supabase.functions.invoke('gemini-proxy', {
    body: {
      macro_target: hasilRule.macro_target,
      food_catalog: hasilRule.food_catalog,
    },
  });

  if (errorGemini || hasilGemini?.error) {
    console.error('Error gemini proxy:', errorGemini || hasilGemini?.error);
    return;
  }

  const rekomendasi = hasilGemini.rekomendasi || [];
  if (rekomendasi.length > 0) {
    const { data: { user } } = await supabase.auth.getUser();
    const recsToInsert = rekomendasi.map((r) => ({
      profile_id: user.id,
      macro_target_id: hasilRule.macro_target.id,
      food_name: r.food_name,
      portion: r.portion,
      kalori: r.kalori,
      protein_g: r.protein_g,
      carbs_g: r.carbs_g,
      lemak_g: r.lemak_g,
      serat_g: r.serat_g,
      meal_type: r.meal_type,
      notes: r.notes,
    }));
    await supabase.from('food_recommendations').insert(recsToInsert);
  }

  return {
    macro_target: hasilRule.macro_target,
    rekomendasi,
  };
}